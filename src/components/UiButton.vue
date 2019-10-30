<template>
<button
  :class="[container, { [stateDisabled]: disabled, [hasRadius]: hasBorderRadius } ]"
  @click="onClick"
>
  <span :class="before">
    <slot name="before" />
  </span>

  <div :class="main">
    <slot />
  </div>

  <span :class="after">
    <slot name="after" />
  </span>
</button>
</template>

<script>
export default {
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    hasBorderRadius: {
      default: true,
      type: Boolean,
    },
  },
  computed: {
    container() {
      return this.$style.container;
    },
    stateDisabled() {
      return this.$style._disabled;
    },
    main() {
      return this.$style.main;
    },
    before() {
      return this.$style.before;
    },
    after() {
      return this.$style.after;
    },
    hasRadius() {
      return this.$style._hasRadius;
    },
  },
  mounted() {
    this.$addCssRules({
      [`.${this.container}`]: {
        color: this.$gui.buttonColor,
        'background-color': this.$gui.buttonBoxColor,
        'justify-content': this.$gui.buttonAlign,
      },
      [`.${this.container}:hover`]: {
        'background-color': this.$gui.buttonHoverBoxColor,
      },
      [`.${this.container}:active`]: {
        'background-color': this.$gui.buttonActiveBoxColor,
      },
      [`.${this.container}.${this.stateDisabled}`]: {
        opacity: this.$gui.buttonDisabledOpacity,
      },
      [`.${this.before}`]: {
        color: this.$gui.buttonBeforeColor,
      },
      [`.${this.before} > svg`]: {
        fill: this.$gui.buttonBeforeColor,
      },
      [`.${this.after}`]: {
        color: this.$gui.buttonAfterColor,
      },
    });
  },
  methods: {
    onClick(event) {
      // If button has disabled we shoudn't send events
      if (this.disabled) {
        return;
      }

      this.$emit('click', event);
    },
  },
};
</script>

<style module lang="scss">
$after-margin: 12px;
$before-margin: 12px;
$font-size: 20px;
$font-weight: 700;
$height: 70px;
$padding: 0 24px;
$align: center;
$border-width: 0;
$border-color: transparent;
$disabled-opacity: 0.7;
$border-radius: 12px;
$transition: background-color 0.2s ease-out, color 0.2s ease-out;

.container {
  cursor: pointer;
  outline-width: 0;
  position: relative;
  display: inline-flex;
  font-family: inherit;
  font-size: $font-size;
  font-weight: $font-weight;
  height: $height;
  padding: $padding;
  align-items: center;
  justify-content: $align;
  border-width: $border-width;
  transition: $transition;
  vertical-align: top;
  white-space: nowrap;
  text-align: center;

  &._hasRadius {
    border-radius: $border-radius;
  }

  &._disabled {
    pointer-events: none;
    opacity: $disabled-opacity;
  }
}
.main,
.before,
.after {
  &:empty {
    display: none;
  }
}
.before {
  margin-left: $before-margin;
  margin-right: $before-margin;
}
.after {
  margin-left: $after-margin;
  margin-right: $after-margin;
}
</style>
