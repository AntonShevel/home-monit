'use strict';

const dotEnvSafe = require('dotenv-safe');

dotEnvSafe.load({path: __dirname + '/../../.env'});

const config = {
  submit: {
    host: process.env.SUBMIT_HOST
  },
  temper: {
    deviceId: 0
  },
  camera: {
    host: process.env.CAMERA_HOST,
    port: process.env.CAMERA_PORT,
    profileToken: '000',
    snapShotLink: '',
    connection: {
      xaddr: process.env.CAMERA_XADDR,
      user: process.env.CAMERA_USER,
      pass: process.env.CAMERA_PASS
    },
    presetTokens: [
      'preset0', 'preset1'
    ]
  },
  ups: {
    host: 'localhost',
    port: 3493,
    device: 'powercom'
  },
  files: {
    dir: process.env.FILES_DIR,
    threshold: 30000, // milliseconds
    limit: 100
  }
};

module.exports = config;
