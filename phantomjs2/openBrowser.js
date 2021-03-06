/*global require, phantom, KeyboardEvent, $, performance, console*/
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

if (!args[2]) {
  console.error('third argument has to be region');
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
        if (action.action === 'change') {
          element.value = action.params;
        } else {
          var event = document.createEvent('KeyboardEvent');
          event.initEvent('blur', true, true);
          element.dispatchEvent(event);
        }
      }, actions[actionIndex]);
      runNextAction();
    }
  }, timeBetweenActions);
};

var beforeInitWaitTime;

page.onConsoleMessage = function (msg) {
  console.log(msg);
  if (msg[0] === '{') {
    var when = performance.now();
    msg = JSON.parse(msg);
    if (msg.action === 'before-init') {
      beforeInitWaitTime = when;
    } else if (msg.action === 'init') {
      beforeInitWaitTime = when - beforeInitWaitTime;
      clinetID = msg.value.priority;
      runNextAction();
    } else if (msg.priority === clinetID && msg.action !== 'user-change-position') {
      var hash = msg.states.toString();
      if (!timeMeasure[hash]) {
        timeMeasure[hash] = {
          times: [],
          request: msg
        };
      }
      timeMeasure[hash].times.push(when);
      var canGiveStatistic = Object.keys(timeMeasure).length > 3 && Object.keys(timeMeasure).every(function(h) {
        return timeMeasure[h].times.length > 2;
      });
      if (canGiveStatistic) {
        setTimeout(giveStatistic, 2000);
      }
    }
  }
};

var giveStatistic = function () {
  var stats = Object
    .keys(timeMeasure)
    .map(function (hash) {
      var benchmark = timeMeasure[hash];
      var times = benchmark.times;
      if (!times || times.length === 0) {
        return;
      }
      return times
        .slice(1)
        .map(function (stop, startIndex) {
          return (stop - times[startIndex]).toFixed(0);
        })
        .concat(args[2])
        .concat([beforeInitWaitTime.toFixed(0)]);
    }).join('\n');

  var fs = require('fs');
  fs.write(clinetID + '-test-results.csv', stats, 'w');
  phantom.exit();
};
