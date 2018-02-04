
// *   Trying 10.100.1.51...
// * TCP_NODELAY set
// * Connected to 10.100.1.51 (10.100.1.51) port 18756 (#0)
// * Server auth using Basic with user 'admin'
// > GET /snapshot.cgi HTTP/1.1
// > Host: 10.100.1.51:18756
// > Authorization: Basic ....bG9sbzEyOA==
// > User-Agent: curl/7.54.0
// > Accept: */*


function getImage(config) {
  // TODO use params from the config
  const login = config.camera.connection.user;
  const pass = config.camera.connection.pass;
  const auth = new Buffer(login + ":" + pass, "utf8").toString("base64");

  const net = require('net');
  const socketConnection = net.createConnection('18756', '10.100.1.51');

  socketConnection.on('error', function (error) {
    console.log('connection error:', error);
  });


  socketConnection.on('connect', function () {
    const request = "GET /snapshot.cgi HTTP/1.1\r\n"
      + "Host: 10.100.1.51:18756\r\n"
      + `Authorization: Basic ${auth}\r\n`
      + "Accept: */*\r\n\r\n";
    socketConnection.write(request);
    console.log('SOCKET GET REQUEST SEND');
  });

  socketConnection.once('data', function (data) {
    const needle = '\r\n\r\n';
    const position = data.indexOf(needle) + needle.length;
    const fs = require('fs');
    const wStream = fs.createWriteStream('stream_snapshot.jpg');

    wStream.write(data.slice(position));

    this.pipe(wStream).on('finish', () => {
      console.log('image saved');
      socketConnection.end()
    })
  });

  socketConnection.on('end', function () {
    console.log('SOCKET ENDED');
  });

  socketConnection.on('error', function (error) {
    console.log('conntection error:', error);
    socketConnection.end();
  });
}

module.exports = {
  getImage: getImage
};
