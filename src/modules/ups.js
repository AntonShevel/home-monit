'use strict';

const Nut = require('node-nut');
let nut;
let device;

function init(config) {
  nut = new Nut(config.port, config.host);
  device  = config.device; //
}

async function listDevices() {
  nut.start();
  return new Promise((resolve, reject) => {
    nut.on('error', (error) => {
      reject(error);
      nut.close();
    });
    nut.on('ready', () => {
      nut.GetUPSList(function(upslist, error) {
        if (error) reject(error);
        resolve(upslist);
        nut.close();
      });
    });
  });
}

// ups.status
// OL -- online
// OL CHRG -- chagring
// OL TRIM -- work from battery
async function getStatus() {
  nut.start();
  return new Promise((resolve, reject) => {
    nut.GetUPSVars(device, function(variables, error) {
      if (error) reject(error);

      resolve({
        batteryCharge: variables['battery.charge'],
        inputVoltage: variables['input.voltage'],
        outputVoltage: variables['output.voltage'],
        upsStatus: variables['ups.status']
      });
      nut.close();
    });
  });
}

module.exports = {
  init: init,
  getStatus: getStatus,
  listDevices: listDevices
};
