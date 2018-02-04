#!/usr/bin/env node

'use strict';

const config = require('./../config').camera;
const camera = require('./../modules/camera');
const command = process.argv[2];

if (command === undefined) {
  throw 'Command is required';
}

camera.init(config);

(async () => {
  switch (command) {
    case 'detect': {
      console.log('Detecting...');
      console.log(await camera.detectDevices());
      break;
    }
    case 'profiles': {
      console.log('Current profile:');
      console.log(await camera.getCurrentProfile());

      console.log('All profiles:');
      const profiles = await camera.listProfiles();
      console.log(profiles.data.GetProfilesResponse.Profiles);
      break;
    }
    case 'presets': {
      console.log('Device presets:');
      const presets = await camera.listPresets();
      console.log(presets.data.GetPresetsResponse.Preset);
      break;
    }
    case 'snapshot': {
      console.log('Snapshot link:');
      const snapshotLink = await camera.getSnapshotLink();
      console.log(snapshotLink.data.GetSnapshotUriResponse);
      break;
    }
    default: {
      throw 'Unknown command';
    }
  }
})();
