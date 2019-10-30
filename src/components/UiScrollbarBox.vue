<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';

export default {
  components: {
    VuePerfectScrollbar,
  },
  props: {
    settings: {
      type: Object,
    },
    isUpdateOnClick: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      innerSettings: { ...this.settings },
    };
  },
  created() {
    this.$addCssRules({
      '.ui-scrollbar-box > .ps__scrollbar-y-rail > .ps__scrollbar-y::before': {
        'background-color': this.$gui.scrollbarColor,
      },
    });
  },
  mounted() {
    this.innerSettings = {
      ...this.innerSettings,
      swicher: false,
    };

    if (this.isUpdateOnClick) {
      window.addEventListener('click', this.update);
    }
  },
  beforeDestroy() {
    window.removeEventListener('click', this.update);
  },
  methods: {
    update() {
      this.$nextTick(() => {
        this.$refs.scrollbar.update();
      });
    },
  },
};
</script>

<template>
<VuePerfectScrollbar
  class="ui-scrollbar-box"
  ref="scrollbar"
  :settings="innerSettings"
>
  <slot></slot>
</VuePerfectScrollbar>
</template>

<style lang="scss">
.ui-scrollbar-box {
  & > .ps__scrollbar-y-rail > .ps__scrollbar-y {
    background-color: transparent !important;
    right: 1px !important;
    width: 100%;

    &::before {
      content: '';
      width: 3px;
      position: absolute;
      right: 4px;
      top: 0;
      bottom: 0;
      border-radius: 4px;
    }
  }

  &.ps > .ps__scrollbar-y-rail {
    cursor: pointer;
    opacity: 0;
  }

  &.ps:hover > .ps__scrollbar-y-rail,
  &.ps:hover.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail,
  &.ps.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail {
    background-color: transparent;
    opacity: 0.6;
  }
}
</style>
