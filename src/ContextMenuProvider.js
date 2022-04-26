import { registerMenu, unregisterMenu } from './bridge.js';
import { DEBUG, LOG_PREFIX, COMPONENT_NAME } from './constants';

export default {
  name: COMPONENT_NAME,
  props: {
    name: {
      type: String,
    },
  },
  data() {
    return {
      enabled: false,
      data: undefined,
      event: undefined,
    };
  },
  mounted() {
    if (DEBUG) console.log(LOG_PREFIX, 'created', this.name);
    registerMenu(this.name, this);
  },
  beforeDestroy() {
    unregisterMenu(this.name, this);
  },

  methods: {
    set(data, event) {
      this.data = data;
      this.event = event;
      this.enabled = true;
    },
    toggle(bool) {
      if (bool === undefined) {
        this.enabled = !this.enabled;
      } else {
        this.enabled = bool;
      }
    },
  },
  render(h) {
    const scopedSlotData = {
      item: this.data,
      data: this.data,

      enabled: this.enabled,
      event: this.event,
      toggle: this.toggle,
    };
    return this.enabled ? this.$scopedSlots.default(scopedSlotData) : undefined;
  },
};