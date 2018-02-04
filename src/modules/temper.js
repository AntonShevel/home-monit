"use strict";

const thermometers = require("temper1");
const devices = thermometers.getDevices();
let deviceId;

function init(config) {
  deviceId = config.deviceId;
}

async function getTemperature() {
  return new Promise((resolve, reject) => {
    if (devices[deviceId] === undefined) {
      reject('Invalid device id');
    }
    thermometers.readTemperature(devices[deviceId], (err, temperature) => {
      err ? reject(err) : resolve(temperature);
    });
  });
}

module.exports = {
  init: init,
  listDevices: thermometers.getDevices,
  getTemperature: getTemperature
};
