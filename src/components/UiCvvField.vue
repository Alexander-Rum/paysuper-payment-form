<script>
export default {
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
      isCvvInfoShown: false,
      innerValue: this.value,
    };
  },
  methods: {
    cvvChange(value) {
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
    v-bind="{ disabled, errorText, hasError, required, ...$attrs }"
    ref="textField"
    name="cvv"
    mask="###"
    type="tel"
    :hasInfoIcon="true"
    :errorText="$t('FormSectionBankCard.cvvError')"
    :label="$t('FormSectionBankCard.cvv')"
    @blur="$emit('blur')"
    @focus="$emit('focus')"
    @input="cvvChange"
  />
  <div
    :class="$style.cvvInfo"
    @mouseenter="isCvvInfoShown = true"
    @mouseleave="isCvvInfoShown = false"
  >
    <IconInfo />
    <UiTip
      innerPosition="right"
      section="form"
      :class="$style.cvvTip"
      :visible="isCvvInfoShown"
    >
      <div :class="$style.cvvContainer">
        <IconCvvCard :class="$style.cvvIconCard" />
        <div v-html="$t('FormSectionBankCard.cvvInfo')" />
      </div>
    </UiTip>
  </div>
</div>
</template>

<style module lang="scss">
.container {
  position: relative;
  width: 100%;

  @include if-rtl {
    margin-right: 20px;
  }
}
.cvvInfo {
  position: absolute;
  display: flex;
  top: 20px;
  cursor: pointer;

  @include if-ltr {
    right: 0;
  }

  @include if-rtl {
    left: 0;
  }
}
.cvvTip {
  @include if-ltr {
    margin-right: -20px;
  }

  @include if-rtl {
    margin-left: -20px;
  }
}
.cvvContainer {
  display: flex;
  padding: 8px 5px;
  width: 250px;
  justify-content: flex-start;
  align-items: center;
}
.cvvIconCard {
  @include if-ltr {
    margin-right: 10px;
  }

  @include if-rtl {
    margin-left: 10px;
  }
}
</style>
