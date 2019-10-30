<script>
import { upperFirst, groupBy, map } from 'lodash-es';
import localesScheme from '@/locales/scheme';

export default {
  name: 'PlatformSelect',

  props: {
    currentPlatformId: {
      required: true,
      type: String,
    },
    platforms: {
      required: true,
      type: Array,
    },
  },

  model: {
    event: 'change',
    prop: 'currentPlatformId',
  },

  data() {
    return {
      currentPlatformUnitIndex: 0,
    };
  },

  computed: {
    platformsGrouped() {
      const platforms = this.platforms.map((item, index) => ({ ...item, position: index + 1 }));
      return map(
        groupBy(platforms, item => Math.ceil(item.position / 4) - 1),
        item => item,
      );
    },
    viewType() {
      if (this.platforms.length === 1) {
        return 'single';
      }
      if (this.platforms.length <= 4) {
        return 'several';
      }
      return 'slider';
    },

    offsetLeft() {
      const sign = localesScheme[this.$i18n.locale].rtl ? '' : '-';
      return `${sign}${100 * this.currentPlatformUnitIndex}%`;
    },
  },

  mounted() {
    this.$addCssRules({
      [`.${this.$style.item}, .${this.$style.platformSelect}`]: {
        'border-color': this.$gui.cartStrokeColor,
      },
      [`.${this.$style.item} > svg`]: {
        fill: this.$gui.cartIconsColor,
      },
      [`.${this.$style.single} > svg`]: {
        fill: this.$gui.cartSelectedIconsColor,
      },
      [`.${this.$style.sliderNavDot}`]: {
        fill: this.$gui.cartIconsColor,
      },
      [`.${this.$style.sliderArrow} > svg`]: {
        fill: this.$gui.cartIconsColor,
      },
      [`.${this.$style.sliderArrow}:hover > svg`]: {
        fill: this.$gui.cartSelectedIconsColor,
      },
      [`.${this.$style.item}.${this.$style._current}`]: {
        'background-color': this.$gui.cartSelectedBackgroundColor,
        'border-color': this.$gui.cartSelectedBackgroundColor,
      },
      [`.${this.$style.item}.${this.$style._current} > svg`]: {
        fill: this.$gui.cartSelectedIconsColor,
      },
      [`.${this.$style.sliderNavDot}.${this.$style._current}`]: {
        fill: this.$gui.cartAccentColor,
      },
    });
  },

  methods: {
    getIconComponent(platformId) {
      return `IconPlatform${upperFirst(platformId)}`;
    },
  },
};
</script>

<template>
<div :class="[$style.platformSelect, $style[`_${viewType}`]]">
  <div
    :class="$style.single"
    v-if="viewType === 'single'"
  >
    <component :is="getIconComponent(platforms[0].id)"></component>
  </div>
  <div
    :class="$style.wrapper"
    v-if="viewType !== 'single'"
  >
    <div :class="$style.items">
      <div
        :class="$style.itemsUnit"
        v-for="(itemsUnit, key) in platformsGrouped"
        :key="key"
        :style="{transform: `translateX(${offsetLeft})`}"
      >
        <div
          v-for="platform in itemsUnit"
          :class="[$style.item, { [$style._current]: currentPlatformId === platform.id }]"
          :key="platform.id"
          :title="platform.name"
          @click="$emit('change', platform.id)"
        >
          <component :is="getIconComponent(platform.id)"></component>
        </div>
      </div>
    </div>
    <span
      v-if="currentPlatformUnitIndex !== 0"
      :class="[$style.sliderArrow, $style._prev]"
      @click="currentPlatformUnitIndex -= 1"
    >
      <IconArrow />
    </span>
    <span
      v-if="currentPlatformUnitIndex < platformsGrouped.length - 1"
      :class="[$style.sliderArrow, $style._next]"
      @click="currentPlatformUnitIndex += 1"
    >
      <IconArrow />
    </span>
  </div>
  <div
    :class="$style.sliderNav"
    v-if="viewType === 'slider'"
  >
    <IconDot
      v-for="(itemsUnit, key) in platformsGrouped"
      :class="[$style.sliderNavDot, { [$style._current]: key === currentPlatformUnitIndex }]"
      :key="key"
    />
  </div>
</div>
</template>

<style lang="scss" module>
.platformSelect {
  border-top-width: 1px;
  border-top-style: solid;
  padding-top: 16px;
  margin-top: 10px;
}

.single {
  background: transparent;
}

.wrapper {
  position: relative;

  .platformSelect._slider & {
    padding: 0 16px;
    height: 72px;
  }
}

.items {
  display: flex;
  overflow: hidden;
}

.itemsUnit {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: transform 0.3s ease;

  .platformSelect._slider & {
    padding: 0 2px;
  }
}

.item {
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(50% - 2px);
  margin-bottom: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-out;

  &._current {
    cursor: default;
  }
}

.sliderNav {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.sliderNavDot {
  margin: 0 2px;
}

.sliderArrow {
  position: absolute;
  top: 0;
  bottom: 4px;
  width: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &._prev {
    left: 0;
    justify-content: flex-start;

    & > svg {
      margin-left: -3px;
      transform: rotate(90deg);
    }

    @include if-rtl {
      right: 0;
      left: auto;

      & > svg {
        margin-right: -3px;
        transform: rotate(-90deg);
      }
    }
  }
  &._next {
    right: 0;
    justify-content: flex-end;

    & > svg {
      margin-right: -3px;
      transform: rotate(-90deg);
    }

    @include if-rtl {
      left: 0;
      right: auto;

      & > svg {
        margin-left: -3px;
        transform: rotate(90deg);
      }
    }
  }
}
</style>
