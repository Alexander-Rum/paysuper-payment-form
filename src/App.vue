<script>
import { mapState, mapActions } from 'vuex';
import { gtagEvent } from '@/analytics';
import ActionProcessing from '@/components/ActionProcessing.vue';
import CartSection from '@/components/CartSection.vue';
import FormSection from '@/components/FormSection.vue';
import LayoutContent from '@/components/LayoutContent.vue';
import LayoutFooter from '@/components/LayoutFooter.vue';
import LayoutHeader from '@/components/LayoutHeader.vue';
import Modal from '@/components/Modal.vue';
import ModalCart from '@/components/ModalCart.vue';
import ModalForm from '@/components/ModalForm.vue';
import OrderCreationError from '@/components/OrderCreationError.vue';
import { postMessage } from './postMessage';

export default {
  components: {
    ActionProcessing,
    CartSection,
    FormSection,
    LayoutContent,
    LayoutFooter,
    LayoutHeader,
    Modal,
    ModalCart,
    ModalForm,
    OrderCreationError,
  },
  data() {
    return {
      isCartOpened: true,
      isMobile: false,
      layout: this.$layout,
      opened: true,
    };
  },
  computed: {
    ...mapState('PaymentForm', [
      'paymentStatus',
      'actionResult',
      'orderParams',
      'orderData',
      'isPaymentLoading',
      'isFormLoading',
      'currentPlatformId',
    ]),

    isLoading() {
      return this.paymentStatus === 'INITIAL';
    },
    isPageView() {
      return this.layout === 'page';
    },
  },
  beforeMount() {
    postMessage('LOADED');

    this.updateLayout();
    window.addEventListener('resize', this.updateLayout);
  },
  mounted() {
    this.getAppSizeAndReport();
    setInterval(this.getAppSizeAndReport, 100);
  },
  methods: {
    ...mapActions(['reportResize']),
    ...mapActions('PaymentForm', ['createOrder', 'setFormLoading', 'changePlatform']),

    getAppSizeAndReport() {
      const size = {
        height: this.$el.offsetHeight,
        width: this.$el.offsetWidth,
      };
      this.reportResize(size);
    },
    updateLayout() {
      this.isMobile = window.innerWidth < 640 || window.innerHeight < 510;

      if (this.isMobile) {
        this.layout = 'page';

        this.$refs.wrapper.update();
      } else {
        this.layout = this.$layout;
      }
    },
    closeModal() {
      if (this.$layout === 'modal') {
        this.opened = false;
        postMessage('MODAL_CLOSED');
        gtagEvent('formClosed');
      }
    },
    async tryToCreateOrder() {
      this.setFormLoading(true);
      await this.createOrder();
      this.setFormLoading(false);
    },
  },
};
</script>

<template>
<div :class="[$style.layout, { [$style._isPage]: isPageView }]">
  <component
    v-if="opened"
    :is="isPageView ? 'UiScrollbarBox' : 'Modal'"
    ref="wrapper"
    :class="$style.wrapper"
    :opened="opened"
    :isUpdateOnClick="true"
    :settings="{ suppressScrollX: true }"
    @close="closeModal"
  >
    <template v-if="paymentStatus !== 'FAILED_TO_BEGIN'">
      <template v-if="isPageView">
        <LayoutHeader
          :isCartOpened="isCartOpened"
          :isModal="$layout === 'modal'"
          :isPageView="isPageView"
          :projectName="orderData ? orderData.project.name : ''"
          :isLoading="isLoading"
          @toggleCart="isCartOpened = !isCartOpened"
          @close="closeModal"
        />

        <LayoutContent
          :isCartOpened="isCartOpened"
          :isLoading="isLoading"
        >
          <CartSection
            slot="cart"
            :orderData="orderData"
            :isCartOpened="isCartOpened"
            :isPageView="isPageView"
            :hasPlatformSelect="orderParams.type === 'key'"
            :currentPlatformId="currentPlatformId"
            @changePlatform="changePlatform"
          />
          <FormSection
            slot="form"
            :isMobile="isMobile"
            :isPageView="isPageView"
            @close="closeModal"
          />
        </LayoutContent>

        <LayoutFooter :isLoading="isLoading"/>
      </template>
      <template v-else>
        <ModalCart
          :projectName="orderData ? orderData.project.name : ''"
          :isLoading="isLoading"
        >
          <CartSection
            :orderData="orderData"
            :hasPlatformSelect="orderParams.type === 'key'"
            :currentPlatformId="currentPlatformId"
            @changePlatform="changePlatform"
          />
        </ModalCart>
        <ModalForm :isLoading="isLoading">
          <FormSection @close="closeModal"/>
        </ModalForm>
      </template>
    </template>

    <ActionProcessing
      v-if="isPaymentLoading || isFormLoading"
      :content="isFormLoading ? 'no-content' : '3d-security'"
    />
    <OrderCreationError
      v-if="paymentStatus === 'FAILED_TO_BEGIN'"
      :class="$style.orderCreationError"
      :message="actionResult.message"
      :type="actionResult.type"
      :isModal="$layout === 'modal'"
      @tryAgain="tryToCreateOrder"
      @close="closeModal"
    />
  </component>
</div>
</template>

<style module lang="scss">
@import '@/assets/styles/reset.scss';

.layout {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;

  &._isPage {
    display: flex;
    min-height: 100vh;
    width: 100%;
    flex-direction: column;

    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      height: 100vh;
    }

    .preloader {
      position: fixed;
    }

    .orderCreationError {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }

    .wrapper {
      min-height: 100%;
      min-height: 100vh;
      width: 100%;
      width: 100vw;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
