#!/usr/bin/env node

'use strict';

const ups = require('./../modules/ups');
const config = require('./../config').ups;

(async () => {
  ups.init(config);
  console.log('Devices:');
  console.log(await ups.listDevices());
})();
