/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import ActionResult from '@/components/ActionResult.vue';

storiesOf('ActionResult', module)
  .add('noMoneyError', () => ({
    components: { ActionResult },
    template: `
      <div style="width: 500px">
        <ActionResult type="noMoneyError" orderId="dfsfsdfsd" message="fdsfsdf" />
      </div>
    `,
  }))
  .add('unknownError', () => ({
    components: { ActionResult },
    template: `
      <div style="width: 500px">
        <ActionResult type="unknownError" orderId="dfsfsdfsd" message="fdsfsdf" />
      </div>
    `,
  }))
  .add('customError', () => ({
    components: { ActionResult },
    template: `
      <div style="width: 500px">
        <ActionResult type="customError" orderId="dfsfsdfsd" message="fdsfsdf" />
      </div>
    `,
  }))
  .add('success', () => ({
    components: { ActionResult },
    template: `
      <div style="width: 500px">
        <ActionResult type="success" orderId="dfsfsdfsd" message="fdsfsdf" />
      </div>
    `,
  }))
  .add('success email', () => ({
    components: { ActionResult },
    template: `
      <div style="width: 500px">
        <ActionResult type="success" orderId="dfsfsdfsd" message="fdsfsdf" email="fdfd@fddf.ru" />
      </div>
    `,
  }));
