<script>
import { includes } from 'lodash-es';
import IconTotemFail from '@/components/IconTotemFail.vue';
import IconTotemSuccess from '@/components/IconTotemSuccess.vue';
import IconCardCracked from '@/components/IconCardCracked.vue';
import IconCardFail from '@/components/IconCardFail.vue';
import IconCardSuccess from '@/components/IconCardSuccess.vue';
import IconLetsPlay from '@/components/IconLetsPlay.vue';
import UiTextField from '@/components/UiTextField.vue';

export default {
  name: 'ActionResult',

  components: {
    IconTotemFail,
    IconTotemSuccess,
    IconCardCracked,
    IconCardFail,
    IconCardSuccess,
    IconLetsPlay,
    UiTextField,
  },

  props: {
    type: {
      required: true,
      type: String,
      validator(value) {
        return includes(['noMoneyError', 'unknownError', 'customError', 'success'], value);
      },
    },

    message: {
      type: String,
    },

    orderId: {
      required: true,
      type: String,
    },

    orderType: {
      required: true,
      type: String,
      validator(value) {
        return includes(['key', 'product', 'simple', 'virtual_currency', 'virtual_items'], value);
      },
    },

    platformInstructionLink: {
      default: '',
      type: String,
    },

    email: {
      required: true,
      type: String,
    },
  },

  computed: {
    types() {
      return {
        // 1. Охуевший тотем - нахватка средств или специальная ошибка (+ жёлтый текст и опции)
        // 2. Карта с крестиком - неведомая ошибка
        // 3. Разбитая карта - общая ошибка с текстом
        noMoneyError: {
          title: this.$t('ActionResult.noMoneyError.title'),
          subtitle: this.$t('ActionResult.noMoneyError.subtitle'),
          iconComponent: 'IconTotemFail',
          description: this.$t('ActionResult.noMoneyError.description'),
        },
        unknownError: {
          title: this.$t('ActionResult.unknownError.title'),
          subtitle: this.$t('ActionResult.unknownError.subtitle'),
          iconComponent: 'IconCardFail',
          description: this.$t('ActionResult.unknownError.description'),
        },
        customError: {
          title: this.$t('ActionResult.customError.title'),
          subtitle: this.$t('ActionResult.customError.subtitle'),
          iconComponent: 'IconCardCracked',
          description: this.$t('ActionResult.customError.description'),
        },
        success: {
          title: this.$t('ActionResult.success.title'),
          titleSubSlave: this.$t(`ActionResult.success.titleSubSlave.${this.orderType}`, {
            link: this.platformInstructionLink,
          }),
          descriptionSlaveFinal: this.$t(
            `ActionResult.success.descriptionSlaveFinal.${this.orderType}`,
          ),
          descriptionSlaveInitial: this.$t('ActionResult.success.descriptionSlaveInitial'),
          email: this.$t('ActionResult.success.email'),
          iconComponent: 'IconTotemSuccess',
          // iconComponent: 'IconCardSuccess',
        },
      };
    },
  },
  created() {
    this.$addCssRules({
      [`.${this.$style.titleMain}`]: {
        color: this.$gui.resultTitleColor,
      },
      [`.${this.$style.titleSub}`]: {
        color: this.$gui.resultSubtitleColor,
      },
      [`.${this.$style.description}`]: {
        color: this.$gui.resultTextColor,
      },
      [`.${this.$style.titleSubSlave}, .${this.$style.descriptionSlave}`]: {
        color: this.$gui.resultSubtextColor,
      },
      [`.${this.$style.code}`]: {
        color: this.$gui.resultCodeColor,
      },
      [`.${this.$style.email}`]: {
        color: this.$gui.resultEmailColor,
      },
    });
  },
};
</script>

<template>
  <div :class="$style.actionResult">
    <div>
      <h2 :class="$style.titleMain">{{types[type].title}}</h2>
      <div v-if="type === 'success'">
        <p
          :class="$style.titleSubSlave"
          v-html="types[type].titleSubSlave"
        >
        </p>
      </div>
      <p
        :class="$style.titleSub"
        v-else
      >{{types[type].subtitle}}</p>
    </div>
    <div :class="$style.icon">
      <component
        :is="types[type].iconComponent"
        :class="$style.iconComponent"
      />
    </div>
    <div v-if="type === 'success'">
      <template v-if="false">
        <p :class="$style.descriptionSlave">
          {{types[type].descriptionSlaveInitial}}
        </p>
        <UiTextField
          v-model="email"
          :label="types[type].email"
          @input="$emit('emailChange', $event)"
        />
      </template>
      <p
        :class="$style.descriptionSlave"
        v-html="types[type].descriptionSlaveFinal"
      >
      </p>
      <p :class="$style.email">{{email}}</p>
    </div>
    <div
      :class="$style.description"
      v-else
    >
      <span v-html="message || types[type].description"></span>
    </div>
  </div>
</template>

<style lang="scss" module>
.actionResult {
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 12px 0 20px;
  width: 100%;
}

.titleMain {
  font-weight: bold;
  font-size: 25px;
  line-height: 31px;
  margin: 0 0 10px;
}

.titleSub {
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.titleSubSlave {
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 5px;
}

.icon {
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.iconComponent {
  animation: {
    name: showIcon;
    duration: 0.4s;
    timing-function: ease;
    iteration-count: 1;
    fill-mode: forwards;
  }
}

.code {
  font-weight: bold;
  font-size: 12px;
  line-height: 22px;
  margin: 0 -20px;
}

.description {
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
}

.descriptionSlave {
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
}

.email {
  font-weight: bold;
  font-size: 15px;
  line-height: 19px;
  margin-top: 8px;
}

@keyframes showIcon {
  0% {
    max-height: 0;
  }
  100% {
    max-height: 100%;
  }
}
</style>
