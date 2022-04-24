import WeakMatrix from './WeakMatrix';

const DEBUG = true;
const LOG_PREFIX = '[longpress]';
const LONG_PRESS_DELAY = 500;
const MAX_X_DISTANCE = 10;
const MAX_Y_DISTANCE = 10;

const weakMatrix = new WeakMatrix();

export function addLongPressListener(element, eventHandler) {
  if (DEBUG) console.log(LOG_PREFIX, 'addLongPressListener', element, eventHandler);

  let timer;
  let originalEvent;
  let customEvent;
  let initialPoint = [];

  element.addEventListener('mousedown', startHandler);
  element.addEventListener('touchstart', startHandler);

  function dispatchEvent() {
    customEvent = new originalEvent.constructor('longpress', {
      ...originalEvent,

      bubbles: true,
      cancelable: true,

      detail: {
        // custom event data (legacy)
        clientX: originalEvent.clientX,
        clientY: originalEvent.clientY,
        originalEvent,
      },


      // add coordinate data that would typically acompany a touch/click event
      clientX: originalEvent.clientX,
      clientY: originalEvent.clientY,
      offsetX: originalEvent.offsetX,
      offsetY: originalEvent.offsetY,
      pageX: originalEvent.pageX,
      pageY: originalEvent.pageY,
      screenX: originalEvent.screenX,
      screenY: originalEvent.screenY,
    });

    //dispatch longpress event
    if (DEBUG) console.log(LOG_PREFIX, 'dispatch longpress', customEvent);
    eventHandler.call(element, customEvent);

    if (customEvent.defaultPrevented) {
      if (DEBUG) console.log(LOG_PREFIX, 'prevented default');
      originalEvent.preventDefault(); // prevent default action

      // suppress the next click event if e.preventDefault() was called in long-press handler
      document.addEventListener('click', function suppressClickEvent(e) {
        document.removeEventListener('click', suppressClickEvent, true);
        // cancel event
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
      }, true);

      stopHandler(originalEvent);
    }
  }

  function startHandler(e) {
    if (DEBUG) console.log(LOG_PREFIX, 'startHandler', e);

    originalEvent = e;
    timer = setTimeout(dispatchEvent, LONG_PRESS_DELAY);

    element.addEventListener('mouseup', stopHandler);
    element.addEventListener('mouseleave', cancelHandler);
    element.addEventListener('mousemove', moveHandler);

    element.addEventListener('touchend', stopHandler);
    element.addEventListener('touchcancel', cancelHandler);
    element.addEventListener('touchmove', moveHandler);

    initialPoint = [e.clientX ?? e.touches[0].clientX, e.clientY ?? e.touches[0].clientY];
  }

  function moveHandler(e) {
    if (DEBUG) console.log(LOG_PREFIX, 'moveHandler', e);

    const x = e.clientX ?? e.touches[0].clientX;
    const y = e.clientY ?? e.touches[0].clientY;

    // cancel long-press if the user has moved too far
    if (Math.abs(x - initialPoint[0]) > MAX_X_DISTANCE || Math.abs(y - initialPoint[1]) > MAX_Y_DISTANCE) {
      if(DEBUG) console.log(LOG_PREFIX, 'too far, canceled!');
      stopHandler(e);
    }
  }

  function stopHandler(e) {
    if (DEBUG) console.log(LOG_PREFIX, 'stopHandler', e);
    clearTimeout(timer);

    if (customEvent?.defaultPrevented) {
      if (DEBUG) console.log(LOG_PREFIX, 'stopHandler defaultPrevented', customEvent);
      e.preventDefault();
      e.returnValue = false;
      clearIosSelection();
    }

    element.removeEventListener('mouseup', stopHandler);
    element.removeEventListener('mouseleave', cancelHandler);
    element.removeEventListener('mousemove', moveHandler);
    element.removeEventListener('touchend', stopHandler);
    element.removeEventListener('touchcancel', cancelHandler);
    element.removeEventListener('touchmove', moveHandler);
  }

  function cancelHandler(e) {
    if (DEBUG) console.log(LOG_PREFIX, 'cancelHandler', e);
    clearTimeout(timer);

    element.removeEventListener('mouseup', stopHandler);
    element.removeEventListener('mouseleave', stopHandler);
    element.removeEventListener('mousemove', cancelHandler);
    element.removeEventListener('touchend', stopHandler);
    element.removeEventListener('touchcancel', cancelHandler);
    element.removeEventListener('touchmove', moveHandler);
  }

  weakMatrix.set(element, eventHandler, { timer, startHandler, stopHandler, cancelHandler, moveHandler });
}

export function removeLongPressListener(element, eventHandler) {
  const event = weakMatrix.get(element, eventHandler);
  if (event) {
    weakMatrix.delete(element, eventHandler);
    const { timer, startHandler, stopHandler, cancelHandler, moveHandler } = event;
    // clear mouse event listeners
    element.removeEventListener('mousedown', startHandler);
    element.removeEventListener('mouseup', stopHandler);
    element.removeEventListener('mouseleave', cancelHandler);
    element.removeEventListener('mousemove', moveHandler);
    // clear touch event listeners
    element.removeEventListener('touchstart', startHandler);
    element.removeEventListener('touchend', stopHandler);
    element.removeEventListener('touchcancel', cancelHandler);
    element.removeEventListener('touchmove', moveHandler);
    // clear timeout
    clearTimeout(timer);
  }

}

function clearIosSelection() {
  if (DEBUG) console.log(LOG_PREFIX, 'clearSelection');
  //   const c = document.documentElement.style.webkitUserSelect;
  document.documentElement.style.webkitUserSelect = 'none';
  document.documentElement.style.mozUserSelect = 'none';
  document.documentElement.style.userSelect = 'none';
  setTimeout(() => {
    document.documentElement.style.webkitUserSelect = '';
    document.documentElement.style.mozUserSelect = '';
    document.documentElement.style.userSelect = '';
  }, 500);
}

