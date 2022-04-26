
import { triggerMenu } from './bridge.js';
import { addLongPressListener, removeLongPressListener } from './longpress.js';
import { DEBUG, LOG_PREFIX, DIRECTIVE_NAME } from './constants';

const stateMap = new WeakMap(); // store nodes using the directive, HTMLDocument as key

function newState(binding) {
  return {
    binding: binding, // directive binding object
    name: '',
  };
}

function eventHandler(e) {
  if (DEBUG) console.log(LOG_PREFIX, 'eventHandler', e);
  e.preventDefault();
  const state = stateMap.get(this);

  // trigger the menu
  triggerMenu(state.name, state.binding.value, e);
}

export default {
  name: DIRECTIVE_NAME,
  bind(el, binding) {
    if (DEBUG) console.log(LOG_PREFIX, 'bind directive', el, binding);
    const state = newState(binding);
    stateMap.set(el, state);

    // name of the menu, as modifier
    const name = Object.keys(binding.modifiers)[0];
    if (name === undefined) throw new Error(LOG_PREFIX + ' You need to provide a name, as modifier!');
    state.name = name;

    el.addEventListener('contextmenu', eventHandler);
    addLongPressListener(el, eventHandler);
  },
  update(el, binding) {
    if (DEBUG) console.log(LOG_PREFIX, 'update directive', el, binding);
    const state = stateMap.get(el);
    state.binding = binding;
  },
  unbind(el, _binding) {
    if (DEBUG) console.log(LOG_PREFIX, 'unbind directive', el, _binding);
    // const state = stateMap.get(el);
    stateMap.delete(el);

    el.removeEventListener('contextmenu', eventHandler);
    removeLongPressListener(el, eventHandler);
  },
};
