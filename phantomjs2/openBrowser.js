/*global phantom, TestUtils, $, performance, console*/
'use strict';
var page = require('webpage').create(),
  actions = require('./actions.json'),
  t, address;

var system = require('system');
var args = system.args;

if (!args[1] || args[1].lastIndexOf('http') !== 0) {
  console.error('second argument has to be URL');
  phantom.exit();
}

var timeMeasure = {};
var actionIndex = -1;
var timeBetweenActions = 500;
var clinetID;

t = Date.now();
address = args[1];
page.open(address, function (status) {
  if (status !== 'success') {
    console.log('FAIL to load the address');
  } else {
    t = Date.now() - t;
    console.log('Loading ' + address);
    console.log('Loading time ' + t + ' msec');
  }
});

var runNextAction = function () {
  actionIndex += 1;
  setTimeout(function () {
    if (actionIndex < actions.length) {
      page.evaluate(function (action) {
        var element = $(action.selector);
        TestUtils.Simulate[action.action](element, action.params);
      }, actions[actionIndex]);
      runNextAction();
    } else {
      setTimeout(giveStatistic, 2000);
    }
  }, timeBetweenActions);
};

page.onConsoleMessage = function (msg) {
  console.log(msg);
  if (msg[0] === '{') {
    var when = performance.now();
    msg = JSON.parse(msg);
    if (msg.action === 'init') {
      clinetID = msg.value.priority;
      runNextAction();
    } else if (msg.priority === clinetID && msg.action !== 'user-change-position') {
      var hash = msg.states.toString();
      if (!timeMeasure[hash]) {
        timeMeasure[hash] = {
          start: when,
          action: msg
        };
      } else {
        timeMeasure[hash].stop = when;
      }
    }
  }
};

var giveStatistic = function () {
  var stats = Object
    .keys(timeMeasure)
    .map(function (hash) {
      var action = timeMeasure[hash];
      return [action.stop - action.start, action.action.action].join();
    }).join('\n');

  var fs = require('fs');
  fs.write(clinetID + '-test-results.csv', stats, 'w');
  page.render(clinetID + '-page.png');
  phantom.exit();
};