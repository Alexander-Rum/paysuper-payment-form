<template>
<div :class="[$style.container, $style[`_${layout}`]]">
  <UiScrollbarBox
    :class="$style.scrollbar"
    :settings="{suppressScrollX: true}"
  >
    <div :class="[$style.inner, $style[`_${layout}`]]">
      <div
        v-for="(locale, localeCode) in locales"
        :key="localeCode"
        :class="[
          $style.item,
          $style[`_${layout}`],
          { [$style._current]: $i18n.locale === localeCode }
        ]"
        @click="changeLocale(localeCode)"
      >
        <div :class="$style.icon">
          <component :is="iconLang(localeCode)" />
        </div>

        <div :class="$style.label">
          {{ locale.label }}
        </div>
      </div>
    </div>
  </UiScrollbarBox>
</div>
</template>

<script>
import { mapActions } from 'vuex';
import { includes, upperFirst } from 'lodash-es';
import locales from '@/locales/scheme';

export default {
  name: 'localeСhanger',
  props: {
    layout: {
      type: String,
      default: 'modal',
      validator(value) {
        return includes(['modal', 'page'], value);
      },
    },
  },
  data() {
    return {
      locales,
    };
  },
  mounted() {
    const layoutClass = this.$style[`_${this.layout}`];
    const itemClass = this.$style.item;
    const layout = upperFirst(this.layout);
    const borderColor = this.$gui[`localeChanger${layout}BorderColor`];
    const boxColor = this.$gui[`localeChanger${layout}BoxColor`];
    const color = this.$gui[`localeChanger${layout}Color`];
    const currentColor = this.$gui[`localeChanger${layout}CurrentColor`];
    const hoverBorderColor = this.$gui[`localeChanger${layout}HoverBorderColor`];
    const hoverColor = this.$gui[`localeChanger${layout}HoverColor`];

    this.$addCssRules({
      [`.${this.$style.container}.${layoutClass}`]: {
        'background-color': boxColor,
      },
      [`.${itemClass}.${layoutClass}`]: {
        color,
        'border-bottom-color': borderColor,
      },
      [`.${itemClass}.${this.$style._current}.${layoutClass}`]: {
        color: currentColor,
      },
      [`.${itemClass}.${layoutClass}:hover`]: {
        color: hoverColor,
        'border-bottom-color': hoverBorderColor,
      },
    });
  },
  methods: {
    ...mapActions('PaymentForm', ['checkUserLanguage']),
    changeLocale(locale) {
      this.$changeLocale(locale);
      this.$emit('changeLocale', locale);
      this.checkUserLanguage(locale);
    },
    iconLang(locale) {
      const [lang] = locale.split('-');
      const componentName = `IconLang${upperFirst(lang)}`;

      if (this.$options.components[componentName]) {
        return componentName;
      }
      return 'IconLangNoIcon';
    },
  },
};
</script>

<style module lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2000;

  &._modal {
    overflow: hidden;
  }

  &._page {
    padding-left: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    border-radius: 6px;
  }

  @include if-rtl {
    direction: ltr;
  }
}
.inner {
  padding: 10px 40px;

  &._page {
    padding: 4px 20px 16px 0;
  }

  @include if-rtl {
    direction: rtl;
  }
}
.scrollbar {
  height: 100%;
  width: 100%;
}
.item {
  cursor: pointer;
  display: flex;
  height: 40px;
  line-height: 24px;
  margin: 0;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  padding-top: 16px;

  &._page,
  &._modal,
  &._current {
    cursor: pointer;
  }

  &._empty {
    display: none;
  }
}
.icon {
  border-radius: 3px;
  overflow: hidden;
  height: 18px;
  flex-shrink: 0;

  @include if-ltr {
    margin-right: 12px;
  }

  @include if-rtl {
    margin-left: 12px;
  }
}
.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
