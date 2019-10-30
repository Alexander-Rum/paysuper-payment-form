<script>
import { get, map, upperFirst } from 'lodash-es';
import getCardSystemType from '@/helpers/getCardSystemType';
import prepareCardNumber from '@/helpers/prepareCardNumber';
import prepareCardExpiry from '@/helpers/prepareCardExpiry';

export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    /**
     * @typedef {{ pan: string, expire: Object }} Card
     * @type {Card[]}
     */
    cards: {
      default: () => [],
      type: Array,
    },
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
      focused: false,
      innerValue: this.value || get(this.cards, '0.pan', ''),
    };
  },
  computed: {
    options() {
      return map(this.cards, card => ({
        value: card.pan,
        label: prepareCardNumber(card.pan),
        additional: prepareCardExpiry(card.expire),
        iconComponent: `Icon${upperFirst(getCardSystemType(card.pan))}`,
      }));
    },
  },
  mounted() {
    this.$addCssRules({
      [`.${this.$style.anotherCard}`]: {
        color: this.$gui.cardSelectAddCardColor,
      },
      [`.${this.$style.iconPlus}`]: {
        fill: this.$gui.cardSelectAddCardColor,
      },
      [`.${this.$style.anotherCard}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
      [`.${this.$style.anotherCard}:hover > .${this.$style.iconPlus}`]: {
        fill: this.$gui.baseHoverColor,
      },
    });
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
  <UiSelect
    v-model="innerValue"
    v-bind="{ required, disabled, errorText, hasError, ...$attrs }"
    iconPosition="right"
    maxHeight="240px"
    :isRemovable="false"
    :label="$t('UiCardSelect.pan')"
    :options="options"
    :value="innerValue"
    @input="$emit('input', $event)"
    @focus="focused = true"
    @blur="focused = false"
    @remove="$emit('removeCard', $event)"
  >
    <div
      v-if="focused"
      slot="additional"
      :class="$style.anotherCard"
      @click="$emit('anotherCard')"
    >
      <IconPlus :class="$style.iconPlus" />
      {{ $t('UiCardSelect.anotherCard') }}
    </div>
  </UiSelect>
</div>
</template>

<style module lang="scss">
.container {
  display: flex;
  position: relative;
  width: 100%;
  flex-wrap: wrap;
}
.anotherCard {
  display: flex;
  align-items: center;
  margin-top: 18px;
  transition: color 0.2s ease-out;

  @include if-rtl {
    margin-right: 20px;
  }
}
.iconPlus {
  transition: fill 0.2s ease-out;

  @include if-ltr {
    margin-right: 12px;
  }

  @include if-rtl {
    margin-left: 12px;
  }
}
</style>
