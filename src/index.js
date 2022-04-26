import directive from './v-context-menu';
import ContextMenuProvider from './ContextMenuProvider';
import { triggerMenu } from './bridge';

const plugin = {
  install(Vue, installOptions) {
    Vue.directive(directive.name, directive);
    Vue.component(ContextMenuProvider.name, ContextMenuProvider);
    Vue.prototype.$triggerContextMenu = triggerMenu;
  },
  directive,
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
