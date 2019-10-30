/**
 * App entry point
 */

import * as Sentry from '@sentry/browser';
import Vue from 'vue';
import assert from 'assert';
import Sandbox from '@/Sandbox.vue';
import App from '@/App.vue';
import Loading from '@/Loading.vue';
import '@/plugins/vuelidate';
import store from '@/store/RootStore';
import i18n from '@/i18n';
import { postMessage, receiveMessages } from '@/postMessage';
import localesScheme from '@/locales/scheme';
import getLanguage from '@/helpers/getLanguage';
import viewSchemes from '@/viewSchemes';
import '@/globalComponents';
import '@/vueExtentions';
import { gtagConfig, gtagSet } from '@/analytics';
import { apiUrl, sentryDsn } from '@/constants';
import 'intl';
import 'intl/locale-data/jsonp/en';

Vue.config.productionTip = false;
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new Sentry.Integrations.Vue({ Vue, attachProps: true })],
    environment: process.env.VUE_APP_BUILD_PURPOSE,
  });
}

const mountPoint = '#paysuper-payment-form';
const isPageInsideIframe = window.location !== window.parent.location;

/**
 * Mounts the app into element
 *
 * @param {Object} customOptions
 */
async function mountApp(customOptions = {}) {
  const { orderData, orderParams, baseOptions } = window.PAYSUPER_PAYMENT_FORM;
  assert(
    document.querySelector(mountPoint),
    `Define "${mountPoint}" element in the document to mount the app`,
  );

  // if (isPageInsideIframe) {
  //   if (!window.PAYSUPER_ORDER_PARAMS) {
  //     assert(orderParams, '"window.PAYSUPER_ORDER_PARAMS" is not defined or empty');
  //   } else if (!orderParams) {
  //     assert(orderParams, 'The order params are not recieved');
  //   }
  // }

  const language = getLanguage(localesScheme, navigator);
  const options = {
    apiUrl,
    email: '',
    viewScheme: 'dark',
    viewSchemeConfig: null,
    layout: 'page',
    isPageInsideIframe,
    language,
    ...baseOptions,
    ...customOptions,
  };

  if (options.layout !== 'loading') {
    store.dispatch('initState', {
      orderParams,
      orderData,
      options,
    });
  }

  let appComponent = App;
  if (options.layout === 'page') {
    if (isPageInsideIframe) {
      // Prevents scrollbar dangling before formResize ?
      document.body.style.overflow = 'hidden';
      document.body.parentNode.style.overflow = 'hidden';
    }
  } else if (options.layout === 'loading') {
    appComponent = Loading;
  } else if (process.env.NODE_ENV === 'development' && options.layout === 'sandbox') {
    appComponent = Sandbox;
  }
  const VueApp = Vue.extend(appComponent);

  Vue.prototype.$gui = {
    ...viewSchemes[options.viewScheme],
    ...(options.viewSchemeConfig || {}),
  };
  Vue.prototype.$layout = options.layout;

  new VueApp({
    store,
    i18n,
    created() {
      this.$changeLocale(options.language);

      gtagSet({
        currency: orderParams.currency,
        viewType: options.layout,
        viewScheme: options.viewScheme,
      });

      gtagConfig('UA-142750977-1', { page_path: `/${options.layout}` });
    },
  }).$mount(mountPoint);
}

if (isPageInsideIframe) {
  receiveMessages(window, {
    REQUEST_INIT_FORM(data = {}) {
      const { options } = data;
      mountApp(options);
    },
  });
} else {
  // Case where the form is opened by as actual page inside browser, not inside iframe
  mountApp();
}

postMessage('INITED');
