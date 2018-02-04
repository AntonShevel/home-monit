'use strict';

const dotEnvSafe = require('dotenv-safe');

dotEnvSafe.load({path: __dirname + '/../../.env'});

const config = {
  temper: {
    deviceId: 0
  },
  camera: {
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
    threshold: 500,
    limit: 100
  }
};

module.exports = config;
