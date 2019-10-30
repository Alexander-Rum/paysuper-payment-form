<script>
import StubPreloaderForm from '@/components/StubPreloaderForm.vue';

export default {
  name: 'StubPreloaderFormModal',
  props: {
    isVerticalModal: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    StubPreloaderForm,
  },
  mounted() {
    this.$addCssRules({
      [`
        .${this.$style.formStubHeader}::before,
        .${this.$style.formStubHeader} div,
        .${this.$style.formStubHeader}::after
      `]: {
        'background-color': this.$gui.stubContentColorSecondary,
      },
    });
  },
};
</script>

<template>
<div :class="$style.stubPreloaderForm">
  <div v-if="!isVerticalModal" :class="$style.formStubHeader">
    <div></div>
  </div>
  <StubPreloaderForm :isVerticalModal="isVerticalModal" />
</div>
</template>

<style lang="scss" module>
.stubPreloaderForm {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}

.formStubHeader {
  height: 55px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  &::before,
  &::after {
    height: 7px;
    content: '';
    border-radius: 2px;
  }
  &::before {
    width: 60px;
  }
  div {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin: 0 10px;
  }
  &::after {
    width: 20px;
  }
}
</style>
