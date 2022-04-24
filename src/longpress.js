import WeakMatrix from './WeakMatrix';
const LONG_PRESS_DELAY = 1500;

const weakMatrix = new WeakMatrix();

export function addLongPressListener(element, eventHandler) {
  console.log('[longpress] addLongPressListener', element, eventHandler);
  let timer;
  let originalEvent;
  let customEvent;

  element.addEventListener('mousedown', startHandler);
  element.addEventListener('touchstart', startHandler);

  function dispatchEvent() {
    // stopHandler();
    customEvent = new originalEvent.constructor('longpress', {
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
    console.log('dispatch longpress', customEvent);
    eventHandler.call(element, customEvent);

    if (customEvent.defaultPrevented) {
      console.log('prevented default');
      originalEvent.preventDefault(); // prevent default action

      // suppress the next click event if e.preventDefault() was called in long-press handler
      document.addEventListener('click', function suppressClickEvent(e) {
        document.removeEventListener('click', suppressClickEvent, true);
        // cancel event
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
      }, true);
    }
  }

  function startHandler(e) {
    console.log('startHandler', e);
    originalEvent = e;
    timer = setTimeout(dispatchEvent, LONG_PRESS_DELAY);

    element.addEventListener('mouseup', stopHandler);
    element.addEventListener('mouseleave', stopHandler);
    element.addEventListener('touchend', stopHandler);
    element.addEventListener('touchcancel', cancelHandler);
  }

  function stopHandler(e) {
    console.log('stopHandler', e);
    clearTimeout(timer);
    element.removeEventListener('mouseup', stopHandler);
    element.removeEventListener('mouseleave', stopHandler);
    element.removeEventListener('touchend', stopHandler);
    element.removeEventListener('touchcancel', cancelHandler);
    if (customEvent?.defaultPrevented) {
      console.log('stopHandler prevented default 2');
      e.preventDefault();
      e.returnValue = false;
      clearDocumentSelection();
    }
  }

  function cancelHandler(e) {
    console.log('cancelHandler', e);
    clearTimeout(timer);
  }

  weakMatrix.set(element, eventHandler, { timer, startHandler, stopHandler, cancelHandler });
}

export function removeLongPressListener(element, eventHandler) {
  const event = weakMatrix.get(element, eventHandler);
  if(event) {
    const { timer, startHandler, stopHandler, cancelHandler } = event;
    weakMatrix.delete(element, eventHandler);
    clearTimeout(timer);
    element.removeEventListener('mousedown', startHandler);
    element.removeEventListener('touchstart', startHandler);
    element.removeEventListener('mouseup', stopHandler);
    element.removeEventListener('mouseleave', stopHandler);
    element.removeEventListener('touchend', stopHandler);
    element.removeEventListener('touchcancel', cancelHandler);
  }

}

function clearDocumentSelection() {
  console.log('clearSelection');
  if (document.selection) {
    document.selection.empty();
  } else if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
  document.body.style.webkitUserSelect = 'none';
  setTimeout(() => {
    document.body.style.webkitUserSelect = '';
  }, 500);
}

