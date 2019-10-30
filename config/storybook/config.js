/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import { configure, addDecorator } from '@storybook/vue';
import '../../src/vueExtentions';
import '../../src/globalComponents';
import '../../src/assets/styles/storybook-setup.scss';
import viewSchemes from '../../src/viewSchemes';
import i18n from '../../src/i18n';
import localesScheme from '../../src/locales/scheme';

Vue.prototype.$gui = viewSchemes.dark;

Vue.prototype.$changeLocale = function changeLocale(locale) {
  this.$i18n.locale = locale;
  const dir = localesScheme[locale].rtl ? 'rtl' : 'ltr';
  document.body.style.direction = dir;
};

const req = require.context('../../src/stories', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(() => ({
  template: '<div><story/></div>',
  i18n,
  created() {
    this.$changeLocale('en-US');
  },

  mounted() {
    function textNodesUnder(node) {
      let all = [];
      // eslint-disable-next-line
      for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === 3) all.push(node);
        else all = all.concat(textNodesUnder(node));
      }
      return all;
    }
    textNodesUnder(this.$el).forEach((item) => {
      if (item.data.match(/^[\n ]$/)) {
        return;
      }
      const sp1 = document.createElement('span');
      sp1.innerHTML = item.data.replace(/./g, '<span class="wawa">&nbsp;</span>');

      // заменяем существующий элемент sp2 на созданный нами sp1
      item.parentNode.replaceChild(sp1, item);
    });

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = `
      html, body {
        margin: 0;
        padding: 0;
      }
      .wawa {
        display: inline !important;
        border: 0;
        border-left-width: 1px;
        border-style: solid;
      }
      * {
        box-sizing: border-box;
      }
    `;
    styleElement.appendChild(document.createTextNode(''));

    document.head.appendChild(styleElement);
  },
}));

configure(loadStories, module);
