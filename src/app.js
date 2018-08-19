#!/usr/bin/env node

'use strict';

const config = require('./config');
const temper = require('./modules/temper');
const camera = require('./modules/camera');
const ups = require('./modules/ups');
const armbian = require('./modules/armbian');
const files = require('./modules/files');
const socket = require('./modules/socket');
const submit = require('./modules/submit');

// TODO add logger

temper.init(config.temper);
camera.init(config.camera);
ups.init(config.ups);
files.init(config.files);


console.log('monitoring started');

(async () => {
  await camera.moveToPreset(config.camera.presetTokens[1]);
})();

async function getStatuses() {
  return {
    armbianStatus: await armbian.getStatus(),
    temperature: await temper.getTemperature(),
    upsStatus: await ups.getStatus()
  };
}

setInterval(() => {
  // const armbianStatus = armbian.getStatus();
  // const temperature = temper.getTemperature();
  // const upsStatus = ups.getStatus();

  getStatuses()
    .then(res => {
      console.log('before post');
      submit.postStatus(config, 'regular', res);
      console.log('statuses', res)
    })
    .catch(error => console.log('statuses error', error));

  // Promise.all([armbianStatus, temperature, upsStatus])
  //   .then(values => {
  //     console.log({
  //       armbianStatus: values[0],
  //       temperature: values[1],
  //       upsStatus: values[2]
  //     });
  //   })
  //   .catch(error => console.log('Promise all error', error));
}, 60 * 1000);


// clean old images
setInterval(() => {
  files.rotateFiles();
}, 10 * 60 * 1000);

// monitor movement
files.monitorFiles((filePath) => submit.postImage(config, 'alarm', filePath));

// make shots
async function makeShots() {
  await camera.moveToPreset(config.camera.presetTokens[0]); // preset1 Num1
  const imagePath = await socket.getImage(config);
  submit.postImage(config, 'regular', imagePath);
  await camera.moveToPreset(config.camera.presetTokens[1]); // preset0 Num0
}

setInterval(() => {
   // TODO only during the daylight
  console.log('going to save image');
  makeShots()
    .then(res => console.log('rotation finished', res))
    .catch(error => console.log('image error', error));
}, 60 * 1000);

