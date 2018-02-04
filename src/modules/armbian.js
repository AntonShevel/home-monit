'use strict';

const si = require('systeminformation');
const { exec } = require('child_process');

async function getCpuTemperature() {
  return new Promise((resolve, reject) => {
    exec('cat /etc/armbianmonitor/datasources/soctemp', (error, stdout, stderr) => {
      if (error) reject(error);
      if (stderr) reject(stderr);

      resolve(parseInt(stdout));
    });
  });
}

async function getMemoryInfo() {
  return si.mem();
}

function getUptime() {
  return si.time();
}

async function getStatus() {
  const memoryInfo = await getMemoryInfo();
  const uptime = getUptime();
  const cpuTemperature = await getCpuTemperature();

  return {
    cpuTemperature: cpuTemperature,
    freeMemory: memoryInfo.free,
    usedMemory: memoryInfo.used,
    uptime: uptime.uptime,
    currentTime: uptime.current,
    timezone: uptime.timezone
  }
}

module.exports = {
  getStatus: getStatus
};

// free -b
// uptime
