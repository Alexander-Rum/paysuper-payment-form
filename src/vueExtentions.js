import Vue from 'vue';
import {
  extend,
  forEach,
  get,
  isEmpty,
  reduce,
} from 'lodash-es';
import webfontloader from 'webfontloader';
import localesScheme from '@/locales/scheme';
import fontsScheme from '@/fontsScheme';
import { gtagEvent } from '@/analytics';

function objectToCss(obj) {
  return reduce(obj, (result, value, key) => `${result}${key}:${value};`, '');
}

function $addCssRules(rules) {
  let styles = '';
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';

  forEach(rules, (rule, selector) => {
    if (!isEmpty(rule)) {
      const css = objectToCss(rule);
      styles += `${selector}{${css}}`;
    }
  });

  styleElement.innerHTML = styles;
  styleElement.appendChild(document.createTextNode(''));
  document.head.appendChild(styleElement);

  this.$on('hook:destroyed', () => {
    styleElement.parentNode.removeChild(styleElement);
  });
}

function $changeLocale(locale) {
  this.$i18n.locale = locale;
  const dir = localesScheme[locale].rtl ? 'rtl' : 'ltr';
  document.body.style.direction = dir;

  const font = fontsScheme[localesScheme[locale].font || 'Quicksand'];
  if (!font.isLoaded) {
    webfontloader.load({
      google: {
        families: [font.googleFontQuery],
      },
    });
    font.isLoaded = true;
  }

  document.body.style.fontFamily = font.fontFamily;

  gtagEvent('setLocale', {
    event_category: 'userAction',
    event_label: locale,
  });
}

function $getFieldErrorMessages(fieldPath) {
  const field = get(this.$v, fieldPath);

  if (!field) {
    return [];
  }

  return Object.keys(field.$params).filter(name => !field[name])
    .map((name) => {
      const message = this.$t(`errorMessages.${name}`);
      const params = field.$params[name];
      return message.replace(/%(.+?)%/g, (a, variable) => params[variable]);
    });
}

function $isFieldInvalid(fieldPath) {
  const field = get(this.$v, fieldPath);
  if (!field) {
    return false;
  }
  return Boolean(field.$invalid && field.$dirty);
}

function $getPrice(value, currency) {
  return new Intl.NumberFormat(this.$i18n.locale, { style: 'currency', currency }).format(value);
}

extend(Vue.prototype, {
  $addCssRules,
  $changeLocale,
  $getFieldErrorMessages,
  $isFieldInvalid,
  $getPrice,
});
