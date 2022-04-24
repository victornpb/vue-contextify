const contextMenuInstances = new Map();

export function triggerMenu(name, data, event) {
  const MenuView = contextMenuInstances.get(name);
  if (MenuView) {
    MenuView.open(data, event);
  }
  else throw new Error(`No menu with name ${name}`);
}

export function registerMenu(name, view) {
  if (contextMenuInstances.has(name)) {
    throw new Error(`Duplicate menu name! A menu with name ${name} already exists.`);
  }
  console.info('ContextMenu registered!', name, view);
  contextMenuInstances.set(name, view);
}

export function unregisterMenu(name, view) {
  console.info('ContextMenu unregistered!', name, view);
  contextMenuInstances.delete(name);
}