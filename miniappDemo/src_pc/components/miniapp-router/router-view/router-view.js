Component({
  mixins: [],
  data: {
    name: '',
    query: {},
    params: {},
  },
  props: {},
  didMount: function() {
    if (!this.$page.__routerInstance)
      throw new Error('[miniapp-router] routerInstance not found');
    this.$page.__routerInstance.registerComponent(this);
  },
  didUnmount: function() {
    this.$page.__routerInstance.removeComponent(this);
  },
  methods: {},
});
