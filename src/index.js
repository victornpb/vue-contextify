const DIRECTIVE = 'context-menu';
import directive from './v-context-menu';
import ContextMenuProvider from './ContextMenuProvider';

const plugin = {
  name: DIRECTIVE,
  install(Vue, installOptions) {
    Vue.directive(DIRECTIVE, directive);
    Vue.component(ContextMenuProvider.name, ContextMenuProvider);
  },
  directive,
};

export default plugin;
