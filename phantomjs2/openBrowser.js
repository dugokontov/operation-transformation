/*global phantom, React*/
'use strict';
var page = require('webpage').create(),
  t, address;

var actionIndex = 0;

var actions = [{
  tr: 0,
  td: 1,
  value: 33245
}, {
  tr: 0,
  td: 1,
  value: 'Proba'
}, {
  tr: 0,
  td: 1,
  value: 'Sadrzaj'
}, {
  tr: 0,
  td: 1,
  value: 892161
}, {
  tr: 0,
  td: 1,
  value: 11211
}, {
  tr: 0,
  td: 1,
  value: 33211
}, {
  tr: 0,
  td: 1,
  value: 10101010
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
  setTimeout(function () {
    if (actionIndex < actions.length) {
      page.evaluate(function (action) {
        var element = document.querySelectorAll('table tbody tr')[action.tr];
        element = element.querySelectorAll('td')[action.td];
        element = element.querySelector('input');

        React.addons.TestUtils.Simulate.focus(element);
        React.addons.TestUtils.Simulate.change(element, {
          target: {
            value: action.value
          }
        });
        React.addons.TestUtils.Simulate.blur(element);
      }, actions[actionIndex]);
      actionIndex += 1;
    } else {
      phantom.exit();
    }
  }, 500);
};

page.onConsoleMessage = function (msg) {
  console.log('CL', msg);
  var action = 'new-user';
  if (msg.slice(0, action.length) === action) {
    runNextAction();
  }
  action = 'updateCell';
  if (msg.slice(0, action.length) === action) {
    runNextAction();
  }
};