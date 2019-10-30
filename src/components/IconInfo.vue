<script>
export default {
  created() {
    this.$addCssRules({
      [`.${this.$style.iconInfo}`]: {
        fill: this.$gui.iconInfoColor,
      },
      [`.${this.$style.iconInfo}:hover`]: {
        fill: this.$gui.iconInfoHoverColor,
      },
    });
  },
};
</script>

<template>
<svg
  width="12"
  height="12"
  viewBox="0 0 12 12"
  :class="$style.iconInfo"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371
      0 12 2.68629 12 6ZM5 6C5 5.44772 5.44772 5 6 5C6.55228 5 7 5.44772 7 6V9C7 9.55229 6.55228
      10 6 10C5.44772 10 5 9.55229 5 9V6ZM6 2C5.44772 2 5 2.44772 5 3C5 3.55228 5.44772 4 6
      4C6.55228 4 7 3.55228 7 3C7 2.44772 6.55228 2 6 2Z"
  />
</svg>
</template>

<style module lang="scss">
.iconInfo {
  cursor: pointer;
  transition: fill 0.2s ease-out;
}
</style>
