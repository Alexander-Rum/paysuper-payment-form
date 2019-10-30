<script>
export default {
  name: 'StubPreloaderCartVerticalModal',
  mounted() {
    this.$nextTick(() => {
      this.containerWidth = `${this.$el.clientWidth}px`;
      this.$addCssRules({
        [`
          .${this.$style.imageItemInner}::after,
          .${this.$style.itemCell}::after
        `]: {
          width: this.containerWidth,
        },
      });
    });

    this.$addCssRules({
      [`.${this.$style.imageItemInner}`]: {
        'background-color': this.$gui.stubContentColorPrimary,
      },
      [`.${this.$style.itemCell}`]: {
        'background-color': this.$gui.stubContentColorPrimary,
      },
      [`
        .${this.$style.imageItemInner}::after,
        .${this.$style.itemCell}::after
      `]: {
        'background-color': this.$gui.stubSpinContentColorPrimary,
      },
      [`.${this.$style.item}:nth-child(6) > .${this.$style.itemCell}`]: {
        'background-color': this.$gui.stubTotalColor,
      },
    });
  },
};
</script>

<template>
<div :class="$style.stubPreloaderCart">
  <div :class="$style.items">
    <div
      :class="$style.item"
      v-for="n in 6"
      :key="n"
    >
      <div :class="[$style.itemCell, $style._left]"></div>
      <div :class="[$style.itemCell, $style._right]"></div>
    </div>
  </div>
  <div :class="$style.images">
    <div
      v-for="index in 5"
      :class="$style.imageItem"
      :key="index"
    >
      <div :class="$style.imageItemInner"></div>
    </div>
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

.stubPreloaderCart {
  min-height: 100%;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
}
.items {
  display: flex;
  flex-direction: column;
  width: calc(100% - 106px);
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 23px;

  &:nth-child(1) > .itemCell._left,
  &:nth-child(4) > .itemCell._left {
    width: 50%;
  }
  &:nth-child(2) > .itemCell._left {
    width: 38%;
  }
  &:nth-child(3) > .itemCell._left,
  &:nth-child(5) > .itemCell._left {
    width: 65%;
  }
  &:nth-child(6) {
    & > .itemCell._left,
    & > .itemCell._right {
      height: 10px;
    }
    & > .itemCell._left {
      width: 20%;
    }
  }
}
.itemCell {
  height: 7px;
  border-radius: 2px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    @include spinElem;
  }

  &._right {
    width: 13%;

    &::after {
      animation-delay: 0.25s;
    }
  }
}
.images {
  display: flex;
  flex-wrap: wrap;
  width: 86px;
  justify-content: space-between;
  align-content: flex-start;
}
.imageItem {
  flex-basis: calc(50% - 3px);
  height: 40px;
  box-sizing: border-box;
  margin-bottom: 6px;
}
.imageItemInner {
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    @include spinElem;
    animation-delay: 0.4s;
  }

  &:nth-child(2n)::after {
    animation-delay: 0.45s;
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
