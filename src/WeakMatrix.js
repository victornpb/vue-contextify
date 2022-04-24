
// bi-dimensional WeakMap implementation
export default class WeakMatrix {
  #map = new WeakMap();

  set(key1, key2, value) {
    let map2 = this.#map.get(key1);
    if (!map2) {
      map2 = new WeakMap();
      this.#map.set(key1, map2);
    }
    map2.set(key2, value);
  }

  get(key1, key2) {
    return this.#map.get(key1)?.get(key2);
  }

  has(key1, key2) {
    const map = this.#map.get(key1);
    if (!map) return false;
    return map.has(key2);
  }

  delete(key1, key2) {
    const map = this.#map.get(key1);
    if (!map) return false;
    return map.delete(key2);
  }

  clear(key1) {
    if (key1!==undefined) this.#map.get(key1)?.clear();
    else this.#map.clear();
  }
}
