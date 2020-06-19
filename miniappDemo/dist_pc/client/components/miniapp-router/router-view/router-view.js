'use strict';

Component({
  mixins: [],
  data: {
    name: '',
    query: {},
    params: {}
  },
  props: {},
  didMount: function didMount() {
    if (!this.$page.__routerInstance) throw new Error('[miniapp-router] routerInstance not found');
    this.$page.__routerInstance.registerComponent(this);
  },
  didUnmount: function didUnmount() {
    this.$page.__routerInstance.removeComponent(this);
  },
  methods: {}
});