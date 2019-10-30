# PaySuper Payment Form

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-brightgreen.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://api.travis-ci.org/ProtocolONE/payone-js-payment-form.svg?branch=master)](https://travis-ci.org/ProtocolONE/token_one)
[![codecov](https://codecov.io/gh/paysuper/paysuper-payment-form/branch/master/graph/badge.svg)](https://codecov.io/gh/paysuper/paysuper-payment-form)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=paysuper_paysuper-payment-form&metric=alert_status)](https://sonarcloud.io/dashboard?id=paysuper_paysuper-payment-form)

## Usage

### In development
You can use the package in pair with `payone-js-sdk`.
With `yarn serve` the form will be accessable in `payone-js-sdk` in development mode.

#### http://localhost:4040/
Modal form in new design

#### http://localhost:4040/sandbox/
Sandbox page for new design components development

#### http://localhost:4040/page/
Standalone page in new design

### In production
Define mounting place with id `p1payone-form` and initial data before attaching the form script
```html
<div id="p1payone-form"></div>
<script>
// Required
window.PAYSUPER_FORM_DATA = {
  id: '5c20e',
  has_vat: true,
  has_user_commission: true,
  project: { ... },
  payment_methods: [ ... ]
}
// Those are optional. Below defined values are default.
window.PAYSUPER_API_URL = 'https://p1payapi.tst.protocol.one';
window.PAYSUPER_WEBSOCKET_URL = 'wss://cf.tst.protocol.one/connection/websocket';
</script>
<script src="https://cdn.pay.super.com/payform/latest/paysuper-form.js"></script>
```

### Library URLs
#### Hub with navigation
https://static.protocol.one/minio/payone/

#### Dev version
https://static.protocol.one/payone/form/dev/p1payone-form.js
Updates automatically with `master` branch updates

#### Production release
https://cdn.pay.super.com/payform/latest/paysuper-form.js
https://cdn.pay.super.com/payform/v2.2.1-alpha/paysuper-form.js
Updates width actual version releases (`v*` tag pushed into repo)

## Development

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies into single js-file
```
yarn build
```

### Like `run build` but with dist file size analysis
```
yarn check-size
```

### Run tests
```
yarn test
```

### Run tests for development in watch mode 
```
yarn test:dev
```


## Contributing
We feel that a welcoming community is important and we ask that you follow PaySuper's [Open Source Code of Conduct](https://github.com/paysuper/code-of-conduct/blob/master/README.md) in all interactions with the community.

PaySuper welcomes contributions from anyone and everyone. Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

The master branch of this repository contains the latest stable release of this component.

 

### Screenshot testing hint
https://static.protocol.one/paysuper/form/dev/tests/base-button-spec-js-base-button-vue-should-render-content-1-diff.png

Inside `.travis.yml`
`#- set -e` 
vs
`- rclone copy tests/unit/__image_snapshots__/__diff_output__/ :s3://paysuper/form/dev/tests --s3-access-key-id=$S3_ACCESS_KEY --s3-secret-access-key=$S3_SECRET_KEY --s3-endpoint=$S3_HOST`