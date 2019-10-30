<template>
<div :class="[container, { [stateDisabled]: disabled, [$style._hasInfoIcon]: hasInfoIcon }]">
  <TheMask
    v-if="mask"
    v-bind="{ disabled, required, type, ...$attrs }"
    v-model="innerValue"
    :class="inputClasses"
    :mask="mask"
    :tokens="maskTokens"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="$emit('input', innerValue)"
  />
  <input
    v-else
    v-bind="{ disabled, required, type, ...$attrs }"
    v-model="innerValue"
    :class="inputClasses"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="$emit('input', innerValue)"
  />
  <label
    :class="labelClass"
    :title="label"
  >
    {{ label }}
  </label>
  <span
    :class="[$style.error, { [$style._showed]: isVisibleError }]"
    :title="errorText"
  >
    {{ errorText }}
  </span>
</div>
</template>

<script>
import { includes } from 'lodash-es';
import { TheMask } from 'vue-the-mask';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  components: {
    // eslint-disable-next-line
    TheMask,
  },
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    errorText: {
      default: '',
      type: String,
    },
    hasError: {
      default: false,
      type: Boolean,
    },
    label: {
      default: '',
      type: String,
    },
    mask: {
      default: null,
      type: String,
    },
    required: {
      default: false,
      type: Boolean,
    },
    hasInfoIcon: {
      default: false,
      type: Boolean,
    },
    type: {
      default: 'text',
      type: String,
      validator(val) {
        return includes(['text', 'password', 'email', 'tel', 'number'], val);
      },
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  data() {
    return {
      innerValue: this.value,

      maskTokens: {
        '#': { pattern: /\d/ },
        X: { pattern: /[0-9a-zA-Z]/ },
        S: { pattern: /[a-zA-Z]/ },
        A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
        '!': { escape: true },
        U: { pattern: /[a-zA-Z\s]/, transform: v => v.toLocaleUpperCase() },
      },
    };
  },
  computed: {
    container() {
      return this.$style.container;
    },
    input() {
      return this.$style.input;
    },
    labelClass() {
      return this.$style.label;
    },
    errorClass() {
      return this.$style.error;
    },
    stateDisabled() {
      return this.$style._disabled;
    },
    stateEmpty() {
      return this.$style._empty;
    },
    stateError() {
      return this.$style._error;
    },
    isEmpty() {
      return !this.value && this.value !== 0;
    },
    /**
     * Error is visible if it exists and error text isn't empty
     * @return {boolean}
     */
    isVisibleError() {
      return !!(this.hasError && this.errorText);
    },
    /**
     * Classes for input
     * @return {Array<string>}
     */
    inputClasses() {
      return [
        this.input,
        this.$style[`_${this.type}`] || '',
        this.isEmpty ? this.stateEmpty : '',
        this.isVisibleError ? this.stateError : '',
        this.disabled ? this.stateDisabled : '',
      ];
    },
  },
  watch: {
    value(value) {
      this.innerValue = value;
    },
  },
  mounted() {
    this.$addCssRules({
      [`.${this.container}.${this.stateDisabled}`]: {
        opacity: this.$gui.inputDisabledOpacity,
      },
      [`.${this.input}`]: {
        color: this.$gui.inputColor,
        'background-color': this.$gui.inputBoxColor,
        'border-color': this.$gui.inputBorderColor,
      },
      [`.${this.input}:-webkit-autofill, .${this.input}:-internal-autofill-selected`]: {
        '-webkit-box-shadow': `inset 0 0 0 50px ${this.$gui.formBackgroundColor}`,
        '-webkit-text-fill-color': this.$gui.inputColor,
      },
      [`.${this.input}:hover`]: {
        'border-color': this.$gui.inputHoverBorderColor,
      },
      [`.${this.input}:focus`]: {
        'border-color': this.$gui.inputFocusBorderColor,
      },
      [`
        .${this.input}:focus ~ .${this.labelClass},
        .${this.input}:not(:focus):not(.${this.stateEmpty}) ~ .${this.labelClass}
      `]: {
        color: this.$gui.inputFocusLabelColor,
      },
      [`.${this.input}.${this.stateError}`]: {
        'border-color': this.$gui.errorBorderColor,
      },
      [`.${this.labelClass}`]: {
        color: this.$gui.inputLabelColor,
      },
      [`.${this.errorClass}`]: {
        'background-color': this.$gui.errorBoxColor,
        color: this.$gui.errorColor,
      },
    });
  },
  methods: {
    focus() {
      this.$el.querySelector('input').focus();
    },
  },
};
</script>

<style module lang="scss">
$error-font-size: 10px;
$error-font-weight: 600;
$error-height: 17px;

$disabled-opacity: 0.5;

$input-box-color: transparent;
$input-font-weight: 300;
$input-transition: border-color 0.2s ease-out;

$label-transition: transform 0.2s ease-out, color 0.2s ease-out;

$main-font-size: 15px;
$main-height: 24px;
$main-additional-height: 18px;

.container {
  display: inline-block;
  padding: $main-additional-height 0;
  position: relative;
  width: 100%;
  font-style: normal;
  font-weight: $input-font-weight;
  text-align: left;
  vertical-align: top;

  &._disabled {
    opacity: $disabled-opacity;
    pointer-events: none;
  }
}

.input {
  border-width: 0;
  border-bottom-width: 1px;
  box-sizing: border-box;
  display: block;
  font-family: inherit;
  font-weight: $input-font-weight;
  font-size: $main-font-size;
  height: $main-height;
  line-height: $main-height;
  outline: none;
  padding: 0;
  transition: $input-transition;
  width: 100%;
  border-radius: 0;
  appearance: none;

  &:focus ~ .label,
  &:not(:focus):not(._empty) ~ .label {
    transform: translateY(-$main-additional-height) scale(0.75, 0.75);
    width: 130%;
  }

  &:focus ~ .label {
    pointer-events: auto;
  }

  &._error {
    opacity: 1;
  }
}

.label {
  line-height: $main-height;
  margin: 0;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: $main-font-size;
  pointer-events: none;
  top: $main-additional-height;
  transition: $label-transition;
  width: 100%;
  transform-origin: left;
  left: 0;
  text-align: left;

  .container._hasInfoIcon & {
    width: calc(100% - 12px);
  }

  @include if-rtl {
    transform-origin: right;
    right: 0;
    text-align: right;
  }
}

.error {
  top: $main-height + $main-additional-height + 2px;
  display: block;
  font-size: $error-font-size;
  font-weight: $error-font-weight;
  line-height: $error-height;
  position: absolute;
  padding: 0 5px;
  opacity: 0;
  transition: opacity 0.2s ease-out;
  pointer-events: none;

  &._showed {
    opacity: 1;
    pointer-events: auto;
  }

  @include if-ltr {
    border-radius: 0 3px 3px 3px;
  }

  @include if-rtl {
    border-radius: 3px 0 3px 3px;
  }
}
</style>
