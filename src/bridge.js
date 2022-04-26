const DEBUG = false;
const LOG_PREFIX = '[VContext bridge]';

const contextMenuInstances = new Map();

export function triggerMenu(name, data, event) {
  const ContextMenuProvider = contextMenuInstances.get(name);
  if (ContextMenuProvider) {
    // call view method
    ContextMenuProvider.set(data, event);
  }
  else throw new Error(`There are currently no ContextMenuProvider with the name '${name}'! Please add a ContextMenuProvider component instance to the document.`);
}

export function registerMenu(name, view) {
  if (contextMenuInstances.has(name)) {
    throw new Error(`Duplicated ContextMenuProvider name! A ContextMenuProvider with name '${name}' already exists. Names must be unique.`);
  }
  if (DEBUG) console.info(LOG_PREFIX, 'registered!', name, view);
  contextMenuInstances.set(name, view);
}

export function unregisterMenu(name, view) {
  if (DEBUG) console.info(LOG_PREFIX, 'unregistered!', name, view);
  contextMenuInstances.delete(name);
}
