<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { email, required } from 'vuelidate/lib/validators';
import Sticky from 'vue-sticky-directive';
import { includes, get } from 'lodash-es';
import { gtagEvent } from '@/analytics';
import ActionResult from '@/components/ActionResult.vue';
import FormSectionBankCard from '@/components/FormSectionBankCard.vue';
import PaymentAreaWarning from '@/components/PaymentAreaWarning.vue';
import geInstructionLinkByPlatform from '@/helpers/geInstructionLinkByPlatform';

function getRegexp(value) {
  return new RegExp(value);
}

export default {
  name: 'FormSection',

  directives: { Sticky },

  components: {
    ActionResult,
    FormSectionBankCard,
    PaymentAreaWarning,
  },

  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
    isPageView: {
      type: Boolean,
      default: false,
    },
  },

  filters: {
    getRegexp,
  },

  data() {
    return {
      footerSticked: false,

      paymentData: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        hasRemembered: false,
        country: '',
        city: '',
        zip: '',
        email: '',
        ewallet: '',
        crypto: '',
      },

      paymentMethodOptions: {
        BANKCARD: {
          label: 'FormSection.card',
          iconComponent: 'IconCard',
        },
        NETELLER: {
          label: 'FormSection.neteller',
          iconComponent: 'IconCard',
        },
        ALIPAY: {
          label: 'FormSection.alipay',
          iconComponent: 'IconCard',
          types: {
            ewallet: {
              iconComponent: 'IconCard',
            },
          },
        },
        BITCOIN: {
          label: 'FormSection.bitcoin',
          iconComponent: 'IconCard',
        },
        QIWI: {
          label: 'FormSection.qiwi',
          iconComponent: 'IconQiwi',
        },
        WEBMONEY: {
          label: 'FormSection.webmoney',
          iconComponent: 'IconWebmoney',
        },
      },

      isBankCardNumberChecking: false,
      checkedBankCardNumberPart: '',
    };
  },

  computed: {
    ...mapState('PaymentForm', [
      'orderData',
      'orderParams',
      'activePaymentMethodId',
      'cards',
      'actionResult',
      'isUserCountryConfirmRequested',
      'isUserCountryRestricted',
      'userIpGeoData',
      'isGeoFieldsExposed',
      'isZipInvalid',
      'currentPlatformId',
    ]),
    ...mapGetters('PaymentForm', ['activePaymentMethod']),
    ...mapGetters('Dictionaries', ['countries']),

    paymentMethodsSelectList() {
      return this.orderData.payment_methods.map((item) => {
        const group = this.paymentMethodOptions[item.group_alias];
        if (!group) {
          return null;
        }
        const type = group.types ? group.types[item.type] : null;
        return {
          value: item.id,
          label: this.$i18n.t(get(type, 'label') || get(group, 'label')),
          iconComponent: get(type, 'iconComponent') || get(group, 'iconComponent'),
        };
      });
    },

    isBankCardPayment() {
      return this.activePaymentMethod.type === 'bank_card';
    },

    isPaymentFormVisible() {
      if (this.actionResult || this.isUserCountryConfirmRequested || this.isUserCountryRestricted) {
        return false;
      }

      return true;
    },

    isSubmitButtonDisabled() {
      if (
        this.isUserCountryConfirmRequested
        && this.userIpGeoData.country === this.paymentData.country
      ) {
        return true;
      }
      return false;
    },

    orderType() {
      return this.orderParams.type;
    },

    platformInstructionLink() {
      return geInstructionLinkByPlatform(this.currentPlatformId);
    },
  },

  validations() {
    if (this.isBankCardPayment) {
      return {};
    }

    return {
      paymentData: {
        // ewallet or crypto
        [this.activePaymentMethod.type]: {
          required,
          wrongFormatType(value) {
            if (!this.activePaymentMethod.account_regexp) {
              return true;
            }
            return getRegexp(this.activePaymentMethod.account_regexp).test(value);
          },
        },
        email: {
          required,
          email,
        },
      },
    };
  },

  created() {
    this.paymentData.email = this.orderData.email;
    if (this.userIpGeoData) {
      this.paymentData.country = this.userIpGeoData.country;
    }
  },

  methods: {
    ...mapActions('PaymentForm', [
      'setActivePaymentMethodById',
      'createPayment',
      'clearActionResult',
      'usePaymentApi',
      'removeCard',
      'checkPaymentAccount',
      'submitUserCountry',
      'updateBillingData',
      'setPaymentLoading',
      'setFormLoading',
    ]),

    handleMainButtonClick() {
      if (this.isUserCountryConfirmRequested) {
        gtagEvent('confirmUserCountry', { event_category: 'userAction' });
        this.submitUserCountry();
        if (this.$refs.bankCardForm) {
          this.$refs.bankCardForm.focusCardNumberField();
        }
      } else if (this.isUserCountryRestricted) {
        gtagEvent('isUserCountryRestricted');
        this.$emit('close');
      } else if (this.actionResult) {
        if (this.actionResult.type === 'success') {
          gtagEvent('clickOkButton', { event_category: 'userAction' });
          this.$emit('close');
        } else {
          gtagEvent('clickTryAgainButton', { event_category: 'userAction' });
          this.clearActionResult();
        }
      } else if (this.isPaymentFormVisible) {
        gtagEvent('clickPayButton', { event_category: 'userAction' });
        this.submitPaymentForm();
      }
    },

    async submitPaymentForm() {
      this.$v.$touch();

      const isValidArray = [
        !this.$v.$invalid,
      ];

      if (this.isBankCardPayment) {
        const { isValid } = this.$refs.bankCardForm.validate();
        isValidArray.push(isValid);
      }

      if (isValidArray.filter(item => !item).length) {
        // has errors
        return;
      }

      gtagEvent('submitPaymentForm');
      this.createPayment({
        ...this.paymentData,
      });
    },

    setNewUserCountry(value) {
      this.paymentData.country = value;
      this.paymentData.city = '';
      this.paymentData.zip = '';
      this.requestBillingDataUpdate();

      gtagEvent('setUserCountry', {
        event_category: 'userAction',
        country: value,
      });
    },

    requestBillingDataUpdate() {
      this.updateBillingData(this.paymentData);
    },

    async checkBankCardNumber(value) {
      if (
        value.length >= 6
        && !this.isBankCardNumberChecking
        && (
          !this.checkedBankCardNumberPart
          || !includes(value, this.checkedBankCardNumberPart)
        )
      ) {
        this.isBankCardNumberChecking = true;

        try {
          await this.checkPaymentAccount(value);
          this.checkedBankCardNumberPart = value;
        } catch (error) {
          console.error(error);
        }
        this.isBankCardNumberChecking = false;
      }
    },

    onStick(event) {
      this.footerSticked = event.sticked;
    },
  },
};
</script>

<template>
<div :class="[$style.formSection, { [$style[`_isPage`]]: isPageView }]">
  <div :class="$style.content">
    <component
      :is="isPageView ? 'div' : 'UiScrollbarBox'"
      :class="$style.scrollbox"
      :settings="isPageView ? undefined : { suppressScrollX: true }"
    >
      <div
        v-show="isPaymentFormVisible"
        :class="$style.contentInner"
      >
        <UiSelect
          maxHeight="240px"
          :value="activePaymentMethodId"
          :class="$style.formItem"
          :options="paymentMethodsSelectList"
          :prependLabel="$t('FormSection.prependLabel')"
          @input="setActivePaymentMethodById"
        />
        <FormSectionBankCard
          v-if="isBankCardPayment"
          ref="bankCardForm"
          v-model="paymentData"
          :isPageView="isPageView"
          :countries="countries"
          :cards="cards"
          :cardNumberValidator="activePaymentMethod.account_regexp | getRegexp"
          :isGeoFieldsExposed="isGeoFieldsExposed"
          :isZipInvalid="isZipInvalid"
          @cardNumberChange="checkBankCardNumber"
          @countryChange="setNewUserCountry"
          @cityChange="requestBillingDataUpdate"
          @zipChange="requestBillingDataUpdate"
          @removeCard="removeCard"
        />
        <template v-else>
          <UiTextField
            :class="$style.formItem"
            v-model="paymentData[activePaymentMethod.type]"
            :name="activePaymentMethod.type"
            :hasError="$isFieldInvalid(`paymentData.${activePaymentMethod.type}`)"
            :errorText="$t('FormSection.abstractNumberError')"
            :label="$t('FormSection.abstractNumberPlaceholder', {name: activePaymentMethod.name})"
          />
          <UiTextField
            :class="$style.formItem"
            v-model="paymentData.email"
            type="email"
            name="email"
            :hasError="$isFieldInvalid('paymentData.email')"
            :errorText="$t('FormSection.emailInvalid')"
            :label="$t('FormSection.email')"
          />
        </template>
      </div>
      <div
        :class="$style.contentInner"
        v-if="!isPaymentFormVisible"
      >
        <ActionResult
          v-if="actionResult"
          :email="paymentData.email"
          :message="actionResult.message"
          :orderId="orderData.id"
          :orderType="orderType"
          :type="actionResult.type"
          :platformInstructionLink="platformInstructionLink"
        />
        <PaymentAreaWarning
          v-if="isUserCountryConfirmRequested || isUserCountryRestricted"
          :countries="countries"
          :content="isUserCountryRestricted ? 'restricted' : 'select-location'"
          @changeCountry="setNewUserCountry"
        />
      </div>
    </component>
  </div>
  <div
    v-sticky="isMobile"
    sticky-side="bottom"
    on-stick="onStick"
    :class="[$style.footer, { [$style._sticky]: isMobile && footerSticked }]"
  >
    <UiButton
      :class="$style.payBtn"
      :hasBorderRadius="isPageView"
      :disabled="isSubmitButtonDisabled"
      @click="handleMainButtonClick"
    >
      <template v-if="isPaymentFormVisible">
        <IconLock slot="before" />
        <span>
          {{ $t('FormSection.payButtonPrefix') }}
        </span>
        <span>
          {{ $getPrice(orderData.total_amount, orderData.currency) }}
        </span>
      </template>
      <template v-if="actionResult">
        {{ actionResult.type === 'success' ? $t('FormSection.ok') : $t('FormSection.tryAgain') }}
      </template>
      <template v-if="isUserCountryConfirmRequested">
        {{$t('FormSection.save')}}
      </template>
      <template v-if="isUserCountryRestricted">
        {{$t('FormSection.close')}}
      </template>
    </UiButton>
  </div>
</div>
</template>

<style module lang="scss">
.formSection {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-content: space-between;
  position: relative;
  height: 100%;
  min-height: 448px;
  max-height: 100%;
  width: 100%;
}

.content {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  flex-direction: column;
  align-content: flex-start;
  position: relative;
  width: 100%;
  max-height: calc(100% - 70px);
}

.scrollbox {
  width: 100%;
  height: 100%;
  flex-grow: 1;
}

.contentInner {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  padding: 0 40px 20px;

  .formSection._isPage & {
    padding: 20px 0px 20px;

    @media screen and (min-width: 640px) {
      padding: 60px 0;
    }
  }
}

.formItem {
  display: flex;
  justify-content: space-between;
}

.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  .formSection._isPage &._sticky {
    left: 0 !important;
    width: 100vw !important;
  }
}

.payBtn {
  width: 100%;
  transition: border-radius 0.2s ease-out;

  .formSection._isPage .footer._sticky & {
    transition: border-radius 0.2s ease-out;
    border-radius: 0;
  }
}
</style>
