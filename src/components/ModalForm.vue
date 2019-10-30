<script>
import LocaleChanger from '@/components/LocaleChanger.vue';
import StubPreloaderFormModal from '@/components/StubPreloaderFormModal.vue';
import { gtagEvent } from '@/analytics';

export default {
  components: {
    LocaleChanger,
    StubPreloaderFormModal,
  },
  props: {
    isLoading: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      hasLocaleChangerOpened: false,
    };
  },
  mounted() {
    this.$addCssRules({
      [`.${this.$style.layout}`]: {
        'background-color': this.$gui.formBackgroundColor,
      },
      [`.${this.$style.link}`]: {
        color: this.$gui.layoutTextColor,
      },
      [`.${this.$style.link}:hover`]: {
        color: this.$gui.baseHoverColor,
      },
      [`.${this.$style.iconSupport}`]: {
        fill: this.$gui.layoutTextColor,
      },
      [`.${this.$style.iconSupport}:hover`]: {
        fill: this.$gui.baseHoverColor,
      },
      [`.${this.$style.locale}.${this.$style._opened}::after`]: {
        'border-bottom-color': this.$gui.localeChangerModalBoxColor,
      },
    });
  },
  methods: {
    fireAnalyticsEvent(elementName) {
      gtagEvent(`click${elementName}Link`, { event_category: 'userAction' });
    },
  },
};
</script>

<template>
<div :class="$style.layout">
  <UiTransitionFade>
    <StubPreloaderFormModal
      v-if="isLoading"
      :class="$style.stub"
    />
    <div
      v-else
      :class="$style.box"
    >
      <div :class="$style.header">
        <div :class="$style.links">
          <a
            href="#"
            :class="$style.link"
            @click="fireAnalyticsEvent('PaySuper')"
          >PaySuper</a>
          <a
            href="#"
            :class="$style.link"
            @click="fireAnalyticsEvent('IconSupport')"
          >
            <IconSupport :class="$style.iconSupport" />
          </a>
          <span
            :class="[$style.link, $style.locale, { [$style._opened]: hasLocaleChangerOpened }]"
            :title="$i18n.getLocaleLabel()"
            @click="hasLocaleChangerOpened = !hasLocaleChangerOpened"
          >
            {{ $i18n.getLocaleLabel() }}
          </span>
        </div>
      </div>

      <div :class="$style.content">
        <slot />
        <LocaleChanger
          v-if="hasLocaleChangerOpened"
          :class="$style.localeChanger"
          @changeLocale="hasLocaleChangerOpened = false"
        />
      </div>
    </div>
  </UiTransitionFade>
</div>
</template>

<style module lang="scss">
.layout {
  width: 320px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.wrapper {
  min-height: 100%;
  position: relative;
  display: flex;
}
.box {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
}
.header {
  display: flex;
  align-items: center;
  flex-grow: 0;
  padding: 0 20px;

  @include if-rtl {
    flex-direction: row-reverse;
  }
}
.links {
  display: flex;
  font-size: 12px;
  font-weight: 500;
  line-height: 55px;
  height: 55px;
  width: 100%;

  @include if-rtl {
    flex-direction: row-reverse;
  }
}
.link {
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
}
.locale {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 30px;

  &._opened::after {
    position: absolute;
    content: '';
    bottom: 0px;
    border: 8px solid transparent;
    left: 0;
    right: 0;
    margin: 0 auto;
    box-sizing: border-box;
    width: 16px;
  }
}
.iconSupport {
  opacity: 1;
}
.content {
  display: flex;
  flex-grow: 1;
  max-height: calc(100% - 55px);
  position: relative;
}
.localeChanger {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 70px);
}
</style>
