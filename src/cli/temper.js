#!/usr/bin/env node

'use strict';

const temper = require('./../modules/temper');

console.log('Devices:');
console.log(temper.listDevices());
