
import { triggerMenu } from './bridge.js';
import { addLongPressListener, removeLongPressListener } from './longpress.js';

const stateMap = new WeakMap(); // store nodes using the directive, HTMLDocument as key

function newState(binding) {
  return {
    binding: binding, // directive binding object
    isVisible: false, // current state of this Node (used for skipping doing unneeded work)
    tooltipElm: undefined, // reference to the current tooltip element (lazy)
    content: undefined, // the content of the tooltip (lazy)
    margin: 5,
  };
}

function eventHandler(e) {
  console.log('[v-context-menu] eventHandler', e);
  e.preventDefault();
  const state = stateMap.get(this);

  // name of the menu, as modifier
  const name = Object.keys(state.binding.modifiers)[0];

  triggerMenu(name, state.binding.value, e);
}


export default {
  bind(el, binding) {
    console.log('[v-context-menu] bind directive', el, binding);
    stateMap.set(el, newState(binding));

    el.addEventListener('contextmenu', eventHandler);
    addLongPressListener(el, eventHandler);
  },
  update(el, binding) {
    console.log('[v-context-menu] update directive', el, binding);
    const state =  stateMap.get(el);
    state.binding = binding;
  },
  unbind(el, _binding) {
    console.log('[v-context-menu] unbind directive', el, _binding);
    const state = stateMap.get(el);
    stateMap.delete(el);

    el.removeEventListener('contextmenu', eventHandler);
    removeLongPressListener(el, eventHandler);
  },
};
