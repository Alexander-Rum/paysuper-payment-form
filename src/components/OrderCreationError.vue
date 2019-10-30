<script>
import { includes } from 'lodash-es';
import IconTotemFail from '@/components/IconTotemFail.vue';

export default {
  name: 'OrderCreationError',

  props: {
    type: {
      required: true,
      type: String,
      validator(value) {
        return includes(['unknownError', 'customError'], value);
      },
    },

    isModal: {
      type: Boolean,
      default: false,
    },

    message: {
      type: String,
    },
  },

  components: {
    IconTotemFail,
  },

  created() {
    this.$addCssRules({
      [`.${this.$style.orderCreationError}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.titleMain}`]: {
        color: this.$gui.warningTitleColor,
      },
      [`.${this.$style.description}`]: {
        color: this.$gui.warningTextColor,
      },
    });
  },
};
</script>

<template>
<UiTransitionFade>
  <div :class="$style.orderCreationError">
    <div :class="$style.content">
      <div :class="$style.icon">
        <IconTotemFail/>
      </div>
      <div>
        <h2
          :class="$style.titleMain"
          v-html="$t('OrderCreationError.title')"
        >
        </h2>
      </div>
      <div
        :class="$style.description"
        v-html="type === 'unknownError' ? $t('OrderCreationError.unknownError') : message"
      >
      </div>
    </div>
    <div :class="$style.footer">
      <UiButton
        :class="$style.button"
        :hasBorderRadius="false"
        @click="$emit('tryAgain')"
      >
        {{$t('OrderCreationError.tryAgain')}}
      </UiButton>
    </div>

    <div
      v-if="isModal"
      :class="$style.close"
      @click="$emit('close')"
    >
      <IconClose :class="$style.iconClose" />
    </div>
  </div>
</UiTransitionFade>
</template>

<style lang="scss" module>
.orderCreationError {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 100;

  &._layout-page {
  }
}

.content {
  padding: 10px 40px 10px;
  width: 100%;
  max-width: 650px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.icon {
  margin-bottom: 30px;
}

.titleMain {
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 40px;
}

.description {
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.footer {
  width: 100%;
}

.button {
  width: 100%;
}
.close {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  z-index: 10000;
  height: 60px;
  width: 60px;
  padding: 24px;

  &:hover > .iconClose {
    transform: rotate(360deg);
  }
}
.iconClose {
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease-out 0.3s;
}
</style>
