import routes from './routes';
import CurrentUserStore from './stores/CurrentUserStore';
import React from 'react';

let App = {
  init: function () {
    let cb = function () {
      routes.start();
      CurrentUserStore.offChange(cb);
    };
    CurrentUserStore.onChange(cb);
  }
};

window.$ = function (selector) {
  var node = document;
  var parts = selector.split(/:eq\((\d+)\)/);
  var index, position, nodeList;
  for (index = 0; index < parts.length; index += 2) {
    if (!parts[index]) {
      continue;
    }
    nodeList = node.querySelectorAll(parts[index]);
    position = parts[index + 1] || 0;
    node = nodeList[position];
    if (!node) {
      return null;
    }
  }
  return node;
};

export default App;
