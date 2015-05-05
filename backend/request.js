/*jslint node:true*/
'use strict';
var https = require('https');

exports.getJSON = function (options, onSuccess, onError) {
  var headers = options.headers || {
    'Content-Type': 'application/json',
    'cookie': 'put-some-cookie'
  };
  var body;
  if (options.body) {
    body = JSON.stringify(options.body);
    headers['Content-Length'] = body.length;
  }
  var settings = {
    host: options.host || 'dev-datahub.socialexplorer.com',
    path: '/data/' + options.path,
    method: options.method || 'GET',
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

  if (body) {
    req.write(body);
  }

  req.end();
};

