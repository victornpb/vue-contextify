import directive from './v-context-menu';
const DIRECTIVE = 'context-menu';

import ContextMenu from './ContextMenu';

const plugin = {
  name: DIRECTIVE,
  install(Vue, installOptions) {
    Vue.directive(DIRECTIVE, directive);

    Vue.component(ContextMenu.name, ContextMenu);
  },
  directive,
};

export default plugin;
