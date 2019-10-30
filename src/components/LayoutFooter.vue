<template>
<div :class="$style.footer">
  <div :class="$style.left"></div>
  <div :class="$style.right">
    <div :class="$style.links">
      <div
        v-if="isLoading"
        :class="$style.stub"
      >
        <span></span>
      </div>
      <template v-else>
        <a href="#" :class="$style.link">{{$t('LayoutFooter.userAgreement')}}</a>
        <a href="#" :class="$style.link">{{$t('LayoutFooter.refundPolicy')}}</a>
        <a href="#" :class="$style.link">{{$t('LayoutFooter.support')}}</a>
      </template>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'LayoutFooter',

  props: {
    isLoading: {
      default: false,
      type: Boolean,
    },
  },

  created() {
    this.$addCssRules({
      [`.${this.$style.left}`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`.${this.$style.right}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`.${this.$style.links}:before`]: {
        'background-color': this.$gui.cartBackgroundColor,
      },
      [`
        .${this.$style.stub}:before,
        .${this.$style.stub} span,
        .${this.$style.stub}:after
      `]: {
        'background-color': this.$gui.stubContentColorSecondary,
      },
      [`.${this.$style.link}`]: {
        color: this.$gui.layoutTextColor,
      },
      [`.${this.$style.link}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
    });
  },
};
</script>

<style module lang="scss">
.footer {
  display: flex;
  flex-grow: 0;

  @include if-rtl {
    flex-direction: row-reverse;
  }
}
.left {
  @media screen and (min-width: 640px) {
    width: 100%;
  }
}
.right {
  display: flex;
  width: 100%;
}
.links {
  display: flex;
  line-height: 18px;
  padding: 52px 0 52px;
  width: 100%;
  margin: 0 30px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;

  @include if-rtl {
    flex-direction: row-reverse;
  }

  &::before {
    content: '';
    position: absolute;
    height: 3px;
    left: 0;
    right: 0;
    top: 24px;
  }

  @media screen and (min-width: 640px) {
    margin: 0 0 0 5.5vw;
    padding: 12px 0 40px;
    justify-content: flex-start;
    margin-top: 30px;

    &::before {
      top: -24px;
    }
  }

  @media screen and (min-width: 1080px) {
    margin: 30px 0 0 60px;
  }
}
.link {
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 0;

  &:not(:last-child) {
    margin-right: 5vw;

    @media screen and (min-width: 640px) {
      margin-right: 30px;
    }
  }
}

.stub {
  display: flex;
  width: 100%;

  &:before,
  &:after,
  span {
    content: '';
    width: 110px;
    height: 7px;
    margin-right: 25px;
  }
}
</style>
