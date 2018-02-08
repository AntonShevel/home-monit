'use strict';

const net = require('net');
const fs = require('fs');

function getImage(config) {
  const login = config.camera.connection.user;
  const pass = config.camera.connection.pass;
  const auth = new Buffer(login + ":" + pass, "utf8").toString("base64");

  return new Promise((resolve, reject) => {
    const socketConnection = net.createConnection('18756', '10.100.1.51');
    socketConnection.on('error', function (error) {
      socketConnection.end();
      reject(error);
    });
    socketConnection.on('connect', () => {
      const request = "GET /snapshot.cgi HTTP/1.1\r\n"
        + "Host: 10.100.1.51:18756\r\n"
        + `Authorization: Basic ${auth}\r\n`
        + "Accept: */*\r\n\r\n";
      socketConnection.write(request);
    });
    socketConnection.once('data', (data) => {
      const needle = '\r\n\r\n';
      const position = data.indexOf(needle) + needle.length;
      const wStream = fs.createWriteStream('stream_snapshot.jpg');

      wStream.write(data.slice(position));

      socketConnection.pipe(wStream).on('finish', () => {
        socketConnection.end();
        resolve(true);
      })
    });
  });
}

module.exports = {
  getImage: getImage
};
