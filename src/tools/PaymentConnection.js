import Centrifuge from 'centrifuge';
import Events from 'events';
import { receiveMessages } from '@/postMessage';
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
    this.isSystemSuccess = false;
    this.systemSuccessTimeout = null;
    this.init();
  }

  init() {
    this.centrifuge = new Centrifuge(websocketServerUrl);
    this.centrifuge.setToken(this.token);
    this.centrifuge.subscribe(`paysuper:order#${this.orderId}`, ({ data }) => {
      this.closeRedirectWindow();
      if (data.status === 'PAYMENT_SYSTEM_PROCESSING_SUCCESS') {
        this.reportSystemSuccess();
        return;
      }
      if (data.status === 'COMPLETED') {
        this.emit('paymentCompleted');
      }
      if (data.status === 'DECLINED') {
        this.emit('paymentDeclined', data.decline);
      }
      clearTimeout(this.systemSuccessTimeout);
      this.disconnect();
    });
    this.centrifuge.connect();

    // Its important to open the window with empty url first. Sup IE11
    this.redirectWindow = this.window.open('', '_blank');
    this.setRedirectWindowLocation(formLoadingPageUrl);
    this.redirectWindowClosedInterval = setInterval(() => {
      if (this.redirectWindow.closed) {
        this.emit('redirectWindowClosedByUser');
        this.closeRedirectWindow().disconnect();
      }
    }, 200);

    receiveMessages(this.window, {
      PAYMENT_RESULT_PAGE_REPORT: ({ result }) => {
        if (result === 'success') {
          this.reportSystemSuccess();
          this.closeRedirectWindow();
        }
        // result "fail" is always equal with DECLINED status from centrifuge
        // no need to handle it explicitly
      },
    });
    return this;
  }

  disconnect() {
    this.centrifuge.disconnect();
    return this;
  }

  closeRedirectWindow() {
    clearInterval(this.redirectWindowClosedInterval);
    this.redirectWindow.close();
    return this;
  }

  setRedirectWindowLocation(location) {
    this.redirectWindow.location = location;
    return this;
  }

  reportSystemSuccess() {
    if (this.isSystemSuccess) {
      return;
    }
    this.emit('paymentSystemSuccess');
    this.isSystemSuccess = true;

    const oneMinute = 60 * 1000;
    this.systemSuccessTimeout = setTimeout(() => {
      this.emit('paymentDeclined', {
        code: 'ps*',
      });
      this.disconnect();
    }, oneMinute * 2);
  }
}
