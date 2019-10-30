<template>
<div :class="[$style.formSectionBankCard]">
  <UiCardSelect
    v-if="hasCardsInStorage && !anotherCard"
    v-model="innerValue.cardNumber"
    :class="$style.formItem"
    :cards="cards"
    :hasError="$isFieldInvalid('innerValue.cardNumber')"
    :errorText="$t('FormSectionBankCard.cardNumberInvalid')"
    @anotherCard="anotherCard = true"
    @removeCard="$emit('removeCard', $event)"
  />
  <UiCardField
    v-else
    v-model="innerValue.cardNumber"
    ref="cardNumberField"
    name="pan"
    type="tel"
    :class="[$style.formItem, { [$style._oneLine]: isOneLine }]"
    :hasError="$isFieldInvalid('innerValue.cardNumber')"
    :errorText="$t('FormSectionBankCard.cardNumberInvalid')"
    @keyup.native="moveFocusToFieldOnComplete('cardNumber', 16, 'expiryDateField')"
  />
  <div :class="[$style.formItem, { [$style._oneLine]: isOneLine }]">
    <UiTextField
      v-model="innerValue.expiryDate"
      ref="expiryDateField"
      name="cc-exp"
      mask="##/##"
      type="tel"
      :class="$style.expiry"
      :hasError="$isFieldInvalid('innerValue.expiryDate')"
      :errorText="$t('FormSectionBankCard.expiryDateInvalid')"
      :label="$t('FormSectionBankCard.expiryDate')"
      @keyup.native="moveFocusToFieldOnComplete('expiryDate', 4, 'cvvField')"
      @keyup.native.delete="moveFocusBackOnEmpty('expiryDate', 'cardNumberField')"
    />
    <UiCvvField
      v-model="innerValue.cvv"
      ref="cvvField"
      :hasError="$isFieldInvalid('innerValue.cvv')"
      @keyup.native="moveFocusToFieldOnComplete('cvv', 3, 'emailField')"
      @keyup.native.delete="moveFocusBackOnEmpty('cvv', 'expiryDateField')"
    />
  </div>
  <UiTextField
    v-model="innerValue.email"
    ref="emailField"
    name="email"
    type="email"
    :class="$style.formItem"
    :hasError="$isFieldInvalid('innerValue.email')"
    :errorText="$t('FormSectionBankCard.emailInvalid')"
    :label="$t('FormSectionBankCard.email')"
    @keyup.native.delete="moveFocusBackOnEmpty('email', 'cvvField')"
  />
  <template v-if="isGeoFieldsExposed">
    <UiSelect
      v-model="innerValue.country"
      :maxHeight="isPageView ? '120px' : '240px'"
      :options="countries"
      :placeholderLabel="$t('FormSectionBankCard.country')"
      :hasReversible="true"
      :hasError="$isFieldInvalid('innerValue.country')"
      :errorText="$t('FormSectionBankCard.countryInvalid')"
    />
    <template v-if="isCityAndZipRequired">
      <UiTextField
        v-model="innerValue.city"
        name="city"
        :class="$style.formItem"
        :label="$t('FormSectionBankCard.city')"
        :hasError="$isFieldInvalid('innerValue.city')"
        :errorText="$t('FormSectionBankCard.cityInvalid')"
      />
      <UiTextField
        v-model="innerValue.zip"
        name="zip"
        :class="$style.formItem"
        :label="$t('FormSectionBankCard.zip')"
        :hasError="$isFieldInvalid('innerValue.zip')"
        :errorText="$t('FormSectionBankCard.zipInvalid')"
      />
    </template>
  </template>

  <div
    v-if="!hasCardsInStorage || anotherCard"
    :class="[$style.formItem, $style.remember]"
  >
    <UiCheckbox v-model="innerValue.hasRemembered">
      {{ $t('FormSectionBankCard.remember') }}
      <div
        :class="$style.rememberInfo"
        @mouseenter="isRememberInfoShown = true"
        @mouseleave="isRememberInfoShown = false"
      >
        <IconInfo />
        <UiTip
          innerPosition="center"
          section="form"
          width="220px"
          :visible="isRememberInfoShown"
        >
          {{ $t('FormSectionBankCard.rememberInfo') }}
        </UiTip>
      </div>
    </UiCheckbox>
  </div>
</div>
</template>

<script>
import {
  email,
  required,
  maxLength,
  minLength,
} from 'vuelidate/lib/validators';
import { toInteger, extend, forEach } from 'lodash-es';
import { gtagEvent } from '@/analytics';

function isValidExpiryDate(date) {
  if (date.length < 2) {
    return true;
  }
  if (date.length === 2 || date.length === 3) {
    const month = toInteger(date.substring(0, 2));

    if (month < 1 || month > 12) {
      return false;
    }

    return true;
  }
  if (date.length > 4) {
    return false;
  }

  const month = toInteger(date.substring(0, 2));
  const year = toInteger(date.substring(2));

  if (month < 1 || month > 12 || year < 0 || year > 99) {
    return false;
  }

  return true;
}

export default {
  name: 'FormSectionBankCard',

  props: {
    cardNumberValidator: {
      required: true,
      type: RegExp,
    },
    /**
     * @typedef {{ cardNumber: string, expiryDate: string }} Card
     * @type {Card[]}
     */
    cards: {
      default: () => [],
      type: Array,
    },
    value: {
      type: Object,
    },
    countries: {
      type: Array,
      required: true,
    },
    isGeoFieldsExposed: {
      type: Boolean,
      required: true,
    },
    isZipInvalid: {
      type: Boolean,
      required: true,
    },
    isPageView: {
      type: Boolean,
      default: false,
    },
    isOneLine: {
      type: Boolean,
      default: false,
    },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  data() {
    return {
      innerValue: extend({}, this.value),
      anotherCard: false,
      isCvvInfoShown: false,
      isRememberInfoShown: false,
    };
  },

  computed: {
    hasCardsInStorage() {
      return this.cards.length;
    },
    isCityAndZipRequired() {
      return this.innerValue.country === 'US';
    },
  },

  watch: {
    value: {
      handler(value) {
        extend(this.innerValue, value);
      },
      deep: true,
    },
  },

  validations() {
    let innerValue = {
      cardNumber: {
        required,
        wrongFormatType(value) {
          return this.cardNumberValidator.test(value);
        },
      },
      expiryDate: { required, isValidExpiryDate },
      cvv: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(4),
      },
      email: {
        required,
        email,
      },
    };

    if (this.isGeoFieldsExposed) {
      innerValue = {
        ...innerValue,
        country: {
          required,
        },
      };
      if (this.isCityAndZipRequired) {
        innerValue = {
          ...innerValue,
          city: {
            required,
          },
          zip: {
            required,
            wrongValue() {
              return !this.isZipInvalid;
            },
          },
        };
      }
    }
    return {
      innerValue,
    };
  },

  created() {
    this.emitOnInnerValueChanges();
  },

  mounted() {
    this.focusCardNumberField();
  },

  methods: {
    focusCardNumberField() {
      this.$nextTick(() => {
        this.$refs.cardNumberField.focus();
      });
    },
    moveFocusToFieldOnComplete(fieldValueName, length, nextField) {
      if (this.innerValue[fieldValueName].length === length) {
        this.$refs[nextField].focus();
      }
    },
    moveFocusBackOnEmpty(fieldValueName, prevField) {
      if (this.innerValue[fieldValueName].length === 0) {
        this.$refs[prevField].focus();
      }
    },
    emitOnInnerValueChanges() {
      forEach(this.innerValue, (a, key) => {
        this.$watch(`innerValue.${key}`, (value) => {
          // For v-model
          this.$emit('change', this.innerValue);

          // to watch certain field
          this.$emit(`${key}Change`, value);

          if (key === 'hasRemembered' && value) {
            gtagEvent('clickRememberCard', { event_category: 'userAction' });
          }
        });
      });
    },
    validate() {
      this.$v.$touch();
      return {
        isValid: !this.$v.$invalid,
      };
    },
  },
};
</script>

<style module lang="scss">
.formSectionBankCard {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  align-content: flex-start;
  justify-content: space-between;
}
.formItem {
  display: flex;
  justify-content: space-between;
  width: 100%;

  &._oneLine {
    width: calc(50% - 10px);
  }
}
.expiry {
  @include if-ltr {
    margin-right: 20px;
  }
}
.remember {
  padding: 18px 0;
}
.rememberInfo {
  position: relative;
  display: inline-flex;
  cursor: pointer;
  margin: 0 6px;
}
</style>
