<script>
import { includes } from 'lodash-es';
import IconCardSecurity from '@/components/IconCardSecurity.vue';
import IconProcessSecurity from '@/components/IconProcessSecurity.vue';

export default {
  name: 'ActionProcessing',

  components: {
    IconCardSecurity,
    IconProcessSecurity,
  },

  props: {
    content: {
      type: String,
      default: '3d-security',
      validator(value) {
        return includes(['3d-security', 'no-content'], value);
      },
    },
    icon: {
      type: String,
      default: 'card',
      validator(value) {
        return includes(['card', 'other'], value);
      },
    },
  },

  created() {
    this.$addCssRules({
      [`.${this.$style.actionProcessing}:before`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.titleMain}`]: {
        color: this.$gui.processTitleColor,
      },
      [`.${this.$style.description}`]: {
        color: this.$gui.processTextColor,
      },
    });
  },
};
</script>

<template>
<transition
  appear
  :enter-class="$style.enter"
  :enter-active-class="$style.enterActive"
  :enter-to-class="$style.enterTo"
  :leave-class="$style.leave"
  :leave-active-class="$style.leaveActive"
  :leave-to-class="$style.leaveTo"
>
  <div :class="$style.actionProcessing">
    <div :class="$style.content">
      <template v-if="content === '3d-security'">
        <div :class="$style.icon">
          <IconCardSecurity v-if="icon === 'card'" />
          <IconProcessSecurity v-if="icon === 'other'" />
        </div>
        <div>
          <h2
            :class="$style.titleMain"
            v-html="$t('ActionProcessing.title')"
          >
          </h2>
        </div>
        <div
          :class="$style.description"
        >
          <span
            v-for="(chunk, index) in $t('ActionProcessing.description')"
            v-html="chunk"
            :key="index"
          ></span>
        </div>
        <div :class="$style.preloader">
          <UiSimplePreloader />
        </div>
      </template>
      <UiSimplePreloader v-else />
    </div>
  </div>
</transition>
</template>

<style lang="scss" module>
.actionProcessing {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 40px 20px;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;

  &:before {
    content: '';
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    opacity: 0.95;
  }
}

.content {
  position: relative;
  z-index: 2;
}

.icon {
  margin-bottom: 24px;
  padding-top: 40px;
}

.titleMain {
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 18px;
}

.description {
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.preloader {
  margin-top: 60px;
}

.enter,
.leaveTo {
  opacity: 0;
}
.enterTo,
.leave {
  opacity: 1;
}
.enterActive,
.leaveActive {
  transition: opacity 0.15s ease-in-out;
}
</style>
