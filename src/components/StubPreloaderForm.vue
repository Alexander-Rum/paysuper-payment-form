<script>
import { includes } from 'lodash-es';

export default {
  name: 'StubPreloaderForm',

  props: {
    layout: {
      type: String,
      default: 'modal',
      validator(value) {
        return includes(['modal', 'page'], value);
      },
    },
    isVerticalModal: {
      default: false,
      type: Boolean,
    },
  },

  data() {
    return {
      containerWidth: '320px',
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.containerWidth = `${this.$el.clientWidth}px`;
      this.$addCssRules({
        [`.${this.$style.item}::after`]: {
          width: this.containerWidth,
        },
      });
    });

    this.$addCssRules({
      [` 
        .${this.$style.item},
        .${this.$style.button} div::before
      `]: {
        'background-color': this.$gui.stubContentColorPrimary,
      },
      [`.${this.$style.item}::after`]: {
        'background-color': this.$gui.stubSpinContentColorPrimary,
      },
      [`.${this.$style.button} div`]: {
        'background-color': this.$gui.buttonBoxColor,
      },
    });
  },
};
</script>

<template>
<div
  :class="[
    $style.stubPreloaderForm,
    $style[`_layout-${layout}`],
    { [$style._isVertical]: isVerticalModal }]">
  <div :class="$style.items">
    <div
      :class="$style.item"
      v-for="n in 8"
      :key="n"
    ></div>
  </div>
  <div :class="$style.button">
    <div></div>
  </div>
</div>
</template>

<style lang="scss" module>
@mixin spinElem {
  top: 0;
  position: absolute;
  height: 100%;
  border-radius: 2px;
  animation: {
    name: spin;
    duration: 1.5s;
    timing-function: linear;
    iteration-count: infinite;
    fill-mode: backwards;
  }

  @include if-rtl {
    animation-direction: reverse;
  }
}

.stubPreloaderForm {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  &._layout-page {
    margin: 60px 0;
  }

  &._isVertical {
    max-height: 100%;
  }
}
.items {
  display: flex;
  flex-wrap: wrap;
  padding: 0 40px;
  justify-content: space-between;
  align-items: center;

  .stubPreloaderForm._layout-page & {
    padding: 0;
  }

  .stubPreloaderForm._isVertical & {
    height: calc(100% - 60px);
    align-content: space-between;
    padding-bottom: 24px;
  }
}
.item {
  display: flex;
  align-items: center;
  margin-top: 50px;
  border-radius: 2px;
  width: 100%;
  height: 10px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    @include spinElem;
  }

  &:first-child {
    margin-top: 24px;
  }

  &:nth-child(3),
  &:nth-child(4) {
    flex-basis: calc(50% - 10px);
  }
  &:nth-child(4) {
    margin-left: 20px;

    &::after {
      animation-delay: 0.152s;
    }

    @include if-rtl {
      margin-right: 20px;
      margin-left: 0;
    }
  }

  &:nth-child(7) {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  &:nth-child(8) {
    height: 10px;
    width: 45%;
    margin-left: 10px;
    margin-right: auto;

    &::after {
      animation-delay: 0.025s;
    }

    @include if-rtl {
      margin-right: 10px;
      margin-left: auto;
    }
  }

  .stubPreloaderForm._isVertical & {
    margin-top: 24px;

    &:nth-child(2) {
      flex-basis: calc(50% - 10px);
    }
    &:nth-child(3),
    &:nth-child(4) {
      flex-basis: calc(25% - 15px);
      margin-left: 20px;
    }
    &:nth-child(3) {
      &::after {
        animation-delay: 0.152s;
      }

      @include if-rtl {
        margin-right: 20px;
        margin-left: 0;
      }
    }
  }
}
.button {
  display: flex;
  align-items: flex-end;
  flex-grow: 1;
  z-index: 2;

  & > div {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .stubPreloaderForm._layout-page & {
      margin-top: 77px;
      border-radius: 12px;
    }

    &::before {
      width: 100px;
      height: 15px;
      content: '';
      border-radius: 2px;
    }
  }
}
@keyframes spin {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(300%);
  }
}
</style>
