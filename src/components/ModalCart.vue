<script>
import StubPreloaderCartModal from '@/components/StubPreloaderCartModal.vue';
import { gtagEvent } from '@/analytics';

export default {
  components: {
    StubPreloaderCartModal,
  },
  props: {
    projectName: {
      required: true,
      type: String,
    },
    isLoading: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      isProfileShown: false,
    };
  },
  created() {
    this.$addCssRules({
      [`.${this.$style.layout}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.link}`]: {
        color: this.$gui.layoutTextColor,
      },
      [`.${this.$style.link}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
      [`.${this.$style.tipLink}`]: {
        color: this.$gui.tipLinkColor,
      },
      [`.${this.$style.tipLink}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
      [`.${this.$style.header}`]: {
        'background-image': `
          linear-gradient(
            180deg,
            ${this.$gui.cartBackgroundColor} 51.5%,
            ${this.$gui.cartBoxShadowColor} 100%
          )
        `,
      },
      [`.${this.$style.footer}`]: {
        'background-image': `
          linear-gradient(
            180deg,
            ${this.$gui.cartBoxShadowColor} 0%,
            ${this.$gui.cartBackgroundColor} 41%
          )
        `,
      },
    });
  },
  methods: {
    fireAnalyticsEvent(elementName) {
      gtagEvent(`click${elementName}Link`, { event_category: 'userAction' });
    },
  },
};
</script>

<template>
<div :class="$style.layout">
  <UiTransitionFade>
    <StubPreloaderCartModal
      v-if="isLoading"
      :class="$style.stub"
    />
    <div
      v-else
      :class="$style.wrapper"
    >
      <div :class="$style.header">
        <a
          href="#"
          :class="$style.link"
          @click="fireAnalyticsEvent('Project')"
        >{{ projectName }}</a>
        <span
          :class="$style.link"
          @mouseenter="isProfileShown = true"
          @mouseleave="isProfileShown = false"
        >
          {{ $t('ModalCart.profile') }}
          <UiTip
            innerPosition="right"
            position="bottom"
            width="200px"
            :visible="isProfileShown"
          >
            <a
              href="#"
              :class="$style.tipLink"
              @click="fireAnalyticsEvent('PurchaseInformation')"
            >{{ $t('ModalCart.purchaseInformation') }}</a>
            <a
              href="#"
              :class="$style.tipLink"
              @click="fireAnalyticsEvent('PaymentManagement')"
            >{{ $t('ModalCart.paymentManagement') }}</a>
          </UiTip>
        </span>
      </div>

      <div :class="$style.content">
        <slot />
      </div>

      <div :class="$style.footer">
        <span :class="$style.link">
          {{ $t('ModalCart.termsOfUse') }}
        </span>
        <a
          href="#"
          :class="$style.link"
          @click="fireAnalyticsEvent('Support')"
        >{{ $t('ModalCart.support') }}</a>
      </div>
    </div>
  </UiTransitionFade>
</div>
</template>

<style module lang="scss">
.layout {
  width: 320px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.wrapper {
  min-height: 100%;
  position: relative;
  display: flex;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 55px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
}
.link {
  position: relative;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 18px;
  cursor: pointer;
  transition: color 0.2s ease-out;

  &:hover {
    text-decoration: none;
  }
}
.tipLink {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  line-height: 18px;
  transition: color 0.2s ease-out;

  &:hover {
    text-decoration: none;
  }
}
.content {
  display: flex;
  z-index: 1;
  position: relative;
  width: 100%;
}
.footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 36px 20px 16px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;

  & > .link {
    @include if-ltr {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }

    @include if-rtl {
      &:not(:last-child) {
        margin-left: 16px;
      }
    }
  }
}
</style>
