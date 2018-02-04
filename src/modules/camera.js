"use strict";

const onvif = require('node-onvif');
let device, profileToken;

async function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function movingParams(x, y) {
  return {
    'speed': {
      x: x, // Speed of pan (in the range of -1.0 to 1.0)
      y: y, // Speed of tilt (in the range of -1.0 to 1.0)
      z: 0.0  // Speed of zoom (in the range of -1.0 to 1.0)
    },
    'timeout': 1 // seconds
  }
}

function init(config) {
  profileToken = config.profileToken;
  device = new onvif.OnvifDevice(config.connection);
}

async function moveFor(x, y, delayTime) {
  await device.init();
  await device.ptzStop();
  await device.ptzMove(movingParams(x, y));
  await delay(delayTime);

  return device.ptzStop();
}

async function getSnapshotLink() {
  await device.init();

  return device.services.media.getSnapshotUri({
    ProfileToken: profileToken
  });
}

async function listPresets() {
  await device.init();

  return device.services.ptz.getPresets({
    ProfileToken: profileToken
  });
}

async function moveToPreset(presetToken) {
  console.log('move to preset', presetToken);
  await device.init();
  await device.ptzStop();

  await device.services.ptz.gotoPreset({
    'ProfileToken': profileToken,
    'PresetToken' : presetToken,
    'Speed'       : {'x': 1, 'y': 1, 'z': 1}
  });

  return delay(8);
}

async function listProfiles() {
  await device.init();

  return device.services.media.getProfiles();
}

async function getCurrentProfile() {
  await device.init();

  return device.getCurrentProfile();
}

async function detectDevices() {
  return onvif.startProbe();
}

module.exports = {
  init: init,
  moveFor: moveFor,
  moveToPreset: moveToPreset,
  listPresets: listPresets,
  listProfiles: listProfiles,
  getCurrentProfile: getCurrentProfile,
  getSnapshotLink: getSnapshotLink,
  detectDevices: detectDevices
};
