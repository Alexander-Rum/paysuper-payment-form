/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import PaymentAreaWarning from '@/components/PaymentAreaWarning.vue';

storiesOf('PaymentAreaWarning', module)
  .add('default', () => ({
    components: { PaymentAreaWarning },
    data() {
      return {
        props: {
          style: { border: '1px solid green' },
          countries: [],
        },
      };
    },
    template: `
      <div style="width: 500px">
        <PaymentAreaWarning content="restricted" v-bind="props" />
        <PaymentAreaWarning content="select-location" v-bind="props" />
      </div>
    `,
  }));
