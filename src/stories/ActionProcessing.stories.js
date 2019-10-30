/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import ActionProcessing from '@/components/ActionProcessing.vue';

storiesOf('ActionProcessing', module)
  .add('3d-security card', () => ({
    components: { ActionProcessing },
    template: `
      <div style="width: 500px">
        <ActionProcessing content="3d-security" icon="card" />
      </div>
    `,
  }))
  .add('3d-security other', () => ({
    components: { ActionProcessing },
    template: `
      <div style="width: 500px">
        <ActionProcessing content="3d-security" icon="other" />
      </div>
    `,
  }))
  .add('no-content', () => ({
    components: { ActionProcessing },
    template: `
      <div style="width: 500px">
        <ActionProcessing content="no-content" />
      </div>
    `,
  }));
