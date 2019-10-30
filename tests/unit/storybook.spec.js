import { forEach } from 'lodash-es';

const scheme = {
  UiButton: [
    'default',
  ],
  UiCheckbox: [
    'default',
  ],
  UiTextField: [
    'default',
  ],
  UiSelect: [
    {
      story: 'default',
      wait: 300,
    },
    {
      story: 'focused',
      wait: 300,
    },
  ],
  UiTip: [
    'default',
  ],
  UiCardField: [
    'default',
  ],
  Modal: [
    {
      story: 'default',
      wait: 300,
    },
    {
      story: 'loading',
      wait: 300,
    },
    {
      story: 'order error',
      wait: 300,
    },
  ],
  Page: [
    {
      story: 'default',
      testName: 'wide 1',
      viewport: {
        width: 1150,
        height: 700,
      },
    },
    {
      story: 'default',
      testName: 'wide 2',
      viewport: {
        width: 875,
        height: 700,
      },
    },
    {
      story: 'default',
      testName: 'mobile 1',
      viewport: {
        width: 500,
        height: 900,
      },
    },
    {
      story: 'cart open',
      testName: 'mobile 3',
      viewport: {
        width: 500,
        height: 900,
      },
    },

    {
      story: 'loading',
      testName: 'loading wide 1',
      viewport: {
        width: 1150,
        height: 700,
      },
    },
    {
      story: 'loading',
      testName: 'loading wide 2',
      viewport: {
        width: 875,
        height: 700,
      },
    },
    {
      story: 'loading',
      testName: 'loading mobile 1',
      viewport: {
        width: 500,
        height: 900,
      },
    },
  ],
  LocaleChanger: [
    {
      story: 'default',
      viewport: {
        width: 400,
        height: 1450,
      },
    },
  ],
  CartSection: [
    {
      story: 'modal',
      viewport: {
        width: 500,
        height: 4200,
      },
    },
    {
      story: 'page',
      viewport: {
        width: 700,
        height: 6400,
      },
    },
    {
      story: 'page',
      viewport: {
        width: 550,
        height: 5200,
      },
    },
  ],
  PlatformSelect: [
    'default',
  ],
  PaymentAreaWarning: [
    'default',
  ],
};

forEach(scheme, (list, key) => {
  describe(`Storybook ${key}`, () => {
    list.forEach((option) => {
      let config = {
        story: 'default',
        wait: 0,
      };
      if (typeof option === 'string') {
        config.story = option;
      } else {
        config = {
          ...config,
          ...option,
        };
      }
      it(`should render ${config.testName || config.story}`, async () => {
        await page.goto(
          `http://localhost:6006/iframe.html?selectedKind=${key}&selectedStory=${config.story}`,
        );

        if (config.viewport) {
          await page.setViewport(config.viewport);
        }

        return new Promise((resolve) => {
          setTimeout(async () => {
            const image = await page.screenshot();
            expect(image).toMatchImageSnapshot();
            resolve();
          }, config.wait);
        });
      });
    });
  });
});
