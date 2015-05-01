/*jslint node:true*/
'use strict';
var https = require('https');

exports.getJSON = function (options, onSuccess, onError) {
  var headers = options.headers || {};
  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  var settings = {
    host: 'dev-datahub.socialexplorer.com' || options.host,
    path: '/data/' + options.path,
    method: 'GET' || options.method,
    headers:  headers
  };
  var req = https.request(settings, function (res) {
    var output = '';
    res.on('data', function (chunk) {
      output += chunk;
    });

    res.on('end', function () {
      onSuccess(JSON.parse(output));
    });
  });

  req.on('error', function (err) {
    onError(err);
  });

  req.end();
};

