#!/usr/bin/env node

'use strict';

const config = require('./config');
const temper = require('./modules/temper');
const camera = require('./modules/camera');
const ups = require('./modules/ups');
const armbian = require('./modules/armbian');
const files = require('./modules/files');
const socket = require('./modules/socket');

// TODO add logger

temper.init(config.temper);
camera.init(config.camera);
ups.init(config.ups);
files.init(config.files);


console.log('monitoring started');

(async () => {
  await camera.moveToPreset('preset1');
})();

setInterval(() => {
  armbian.getStatus()
    .then(data => console.log('Armbian status', data))
    .catch(error => console.log('CPU temp error', error));

  temper.getTemperature()
    .then(temp => console.log('temperature', temp))
    .catch(error => console.log('temper error', error));
  ups.getStatus()
    .then(status => {
      console.log('ups status', status);
    })
    .catch(error => console.log('ups error', error));
}, 30 * 1000);


// clean old images
setInterval(() => {
  files.rotateFiles();
}, 2 * 60 * 1000);

// monitor movement
files.monitorFiles();

// make shots
async function foo() {
  await camera.moveToPreset('preset1'); // preset1 Num1
  await socket.getImage(config);
  await camera.moveToPreset('preset0'); // preset0 Num0
}

setInterval(() => {
   // only during the daylight
  console.log('going to save image');
  foo()
    .then(res => console.log('rotation finished', res))
    .catch(error => console.log('image error', error));
}, 40 * 1000);

