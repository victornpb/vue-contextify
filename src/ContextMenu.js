import { registerMenu, unregisterMenu } from './bridge.js';

export default {
  name: 'VContextMenu',
  props: {
    name: {
      type: String,
    },
  },
  data() {
    return {
      opened: false,
      data: undefined,
      event: undefined,
    };
  },
  created() {
    console.log('ContextMenu created', this.name);
    registerMenu(this.name, this);
  },
  mounted() {

  },
  beforeDestroy() {
    unregisterMenu(this.name, this);
  },
  beforeUpdate() {

  },
  updated() {

  },
  methods: {
    open(data, event) {
      this.data = data;
      this.event = event;
      this.opened = true;
    },
    close() {
      this.opened = false;
    }
  },
  render(h) {
    const scopedSlotData = {
      item: this.data,
      opened: this.opened,
      event: this.event,
      close: this.close,
    };
    return this.opened ? this.$scopedSlots.default(scopedSlotData) : undefined;
  },
};