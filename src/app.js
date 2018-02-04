#!/usr/bin/env node

'use strict';

const config = require('./config');
const temper = require('./modules/temper');
const camera = require('./modules/camera');
const ups = require('./modules/ups');
const armbian = require('./modules/armbian');
const files = require('./modules/files');

// TODO add logger
// TODO move config to .env
// TODO find a good linter instead of `standard`
// TODO remove .idea from git`

temper.init(config.temper);
camera.init(config.camera);
ups.init(config.ups);
files.init(config.files);


console.log('monitoring started');

// TODO move camera to initial position;
//camera.moveToPreset('preset1');

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
}, 20 * 1000);


// clean old images
setInterval(() => {
  files.rotateFiles();
}, 2 * 60 * 1000);

// monitor movement
files.monitorFiles();

// make shots
const socket = require('./modules/socket');
async function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
async function foo() {
  await camera.moveToPreset('preset1'); // preset1 Num1
  socket.getImage(config);
  await delay(3);
  await camera.moveToPreset('preset0'); // preset0 Num0
}

setInterval(() => {
   // only during the daylight
  console.log('going to save image');
  foo()
    .then(res => console.log('rotation finished', res))
    .catch(error => console.log('image error', error));
}, 60 * 1000);

