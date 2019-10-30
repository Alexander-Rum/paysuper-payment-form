<script>

export default {
  name: 'CartSectionListing',

  props: {
    orderData: {
      required: true,
      type: Object,
    },
    isCartOpened: {
      default: true,
      type: Boolean,
    },
  },

  mounted() {
    this.$addCssRules({
      [`.${this.$style.item}`]: {
        color: this.$gui.cartTextColor,
      },
      [`.${this.$style.item}.${this.$style._total}`]: {
        color: this.$gui.cartAccentColor,
      },
      [`.${this.$style.oldPrice}`]: {
        color: this.$gui.cartOldPriceColor,
      },
      [`.${this.$style.totals}`]: {
        'border-top': `1px solid ${this.$gui.cartStrokeColor}`,
      },
    });
  },

};
</script>

<template>
<div
  :class="[
    $style.cartSectionListing,
    { [$style._closed]: !isCartOpened }
  ]"
>
  <div :class="[$style.items, $style.hidden]">
    <template v-if="orderData.items">
      <div
        v-for="(item, index) in orderData.items"
        :class="$style.item"
        :key="item.id"
      >
        <span
          :class="[$style.itemCell, $style._title]"
          @click="$emit('clickProduct', index)"
        >
          {{ item.name }}
        </span>
        <span :class="[$style.itemCell, $style._price]">
          <span :class="$style.oldPrice" v-if="item.discount">
            {{ $getPrice(item.price.value, item.price.currency) }}
          </span>
          {{ $getPrice(item.amount, item.currency) }}
        </span>
      </div>
    </template>
    <div
      v-else
      :class="$style.item"
    >
      <span :class="[$style.itemCell, $style._title]">
        {{ $t('CartSection.voluntaryAmount') }}
      </span>
      <span :class="[$style.itemCell, $style._price]">
        {{ $getPrice(orderData.amount, orderData.currency) }}
      </span>
    </div>
  </div>
  <div :class="$style.totals">
    <div :class="$style.items">
      <template v-if="orderData.vat">
        <div :class="[$style.item, $style.subtotal, $style.hidden]">
          <span :class="[$style.itemCell, $style._title]">
            {{ $t('CartSection.subtotal') }}
          </span>
          <span :class="[$style.itemCell, $style._price]">
            {{ $getPrice(orderData.amount, orderData.currency) }}
          </span>
        </div>
        <div :class="[$style.item, $style.taxes, $style.hidden]">
          <span :class="[$style.itemCell, $style._title]">
            {{ $t('CartSection.taxes') }}
          </span>
          <span :class="[$style.itemCell, $style._price]">
            {{ $getPrice(orderData.vat, orderData.currency) }}
          </span>
        </div>
      </template>
      <div :class="[$style.item, $style._total]">
        <span :class="[$style.itemCell, $style._title]">
          {{ $t('CartSection.total') }}
        </span>
        <span :class="[$style.itemCell, $style._price]">
          {{ $getPrice(orderData.total_amount, orderData.currency) }}
        </span>
      </div>
    </div>
  </div>

  <slot />
</div>
</template>
<style lang="scss" module>
.cartSectionListing {
  position: relative;
  z-index: 1;

  @media screen and (max-width: 639px) {
    &._closed .hidden {
      display: none;
    }
  }
}
.items {
  display: table;
  width: 100%;
}
.item {
  display: table-row;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;

  &._total {
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
  }
}
.itemCell {
  padding: 4px 0;
  display: table-cell;

  &._title {
    width: 74%;
    padding-right: 10px;

    @include if-rtl {
      padding-right: 0;
      padding-left: 10px;
    }
  }

  &._price {
    white-space: nowrap;

    @include if-ltr {
      text-align: right;
    }

    @include if-rtl {
      text-align: left;
    }
  }
}
.oldPrice {
  text-decoration: line-through;
  padding-right: 6px;
  font-weight: 100;
}
.totals {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  padding: 12px 0 0;

  @media screen and (max-width: 639px) {
    .cartSectionListing._closed & {
      margin-top: 0;
    }
  }
}
</style>
