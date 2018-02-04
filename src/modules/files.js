"use strict";

const fs = require('fs');
const path = require('path');
let dir, threshold, limit;


function init(config) {
  dir = config.dir;
  threshold = config.threshold;
  limit = config.limit;
}

function monitorFiles()
{
  fs.watch(dir, (eventType, filename) => {
    console.log(eventType); //event type = change
    if (filename) {
      // check if exists and upload
      console.log('movement', eventType, filename);
    }
  });
}

function rotateFiles() {
  fs.readdir(dir, (err, files) => {
    if (files.length < limit) return;
    files.map(file => {
      const filePath = path.join(dir, file);
      const time = new Date().getTime();

      fs.stat(filePath, (err, stat) => {
        console.log(stat);
        if (stat.ctimeMs < (time - threshold)) {
          fs.unlink(filePath, (err, res) => console.log('delete file', err, res));
        }
      })
    })
  });
}

module.exports = {
  init: init,
  rotateFiles: rotateFiles,
  monitorFiles: monitorFiles
};
