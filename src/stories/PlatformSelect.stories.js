/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import PlatformSelect from '@/components/PlatformSelect.vue';

storiesOf('PlatformSelect', module)
  .add('default', () => ({
    components: { PlatformSelect },
    data() {
      return {
        platforms: [
          {
            id: 'steam',
            name: 'Steam',
          },
          {
            id: 'gog',
            name: 'GOG',
          },
          {
            id: 'uplay',
            name: 'Uplay',
          },
          {
            id: 'origin',
            name: 'Origin',
          },
          {
            id: 'psn',
            name: 'PSN',
          },
          {
            id: 'xbox',
            name: 'XBOX Store',
          },
          {
            id: 'nintendo',
            name: 'Nintendo Store',
          },
          {
            id: 'itch',
            name: 'Itch.io',
          },
          {
            id: 'egs',
            name: 'Epic Games Store',
          },
        ],
      };
    },
    template: `
      <div style="width: 300px;">
        <PlatformSelect :platforms="platforms.slice(0, 1)" currentPlatformId="steam" />
        <PlatformSelect :platforms="platforms.slice(0, 4)" currentPlatformId="gog" />
        <PlatformSelect :platforms="platforms" currentPlatformId="uplay" />
      </div>
    `,
  }));
