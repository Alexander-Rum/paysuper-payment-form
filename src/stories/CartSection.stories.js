/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import cartTestData from '@/cartTestData';

import CartSection from '@/components/CartSection.vue';

storiesOf('CartSection', module)
  .add('modal', () => ({
    components: { CartSection },
    data() {
      return {
        orderData: {
          id: '6e09ae25-00e5-4d57-9aa2-47f488a0ea78',
          has_vat: true,
          vat: 226,
          amount: 1129.99,
          total_amount: 1355.99,
          currency: 'RUB',
          project: { name: '1113', url_success: 'https://success', url_fail: 'https://fail' },
          items: cartTestData,
        },
        style: { border: '1px solid green' },
      };
    },
    methods: {
      getOrderItems(from, to) {
        return {
          ...this.orderData,
          items: this.orderData.items.slice(from, to),
        };
      },
    },
    template: `
      <div style="width: 400px">
        <CartSection :style="style" :orderData="getOrderItems(0, 1)" />
        <CartSection :style="style" :orderData="getOrderItems(0, 2)" />
        <CartSection :style="style" :orderData="getOrderItems(0, 3)" />
        <CartSection :style="style" :orderData="getOrderItems(0, 4)" />
        <CartSection :style="style" :orderData="getOrderItems(0, 5)" />
        <CartSection :style="style" :orderData="getOrderItems(0, 6)" />
        <CartSection :style="style" :orderData="orderData"  />
      </div>
    `,
  }))
  .add('page', () => ({
    components: { CartSection },
    data() {
      return {
        orderData: {
          id: '6e09ae25-00e5-4d57-9aa2-47f488a0ea78',
          has_vat: true,
          vat: 226,
          amount: 1129.99,
          total_amount: 1355.99,
          currency: 'RUB',
          project: { name: '1113', url_success: 'https://success', url_fail: 'https://fail' },
          items: cartTestData,
        },
        style: { border: '1px solid green' },
      };
    },
    methods: {
      getOrderItems(from, to) {
        return {
          ...this.orderData,
          items: this.orderData.items.slice(from, to),
        };
      },
    },
    template: `
      <div style="width: 500px">
        <CartSection :style="style" :isPageView="true" :orderData="getOrderItems(0, 1)" />
        <CartSection :style="style" :isPageView="true" :orderData="getOrderItems(7, 8)" />
        <CartSection :style="style" :isPageView="true" :orderData="getOrderItems(0, 2)" />
        <CartSection :style="style" :isPageView="true" :orderData="getOrderItems(0, 3)" />
        <CartSection :style="style" :isPageView="true" :orderData="getOrderItems(0, 4)" />
        <CartSection :style="style" :isPageView="true" :orderData="getOrderItems(0, 5)" />
        <CartSection :style="style" :isPageView="true" :orderData="getOrderItems(0, 6)" />
        <CartSection :style="style" :isPageView="true" :orderData="orderData"  />
        <CartSection
          :style="style"
          :isPageView="true"
          :orderData="orderData"
          :isCartOpened="false"
        />
      </div>
    `,
  }))
  .add('platform select', () => ({
    components: { CartSection },
    data() {
      return {
        orderData: {
          id: '6e09ae25-00e5-4d57-9aa2-47f488a0ea78',
          has_vat: true,
          vat: 226,
          amount: 1129.99,
          total_amount: 1355.99,
          currency: 'RUB',
          project: { name: '1113', url_success: 'https://success', url_fail: 'https://fail' },
          items: cartTestData,
          platforms: [
            {
              id: 'steam',
              name: 'Steam',
            },
            {
              id: 'gog',
              name: 'GOG',
            },
          ],
        },
        currentPlatformId: 'steam',
        hasPlatformSelect: true,
        style: { border: '1px solid green' },
      };
    },
    methods: {
      getOrderItems(from, to) {
        return {
          ...this.orderData,
          items: this.orderData.items.slice(from, to),
        };
      },
    },
    template: `
      <div style="width: 500px">
        <CartSection 
          v-bind="{ style, currentPlatformId, hasPlatformSelect }" 
          :orderData="getOrderItems(0, 1)"
        />
        <CartSection 
          v-bind="{ style, currentPlatformId, hasPlatformSelect }" 
          :orderData="getOrderItems(0, 1)"
          :isPageView="true"
        />
      </div>
    `,
  }));
