/*global phantom, TestUtils, $, performance*/
'use strict';
var page = require('webpage').create(),
  actions = require('./actions.json'),
  t, address;

var timeMeasure = {};
var actionIndex = -1;
var timeBetweenActions = 150;
var clinetID;

t = Date.now();
address = 'http://localhost:5555/project/615';
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
        if (action.jQueryAction) {
          element[action.jQueryAction](action.params);
        } else {
          element = element[0];
          TestUtils.Simulate[action.action](element, action.params);
        }
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