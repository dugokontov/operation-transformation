/*global phantom, React, $, performance*/
'use strict';
var page = require('webpage').create(),
  t, address;

var timeMeasure = {};
var actionIndex = -1;
var timeBetweenActions = 150;
var clinetID;
var actions = [{
  selector: 'table tbody tr:eq(1) td:eq(0) input',
  action: 'focus'
}, {
  selector: 'table tbody tr:eq(1) td:eq(0) input',
  action: 'change',
  params: {
    target: {
      value: 101121
    }
  }
}, {
  selector: 'table tbody tr:eq(1) td:eq(0) input',
  action: 'blur'
}, {
  selector: 'table tbody tr:eq(2) td:eq(2) input',
  action: 'focus'
}, {
  selector: 'table tbody tr:eq(2) td:eq(2) input',
  action: 'change',
  params: {
    target: {
      value: 99131
    }
  }
}, {
  selector: 'table tbody tr:eq(2) td:eq(2) input',
  action: 'blur'
}, {
  selector: 'table tbody tr:eq(0) td:eq(1) input',
  action: 'focus'
}, {
  selector: 'table tbody tr:eq(0) td:eq(1) input',
  action: 'change',
  params: {
    target: {
      value: 1
    }
  }
}, {
  selector: 'table tbody tr:eq(0) td:eq(1) input',
  action: 'blur'
}, {
  selector: 'table tbody tr:eq(1) td:eq(0) input',
  action: 'focus'
}, {
  selector: 'table tbody tr:eq(1) td:eq(0) input',
  action: 'change',
  params: {
    target: {
      value: 'Centar'
    }
  }
}, {
  selector: 'table tbody tr:eq(1) td:eq(0) input',
  action: 'blur'
}, {
  selector: '#rowPosition',
  jQueryAction: 'val',
  params: '0'
}, {
  selector: '#add-row',
  action: 'click'
}];

t = Date.now();
address = 'http://localhost:5555';
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
          React.addons.TestUtils.Simulate[action.action](element, action.params);
        }
      }, actions[actionIndex]);
      runNextAction();
    } else {
      setTimeout(giveStatistic, 2000);
    }
  }, timeBetweenActions);
};

page.onConsoleMessage = function (msg) {
  if (msg[0] === '{') {
    var when = performance.now();
    msg = JSON.parse(msg);
    if (msg.action === 'init') {
      clinetID = msg.value.priority;
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
  if (actionIndex === -1 && msg.action === 'new-user') {
    runNextAction();
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