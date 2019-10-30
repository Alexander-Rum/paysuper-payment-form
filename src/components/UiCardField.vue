<script>
import getCardSystemType from '@/helpers/getCardSystemType';
import PaysystemIcon from '@/components/PaysystemIcon.vue';

export default {
  components: {
    PaysystemIcon,
  },
  model: {
    prop: 'value',
    event: 'input',
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
    required: {
      default: false,
      type: Boolean,
    },
    value: {
      default: '',
      type: [String, Number],
    },
  },
  data() {
    return {
      innerValue: this.value,
    };
  },
  computed: {
    cardType() {
      return getCardSystemType(this.innerValue);
    },
  },
  methods: {
    cardChange(value) {
      this.$emit('input', value);
    },
    focus() {
      this.$refs.textField.focus();
    },
  },
  watch: {
    value(value) {
      this.innerValue = value;
    },
  },
};
</script>

<template>
<div :class="$style.container">
  <UiTextField
    v-model="innerValue"
    v-bind="{ required, disabled, errorText, hasError, ...$attrs }"
    ref="textField"
    mask="#### #### #### ####"
    :label="$t('UiCardField.cardNumber')"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="cardChange"
  />
  <PaysystemIcon
    v-if="cardType"
    :class="$style.systemIcon"
    :type="cardType"
  />
</div>
</template>

<style module lang="scss">
.container {
  position: relative;
  width: 100%;
}
.systemIcon {
  position: absolute;
  top: 21px;

  @include if-ltr {
    right: 0;
  }

  @include if-rtl {
    left: 0;
  }
}
</style>
