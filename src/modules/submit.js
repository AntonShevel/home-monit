'use strict';

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

function postStatus(config, type, payload) {
  console.log('submit status');

  return axios({
    method: 'post',
    baseURL: config.submit.host,
    url: '/statuses',
    data: {
      type: type,
      status: payload
    }
  });
}

async function postImage(config, type, path) {
  console.log('submit image', path);

  const data = new FormData();
  data.append('type', type);
  data.append('image', fs.createReadStream(path));

  return axios({
    method: 'post',
    baseURL: config.submit.host,
    url: '/images',
    headers: data.getHeaders(),
    data: data
  })
}

module.exports = {
  postStatus: postStatus,
  postImage: postImage,
};
