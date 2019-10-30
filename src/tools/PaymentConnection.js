import Centrifuge from 'centrifuge';
import Events from 'events';
import { receiveMessages, payoneFormSourceName } from '@/postMessage';
import { formLoadingPageUrl, websocketServerUrl } from '@/constants';

export default class PaymentConnection extends Events.EventEmitter {
  constructor({
    window, orderId, token, options,
  }) {
    super();
    this.window = window;
    this.orderId = orderId;
    this.token = token;
    this.options = options;

    this.centrifuge = null;

    this.redirectWindow = null;
    this.redirectWindowClosedInterval = null;
  }

  init() {
    this.centrifuge = new Centrifuge(websocketServerUrl);
    this.centrifuge.setToken(this.token);
    this.centrifuge.subscribe(`paysuper:order#${this.orderId}`, ({ data }) => {
      this.emit('newPaymentStatus', data);
    });
    this.centrifuge.connect();

    this.redirectWindow = this.window.open(formLoadingPageUrl, '_blank');
    this.redirectWindowClosedInterval = setInterval(() => {
      if (this.redirectWindow.closed) {
        this.emit('redirectWindowClosedByUser');
        this.closeRedirectWindow();
      }
    }, 200);

    receiveMessages(window, {
      INITED: () => {
        this.redirectWindow.postMessage({
          source: payoneFormSourceName,
          name: 'requestInitForm',
          data: {
            formData: {},
            options: {
              ...this.options,
              layout: 'loading',
            },
          },
        }, '*');
      },
    });

    this.window.addEventListener('message', (event) => {
      if (
        event.data.source === 'PAYSUPER_PAYMENT_FINISHED_PAGE'
        && event.data.name === 'FINAL_SUCCESS'
      ) {
        this.emit('finalSuccess');
        clearInterval(this.redirectWindowClosedInterval);
        this.closeRedirectWindow();
      }
    });
    return this;
  }

  closeRedirectWindow() {
    this.redirectWindow.close();
    this.centrifuge.disconnect();
    clearInterval(this.redirectWindowClosedInterval);
    this.emit('redirectWindowClosed');
    return this;
  }

  setRedirectWindowLocation(location) {
    this.redirectWindow.location = location;
    return this;
  }
}
