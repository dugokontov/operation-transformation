!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.APP=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/dugokontov/projects/operation-transformation/app/actions/TableActionCreator.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TableActions = require("./TableActions");

var TableActionCreator = (function () {
  function TableActionCreator() {
    _classCallCheck(this, TableActionCreator);
  }

  _createClass(TableActionCreator, null, {
    updateCell: {
      value: function updateCell(payload) {
        GLU.bus.emitAction(TableActions.UPDATE_CELL, payload);
      }
    },
    addRow: {
      value: function addRow(payload) {
        GLU.bus.emitAction(TableActions.ADD_ROW, payload);
      }
    },
    deleteRow: {
      value: function deleteRow(payload) {
        GLU.bus.emitAction(TableActions.DELETE_ROW, payload);
      }
    },
    userChangePosition: {
      value: function userChangePosition(payload) {
        GLU.bus.emitAction(TableActions.USER_CHANGE_POSITION, payload);
      }
    }
  });

  return TableActionCreator;
})();

module.exports = TableActionCreator;

},{"./TableActions":"/home/dugokontov/projects/operation-transformation/app/actions/TableActions.js"}],"/home/dugokontov/projects/operation-transformation/app/actions/TableActions.js":[function(require,module,exports){
"use strict";

var TableActions = {
  UPDATE_CELL: "updateCell",
  ADD_ROW: "addRow",
  DELETE_ROW: "deleteRow",
  USER_CHANGE_POSITION: "user-change-position"
};

module.exports = TableActions;

},{}],"/home/dugokontov/projects/operation-transformation/app/app.js":[function(require,module,exports){
"use strict";

var GridView = require("./components/grid/GridView");
var GridController = require("./components/grid/GridController");

var GridActionsView = require("./components/gridActions/GridActionsView");
var GridActionsController = require("./components/gridActions/GridActionsController");

var App = {
  init: function init() {
    var gridView = new GridView(document.body, "#grid");
    new GridController(gridView);

    var actionView = new GridActionsView(document.body, "#actions");
    new GridActionsController(actionView);

    gridView.render();
    actionView.render();
  }
};

module.exports = App;

},{"./components/grid/GridController":"/home/dugokontov/projects/operation-transformation/app/components/grid/GridController.js","./components/grid/GridView":"/home/dugokontov/projects/operation-transformation/app/components/grid/GridView.js","./components/gridActions/GridActionsController":"/home/dugokontov/projects/operation-transformation/app/components/gridActions/GridActionsController.js","./components/gridActions/GridActionsView":"/home/dugokontov/projects/operation-transformation/app/components/gridActions/GridActionsView.js"}],"/home/dugokontov/projects/operation-transformation/app/components/grid/CellViewReact.js":[function(require,module,exports){
"use strict";

var CellViewReact = React.createClass({
  displayName: "CellViewReact",

  onBlur: function onBlur(e) {
    this.props.updateCell(this.props.rowIndex, this.props.columnIndex, e.target.value, "change");
  },
  onChange: function onChange(e) {
    this.props.updateCell(this.props.rowIndex, this.props.columnIndex, e.target.value);
  },
  onFocus: function onFocus(e) {
    this.props.updateCell(this.props.rowIndex, this.props.columnIndex, e.target.value, "focus");
  },
  render: function render() {
    var _this = this;

    var up = this.props.usersPosition;
    var activeUsersHere = Object.keys(up).filter(function (userId) {
      return up[userId].rowIndex === _this.props.rowIndex && up[userId].columnIndex === _this.props.columnIndex;
    }).map(function (userId) {
      return React.createElement("div", { className: "user-" + userId });
    });
    return React.createElement(
      "td",
      null,
      React.createElement("input", { type: "text",
        value: this.props.value,
        ref: "value",
        onChange: this.onChange,
        onFocus: this.onFocus,
        onBlur: this.onBlur }),
      activeUsersHere
    );
  }
});

module.exports = CellViewReact;

},{}],"/home/dugokontov/projects/operation-transformation/app/components/grid/GridController.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TableActions = require("../../actions/TableActions.js");
var TableActionCreator = require("../../actions/TableActionCreator.js");
var TableStore = require("../../stores/TableStore.js");

var GridController = (function (_GLU$ViewController) {
  function GridController(view) {
    _classCallCheck(this, GridController);

    _get(Object.getPrototypeOf(GridController.prototype), "constructor", this).call(this, view);

    TableStore.onChange(this.onStoreChange, this);

    this.view.on(TableActions.UPDATE_CELL, this.onCellUpdate);
    this.view.on(TableActions.USER_CHANGE_POSITION, this.userChangePosition);
  }

  _inherits(GridController, _GLU$ViewController);

  _createClass(GridController, {
    onStoreChange: {
      value: function onStoreChange() {
        this.view.updateState(TableStore.data, TableStore.usersPosition);
      }
    },
    onCellUpdate: {
      value: function onCellUpdate(payload) {
        TableActionCreator.updateCell(payload);
      }
    },
    userChangePosition: {
      value: function userChangePosition(payload) {
        TableActionCreator.userChangePosition(payload);
      }
    }
  });

  return GridController;
})(GLU.ViewController);

module.exports = GridController;

},{"../../actions/TableActionCreator.js":"/home/dugokontov/projects/operation-transformation/app/actions/TableActionCreator.js","../../actions/TableActions.js":"/home/dugokontov/projects/operation-transformation/app/actions/TableActions.js","../../stores/TableStore.js":"/home/dugokontov/projects/operation-transformation/app/stores/TableStore.js"}],"/home/dugokontov/projects/operation-transformation/app/components/grid/GridView.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var data, usersPosition, view;
var GridViewReact = require("./GridViewReact.js");

var GridView = (function (_GLU$View) {
  function GridView(root, selector) {
    _classCallCheck(this, GridView);

    _get(Object.getPrototypeOf(GridView.prototype), "constructor", this).call(this, root, selector);

    data = [];
    usersPosition = {};
    view = this;
  }

  _inherits(GridView, _GLU$View);

  _createClass(GridView, {
    render: {
      value: function render() {
        React.render(React.createElement(GridViewReact, {
          data: data,
          usersPosition: usersPosition,
          view: view }), this.el);
      }
    },
    updateState: {
      value: function updateState(d, up) {
        data = d;
        usersPosition = up;
        this.render();
      }
    },
    data: {
      get: function () {
        return data;
      },
      set: function (d) {
        data = d;
        this.render();
      }
    },
    usersPosition: {
      get: function () {
        return usersPosition;
      },
      set: function (up) {
        usersPosition = up;
        this.render();
      }
    }
  });

  return GridView;
})(GLU.View);

module.exports = GridView;

},{"./GridViewReact.js":"/home/dugokontov/projects/operation-transformation/app/components/grid/GridViewReact.js"}],"/home/dugokontov/projects/operation-transformation/app/components/grid/GridViewReact.js":[function(require,module,exports){
"use strict";

var RowViewReact = require("./RowViewReact.js");
var TableActions = require("../../actions/TableActions.js");

var GridViewReact = React.createClass({
  displayName: "GridViewReact",

  getInitialState: function getInitialState() {
    return { data: this.props.data };
  },
  updateCell: function updateCell(rowIndex, columnIndex, value, action) {
    if (action === "focus") {
      this.props.view.emit(TableActions.USER_CHANGE_POSITION, {
        rowIndex: rowIndex,
        columnIndex: columnIndex
      });
      return;
    }
    this.props.data[rowIndex][columnIndex] = value;
    this.setState({ data: this.props.data });
    if (action) {
      this.props.view.emit(TableActions.UPDATE_CELL, {
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        value: value
      });
    }
  },
  render: function render() {
    var _this = this;

    var headers = [];
    var rows = [];
    if (this.props.data[0]) {
      headers = this.props.data[0].map(function (name, index) {
        return React.createElement(
          "th",
          null,
          "Col ",
          index + 1
        );
      });
      rows = this.props.data.map(function (row, index) {
        return React.createElement(RowViewReact, {
          row: row,
          key: index,
          rowIndex: index,
          usersPosition: _this.props.usersPosition,
          updateCell: _this.updateCell });
      });
    }
    return React.createElement(
      "table",
      null,
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          headers
        )
      ),
      React.createElement(
        "tbody",
        null,
        rows
      )
    );
  }
});

module.exports = GridViewReact;

},{"../../actions/TableActions.js":"/home/dugokontov/projects/operation-transformation/app/actions/TableActions.js","./RowViewReact.js":"/home/dugokontov/projects/operation-transformation/app/components/grid/RowViewReact.js"}],"/home/dugokontov/projects/operation-transformation/app/components/grid/RowViewReact.js":[function(require,module,exports){
"use strict";
var CellViewReact = require("./CellViewReact.js");

var RowViewReact = React.createClass({
  displayName: "RowViewReact",

  render: function render() {
    var _this = this;

    var cells = [];
    if (this.props.row.length) {
      cells = this.props.row.map(function (cell, index) {
        return React.createElement(CellViewReact, {
          value: cell,
          key: index,
          columnIndex: index,
          rowIndex: _this.props.rowIndex,
          usersPosition: _this.props.usersPosition,
          updateCell: _this.props.updateCell });
      });
    }
    return React.createElement(
      "tr",
      null,
      cells
    );
  }
});

module.exports = RowViewReact;

},{"./CellViewReact.js":"/home/dugokontov/projects/operation-transformation/app/components/grid/CellViewReact.js"}],"/home/dugokontov/projects/operation-transformation/app/components/gridActions/GridActionsController.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TableActions = require("../../actions/TableActions.js");
var TableActionCreator = require("../../actions/TableActionCreator.js");

var GridActionsController = (function (_GLU$ViewController) {
  function GridActionsController(view) {
    _classCallCheck(this, GridActionsController);

    _get(Object.getPrototypeOf(GridActionsController.prototype), "constructor", this).call(this, view);

    this.view.on(TableActions.ADD_ROW, this.addRow);
    this.view.on(TableActions.DELETE_ROW, this.deleteRow);
  }

  _inherits(GridActionsController, _GLU$ViewController);

  _createClass(GridActionsController, {
    addRow: {
      value: function addRow(payload) {
        TableActionCreator.addRow(payload);
      }
    },
    deleteRow: {
      value: function deleteRow(payload) {
        TableActionCreator.deleteRow(payload);
      }
    }
  });

  return GridActionsController;
})(GLU.ViewController);

module.exports = GridActionsController;

},{"../../actions/TableActionCreator.js":"/home/dugokontov/projects/operation-transformation/app/actions/TableActionCreator.js","../../actions/TableActions.js":"/home/dugokontov/projects/operation-transformation/app/actions/TableActions.js"}],"/home/dugokontov/projects/operation-transformation/app/components/gridActions/GridActionsView.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var view;
var GridActionsViewReact = require("./GridActionsViewReact.js");

var GridView = (function (_GLU$View) {
  function GridView(root, selector) {
    _classCallCheck(this, GridView);

    _get(Object.getPrototypeOf(GridView.prototype), "constructor", this).call(this, root, selector);
    view = this;
  }

  _inherits(GridView, _GLU$View);

  _createClass(GridView, {
    render: {
      value: function render() {
        React.render(React.createElement(GridActionsViewReact, { view: view }), this.el);
      }
    }
  });

  return GridView;
})(GLU.View);

module.exports = GridView;

},{"./GridActionsViewReact.js":"/home/dugokontov/projects/operation-transformation/app/components/gridActions/GridActionsViewReact.js"}],"/home/dugokontov/projects/operation-transformation/app/components/gridActions/GridActionsViewReact.js":[function(require,module,exports){
"use strict";
var TableActions = require("../../actions/TableActions.js");

var GridViewReact = React.createClass({
  displayName: "GridViewReact",

  addRow: function addRow() {
    this.props.view.emit(TableActions.ADD_ROW, {
      rowIndex: +React.findDOMNode(this.refs.rowPosition).value.trim()
    });
  },
  deleteRow: function deleteRow() {
    this.props.view.emit(TableActions.DELETE_ROW, {
      rowIndex: +React.findDOMNode(this.refs.rowPosition).value.trim()
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "button",
        { onClick: this.addRow },
        "Add new row"
      ),
      React.createElement(
        "button",
        { onClick: this.deleteRow },
        "Remove row"
      ),
      React.createElement("input", { type: "text", defaultValue: "1", ref: "rowPosition" })
    );
  }
});

module.exports = GridViewReact;

},{"../../actions/TableActions.js":"/home/dugokontov/projects/operation-transformation/app/actions/TableActions.js"}],"/home/dugokontov/projects/operation-transformation/app/ot/ot.js":[function(require,module,exports){
/*jshint devel:true*/
/*global OT:true*/
"use strict";
var OT = (function () {
  var priority, data;
  var states = [];
  var log = [];
  var executeActions = {};
  var transformationMatrix = {};
  var options;
  var onModelChangeEvents = {};
  var usersPosition = {};

  var OT = function OT(o) {
    options = o || {};
  };

  OT.prototype.setData = function (d) {
    data = d;
  };

  OT.prototype.getData = function () {
    return data;
  };

  OT.prototype.setStates = function (s) {
    states = s;
  };

  OT.prototype.getPriority = function () {
    return priority;
  };

  OT.prototype.getUsersPostion = function () {
    return usersPosition;
  };

  OT.prototype.setExecuteActions = function (actions) {
    executeActions = actions;
  };

  OT.prototype.setTransformationMatrix = function (matrix) {
    transformationMatrix = matrix;
  };

  OT.prototype.createMessage = function (action, value) {
    var json = {
      action: action,
      states: states,
      priority: priority,
      value: value
    };
    return JSON.stringify(json);
  };

  OT.prototype.onModelChange = function (action, callback) {
    if (typeof callback !== "function") {
      throw "Callback has to be a function";
    }
    if (!onModelChangeEvents[action]) {
      onModelChangeEvents[action] = [];
    }
    onModelChangeEvents[action].push(callback);
  };

  var execute = function execute(request) {
    var action = executeActions[request.action];
    if (action) {
      action(request);
    }
    var onModelChangeCallback = onModelChangeEvents[request.action];
    if (onModelChangeCallback) {
      onModelChangeCallback.forEach(function (callback) {
        callback(request);
      });
    }
    states[request.priority] += 1;
    log.push(request);
  };

  OT.prototype.execute = execute;

  OT.prototype.markAsNoOp = function (request) {
    request.originalAction = request.action;
    request.action = "no-op";
    return request;
  };

  var compareState = function compareState(requestState, currentState) {
    var shouldTransform = false;
    for (var i = 0; i < currentState.length; i += 1) {
      if (currentState[i] === requestState[i]) {
        continue;
      }
      if (currentState[i] > requestState[i]) {
        shouldTransform = true;
      } else {
        return 1;
      }
    }
    return shouldTransform ? -1 : 0;
  };

  var transform = function transform(newRequest, oldRequest) {
    if (newRequest && transformationMatrix[newRequest.action] && transformationMatrix[newRequest.action][oldRequest.action]) {
      return transformationMatrix[newRequest.action][oldRequest.action](newRequest, oldRequest);
    }
    return newRequest;
  };

  OT.prototype.processRequest = function (r) {
    var request = JSON.parse(r);
    switch (request.action) {
      case "init":
        data = request.value.data;
        priority = request.value.priority;
        states = request.value.states;
        if (typeof options.onInit === "function") {
          options.onInit(data);
        }
        break;
      case "new-user":
        states[request.value] = 0;
        if (typeof options.onNewUser === "function") {
          options.onNewUser(request);
        }
        break;
      case "user-change-position":
        usersPosition[request.priority] = request.value;
        if (typeof options.onUserPositionChange === "function") {
          options.onUserPositionChange(request);
        }
        break;
      case "no-op":
        execute(request);
        break;
      default:
        if (priority !== request.priority) {
          switch (compareState(request.states, states)) {
            case 0:
              // we can execute this action right away
              execute(request);
              break;
            case 1:
              // this action has to be put into que, and wait for other actions
              // but since we use web socket, this shouldn't happen anyway
              // que.push(request);
              // TODO: when to fire que?
              break;
            case -1:
              // create transformation for this action
              for (var i = log.length - 1; i >= 0; i -= 1) {
                // find all logs that happened after this request was craeted
                var compareStateStatus = compareState(log[i].states, request.states);
                if (compareStateStatus === -1) {
                  break;
                }
              }
              var transformedRequest = request;
              for (var j = i + 1; j < log.length; j += 1) {
                transformedRequest = transform(transformedRequest, log[j]);
              }
              execute(transformedRequest);
          }
        }
    }
    console.log(request.action, data, states, log);
  };

  return OT;
})();

module.exports = OT;

},{}],"/home/dugokontov/projects/operation-transformation/app/ot/tableChange.js":[function(require,module,exports){
"use strict";
var tableChangeRules = (function () {
  var ot;

  var executeActions = {
    updateCell: function updateCell(request) {
      var value = request.value;
      var data = ot.getData();
      data[value.rowIndex][value.columnIndex] = request.value.value;
    },
    addRow: function addRow(request) {
      var value = request.value;
      var data = ot.getData();
      var someRow = data[0] || [];
      var row = someRow.map(function () {
        return "";
      });

      data.splice(value.rowIndex, 0, row);
    },
    deleteRow: function deleteRow(request) {
      var value = request.value;
      var data = ot.getData();
      data.splice(value.rowIndex, 1);
    }
  };

  var transformationMatrix = {
    updateCell: {
      updateCell: function updateCell(newRequest, oldRequest) {
        if (newRequest.value.rowIndex !== oldRequest.value.rowIndex || newRequest.value.columnIndex !== oldRequest.value.columnIndex) {
          return newRequest;
        }
        if (newRequest.priority < oldRequest.priority) {
          return newRequest;
        }
        var value = JSON.parse(JSON.stringify(oldRequest.value));
        newRequest.value = value;
        return newRequest;
      },
      addRow: function addRow(newRequest, oldRequest) {
        if (newRequest.value.rowIndex < oldRequest.value.rowIndex) {
          return newRequest;
        }
        newRequest.value.rowIndex += 1;
        return newRequest;
      },
      deleteRow: function deleteRow(newRequest, oldRequest) {
        if (newRequest.value.rowIndex < oldRequest.value.rowIndex) {
          return newRequest;
        }
        if (+newRequest.value.rowIndex === +oldRequest.value.rowIndex) {
          return ot.markAsNoOp(newRequest);
        }
        newRequest.value.rowIndex -= 1;
        return newRequest;
      }
    },
    addRow: {
      // no need for transformation
      // updateCell: function (newRequest, oldRequest) {}
      addRow: function addRow(newRequest, oldRequest) {
        if (newRequest.value.rowIndex !== oldRequest.value.rowIndex) {
          return newRequest;
        }
        return ot.markAsNoOp(newRequest);
      },
      deleteRow: function deleteRow(newRequest, oldRequest) {
        if (newRequest.value.rowIndex < oldRequest.value.rowIndex) {
          return newRequest;
        }
        newRequest.value.rowIndex -= 1;
        return newRequest;
      }
    },
    deleteRow: {
      // no need for transformation
      // updateCell: function (newRequest, oldRequest) {}
      addRow: function addRow(newRequest, oldRequest) {
        if (newRequest.value.rowIndex < oldRequest.value.rowIndex) {
          return newRequest;
        }
        newRequest.value.rowIndex += 1;
        return newRequest;
      },
      deleteRow: function deleteRow(newRequest, oldRequest) {
        if (newRequest.value.rowIndex !== oldRequest.value.rowIndex) {
          return newRequest;
        }
        return ot.markAsNoOp(newRequest);
      }
    }
  };

  return function (opearionTransformation) {
    ot = opearionTransformation;
    ot.setExecuteActions(executeActions);
    ot.setTransformationMatrix(transformationMatrix);
  };
})();

module.exports = tableChangeRules;

},{}],"/home/dugokontov/projects/operation-transformation/app/stores/TableStore.js":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var TableActions = require("../actions/TableActions");
var OT = require("../ot/ot.js");
var tableChangeRules = require("../ot/tableChange.js");
var socket, ot;

var TableStore = (function (_GLU$Store) {
  function TableStore() {
    _classCallCheck(this, TableStore);

    _get(Object.getPrototypeOf(TableStore.prototype), "constructor", this).call(this);

    this.init();

    this.bindActions(TableActions.UPDATE_CELL, this.updateCell, [], TableActions.ADD_ROW, this.updateRow, [], TableActions.DELETE_ROW, this.deleteRow, [], TableActions.USER_CHANGE_POSITION, this.userChangePosition, []);
  }

  _inherits(TableStore, _GLU$Store);

  _createClass(TableStore, {
    init: {
      value: function init() {
        socket = new WebSocket("ws://" + window.location.hostname + ":8080", "protocolOne");
        var self = this;
        var emitChange = function emitChange() {
          self.emitChange();
        };

        ot = new OT({
          onInit: emitChange,
          onUserPositionChange: emitChange
        });
        tableChangeRules(ot);

        ot.onModelChange(TableActions.UPDATE_CELL, emitChange);
        ot.onModelChange(TableActions.ADD_ROW, emitChange);
        ot.onModelChange(TableActions.DELETE_ROW, emitChange);

        socket.onmessage = function (event) {
          ot.processRequest(event.data);
        };
      }
    },
    data: {
      get: function () {
        return ot.getData();
      }
    },
    usersPosition: {
      get: function () {
        return ot.getUsersPostion();
      }
    },
    triggerRequest: {
      value: function triggerRequest(action, payload, shouldSkip) {
        var message = ot.createMessage(action, payload);
        var request = JSON.parse(message);
        if (!shouldSkip) {
          ot.execute(request);
        }
        socket.send(message);
        if (action === TableActions.UPDATE_CELL) {
          console.log(new Date().getTime(), payload);
        }
        this.emitChange();
      }
    },
    updateCell: {
      value: function updateCell(payload) {
        this.triggerRequest(TableActions.UPDATE_CELL, payload);
      }
    },
    updateRow: {
      value: function updateRow(payload) {
        this.triggerRequest(TableActions.ADD_ROW, payload);
      }
    },
    deleteRow: {
      value: function deleteRow(payload) {
        this.triggerRequest(TableActions.DELETE_ROW, payload);
      }
    },
    userChangePosition: {
      value: function userChangePosition(payload) {
        this.triggerRequest(TableActions.USER_CHANGE_POSITION, payload, true);
      }
    }
  });

  return TableStore;
})(GLU.Store);

module.exports = new TableStore();

},{"../actions/TableActions":"/home/dugokontov/projects/operation-transformation/app/actions/TableActions.js","../ot/ot.js":"/home/dugokontov/projects/operation-transformation/app/ot/ot.js","../ot/tableChange.js":"/home/dugokontov/projects/operation-transformation/app/ot/tableChange.js"}]},{},["/home/dugokontov/projects/operation-transformation/app/app.js"])("/home/dugokontov/projects/operation-transformation/app/app.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9hcHAvYWN0aW9ucy9UYWJsZUFjdGlvbkNyZWF0b3IuanMiLCIuLi9hcHAvYWN0aW9ucy9UYWJsZUFjdGlvbnMuanMiLCIuLi9hcHAvYXBwLmpzIiwiLi4vYXBwL2NvbXBvbmVudHMvZ3JpZC9DZWxsVmlld1JlYWN0LmpzIiwiLi4vYXBwL2NvbXBvbmVudHMvZ3JpZC9HcmlkQ29udHJvbGxlci5qcyIsIi4uL2FwcC9jb21wb25lbnRzL2dyaWQvR3JpZFZpZXcuanMiLCIuLi9hcHAvY29tcG9uZW50cy9ncmlkL0dyaWRWaWV3UmVhY3QuanMiLCIuLi9hcHAvY29tcG9uZW50cy9ncmlkL1Jvd1ZpZXdSZWFjdC5qcyIsIi4uL2FwcC9jb21wb25lbnRzL2dyaWRBY3Rpb25zL0dyaWRBY3Rpb25zQ29udHJvbGxlci5qcyIsIi4uL2FwcC9jb21wb25lbnRzL2dyaWRBY3Rpb25zL0dyaWRBY3Rpb25zVmlldy5qcyIsIi4uL2FwcC9jb21wb25lbnRzL2dyaWRBY3Rpb25zL0dyaWRBY3Rpb25zVmlld1JlYWN0LmpzIiwiLi4vYXBwL290L290LmpzIiwiLi4vYXBwL290L3RhYmxlQ2hhbmdlLmpzIiwiLi4vYXBwL3N0b3Jlcy9UYWJsZVN0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOzs7Ozs7QUFFYixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7SUFFdkMsa0JBQWtCO1dBQWxCLGtCQUFrQjswQkFBbEIsa0JBQWtCOzs7ZUFBbEIsa0JBQWtCO0FBQ2YsY0FBVTthQUFBLG9CQUFDLE9BQU8sRUFBRTtBQUN6QixXQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQ3ZEOztBQUNNLFVBQU07YUFBQSxn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VSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVGFibGVBY3Rpb25zID0gcmVxdWlyZSgnLi9UYWJsZUFjdGlvbnMnKTtcblxuY2xhc3MgVGFibGVBY3Rpb25DcmVhdG9yIHtcbiAgc3RhdGljIHVwZGF0ZUNlbGwocGF5bG9hZCkge1xuICAgIEdMVS5idXMuZW1pdEFjdGlvbihUYWJsZUFjdGlvbnMuVVBEQVRFX0NFTEwsIHBheWxvYWQpO1xuICB9XG4gIHN0YXRpYyBhZGRSb3cocGF5bG9hZCkge1xuICAgIEdMVS5idXMuZW1pdEFjdGlvbihUYWJsZUFjdGlvbnMuQUREX1JPVywgcGF5bG9hZCk7XG4gIH1cbiAgc3RhdGljIGRlbGV0ZVJvdyhwYXlsb2FkKSB7XG4gICAgR0xVLmJ1cy5lbWl0QWN0aW9uKFRhYmxlQWN0aW9ucy5ERUxFVEVfUk9XLCBwYXlsb2FkKTtcbiAgfVxuICBzdGF0aWMgdXNlckNoYW5nZVBvc2l0aW9uKHBheWxvYWQpIHtcbiAgICBHTFUuYnVzLmVtaXRBY3Rpb24oVGFibGVBY3Rpb25zLlVTRVJfQ0hBTkdFX1BPU0lUSU9OLCBwYXlsb2FkKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlQWN0aW9uQ3JlYXRvcjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBUYWJsZUFjdGlvbnMgPSB7XG4gIFVQREFURV9DRUxMOiAndXBkYXRlQ2VsbCcsXG4gIEFERF9ST1c6ICdhZGRSb3cnLFxuICBERUxFVEVfUk9XOiAnZGVsZXRlUm93JyxcbiAgVVNFUl9DSEFOR0VfUE9TSVRJT046ICd1c2VyLWNoYW5nZS1wb3NpdGlvbidcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVBY3Rpb25zOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIEdyaWRWaWV3ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dyaWQvR3JpZFZpZXcnKTtcbnZhciBHcmlkQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9ncmlkL0dyaWRDb250cm9sbGVyJyk7XG5cbnZhciBHcmlkQWN0aW9uc1ZpZXcgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZ3JpZEFjdGlvbnMvR3JpZEFjdGlvbnNWaWV3Jyk7XG52YXIgR3JpZEFjdGlvbnNDb250cm9sbGVyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2dyaWRBY3Rpb25zL0dyaWRBY3Rpb25zQ29udHJvbGxlcicpO1xuXG52YXIgQXBwID0ge1xuICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdyaWRWaWV3ID0gbmV3IEdyaWRWaWV3KGRvY3VtZW50LmJvZHksICcjZ3JpZCcpO1xuICAgIG5ldyBHcmlkQ29udHJvbGxlcihncmlkVmlldyk7XG5cbiAgICB2YXIgYWN0aW9uVmlldyA9IG5ldyBHcmlkQWN0aW9uc1ZpZXcoZG9jdW1lbnQuYm9keSwgJyNhY3Rpb25zJyk7XG4gICAgbmV3IEdyaWRBY3Rpb25zQ29udHJvbGxlcihhY3Rpb25WaWV3KTtcblxuICAgIGdyaWRWaWV3LnJlbmRlcigpO1xuICAgIGFjdGlvblZpZXcucmVuZGVyKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXBwOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIENlbGxWaWV3UmVhY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG9uQmx1cihlKTogYW55IHtcbiAgICB0aGlzLnByb3BzLnVwZGF0ZUNlbGwodGhpcy5wcm9wcy5yb3dJbmRleCwgdGhpcy5wcm9wcy5jb2x1bW5JbmRleCwgZS50YXJnZXQudmFsdWUsICdjaGFuZ2UnKTtcbiAgfSxcbiAgb25DaGFuZ2UoZSk6YW55IHtcbiAgICB0aGlzLnByb3BzLnVwZGF0ZUNlbGwodGhpcy5wcm9wcy5yb3dJbmRleCwgdGhpcy5wcm9wcy5jb2x1bW5JbmRleCwgZS50YXJnZXQudmFsdWUpO1xuICB9LFxuICBvbkZvY3VzKGUpOmFueSB7XG4gICAgdGhpcy5wcm9wcy51cGRhdGVDZWxsKHRoaXMucHJvcHMucm93SW5kZXgsIHRoaXMucHJvcHMuY29sdW1uSW5kZXgsIGUudGFyZ2V0LnZhbHVlLCAnZm9jdXMnKTtcbiAgfSxcbiAgcmVuZGVyKCk6IGFueSB7XG4gICAgdmFyIHVwID0gdGhpcy5wcm9wcy51c2Vyc1Bvc2l0aW9uO1xuICAgIHZhciBhY3RpdmVVc2Vyc0hlcmUgPSBPYmplY3RcbiAgICAgIC5rZXlzKHVwKVxuICAgICAgLmZpbHRlcih1c2VySWQgPT4gdXBbdXNlcklkXS5yb3dJbmRleCA9PT0gdGhpcy5wcm9wcy5yb3dJbmRleCAmJiB1cFt1c2VySWRdLmNvbHVtbkluZGV4ID09PSB0aGlzLnByb3BzLmNvbHVtbkluZGV4KVxuICAgICAgLm1hcCh1c2VySWQgPT4gPGRpdiBjbGFzc05hbWU9eyd1c2VyLScgKyB1c2VySWR9PjwvZGl2PilcbiAgICByZXR1cm4gPHRkPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWV9XG4gICAgICAgIHJlZj1cInZhbHVlXCJcbiAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgIG9uRm9jdXM9e3RoaXMub25Gb2N1c31cbiAgICAgICAgb25CbHVyPXt0aGlzLm9uQmx1cn0vPlxuICAgICAge2FjdGl2ZVVzZXJzSGVyZX1cbiAgICA8L3RkPjtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2VsbFZpZXdSZWFjdDsiLCIndXNlIHN0cmljdCc7XG52YXIgVGFibGVBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9UYWJsZUFjdGlvbnMuanMnKTtcbnZhciBUYWJsZUFjdGlvbkNyZWF0b3IgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL1RhYmxlQWN0aW9uQ3JlYXRvci5qcycpO1xudmFyIFRhYmxlU3RvcmUgPSByZXF1aXJlKCcuLi8uLi9zdG9yZXMvVGFibGVTdG9yZS5qcycpO1xuXG5jbGFzcyBHcmlkQ29udHJvbGxlciBleHRlbmRzIEdMVS5WaWV3Q29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKHZpZXcpIHtcbiAgICBzdXBlcih2aWV3KTtcblxuICAgIFRhYmxlU3RvcmUub25DaGFuZ2UodGhpcy5vblN0b3JlQ2hhbmdlLCB0aGlzKTtcblxuICAgIHRoaXMudmlldy5vbihUYWJsZUFjdGlvbnMuVVBEQVRFX0NFTEwsIHRoaXMub25DZWxsVXBkYXRlKTtcbiAgICB0aGlzLnZpZXcub24oVGFibGVBY3Rpb25zLlVTRVJfQ0hBTkdFX1BPU0lUSU9OLCB0aGlzLnVzZXJDaGFuZ2VQb3NpdGlvbik7XG4gIH1cblxuICBvblN0b3JlQ2hhbmdlKCkge1xuICAgIHRoaXMudmlldy51cGRhdGVTdGF0ZShUYWJsZVN0b3JlLmRhdGEsIFRhYmxlU3RvcmUudXNlcnNQb3NpdGlvbik7XG4gIH1cblxuICBvbkNlbGxVcGRhdGUocGF5bG9hZCkge1xuICAgIFRhYmxlQWN0aW9uQ3JlYXRvci51cGRhdGVDZWxsKHBheWxvYWQpO1xuICB9XG5cbiAgdXNlckNoYW5nZVBvc2l0aW9uKHBheWxvYWQpIHtcbiAgICBUYWJsZUFjdGlvbkNyZWF0b3IudXNlckNoYW5nZVBvc2l0aW9uKHBheWxvYWQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR3JpZENvbnRyb2xsZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGF0YSwgdXNlcnNQb3NpdGlvbiwgdmlldztcbnZhciBHcmlkVmlld1JlYWN0ID0gcmVxdWlyZSgnLi9HcmlkVmlld1JlYWN0LmpzJyk7XG5cbmNsYXNzIEdyaWRWaWV3IGV4dGVuZHMgR0xVLlZpZXcge1xuICBjb25zdHJ1Y3Rvcihyb290LCBzZWxlY3Rvcikge1xuICAgIHN1cGVyKHJvb3QsIHNlbGVjdG9yKTtcblxuICAgIGRhdGEgPSBbXTtcbiAgICB1c2Vyc1Bvc2l0aW9uID0ge307XG4gICAgdmlldyA9IHRoaXM7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgUmVhY3QucmVuZGVyKDxHcmlkVmlld1JlYWN0XG4gICAgICBkYXRhPXtkYXRhfVxuICAgICAgdXNlcnNQb3NpdGlvbj17dXNlcnNQb3NpdGlvbn1cbiAgICAgIHZpZXc9e3ZpZXd9Lz4sXG4gICAgICB0aGlzLmVsKTtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKGQsIHVwKSB7XG4gICAgZGF0YSA9IGQ7XG4gICAgdXNlcnNQb3NpdGlvbiA9IHVwXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGdldCBkYXRhKCkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgc2V0IGRhdGEoZCkge1xuICAgIGRhdGEgPSBkO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBnZXQgdXNlcnNQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdXNlcnNQb3NpdGlvbjtcbiAgfVxuXG4gIHNldCB1c2Vyc1Bvc2l0aW9uKHVwKSB7XG4gICAgdXNlcnNQb3NpdGlvbiA9IHVwO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHcmlkVmlldzsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBSb3dWaWV3UmVhY3QgPSByZXF1aXJlKCcuL1Jvd1ZpZXdSZWFjdC5qcycpO1xudmFyIFRhYmxlQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvVGFibGVBY3Rpb25zLmpzJyk7XG5cbnZhciBHcmlkVmlld1JlYWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGUoKTogYW55IHtcbiAgICByZXR1cm4ge2RhdGE6IHRoaXMucHJvcHMuZGF0YX07XG4gIH0sXG4gIHVwZGF0ZUNlbGwocm93SW5kZXgsIGNvbHVtbkluZGV4LCB2YWx1ZSwgYWN0aW9uKTogYW55IHtcbiAgICBpZiAoYWN0aW9uID09PSAnZm9jdXMnKSB7XG4gICAgICB0aGlzLnByb3BzLnZpZXcuZW1pdChUYWJsZUFjdGlvbnMuVVNFUl9DSEFOR0VfUE9TSVRJT04sIHtcbiAgICAgICAgcm93SW5kZXg6IHJvd0luZGV4LFxuICAgICAgICBjb2x1bW5JbmRleDogY29sdW1uSW5kZXhcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLmRhdGFbcm93SW5kZXhdW2NvbHVtbkluZGV4XSA9IHZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IHRoaXMucHJvcHMuZGF0YX0pO1xuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgIHRoaXMucHJvcHMudmlldy5lbWl0KFRhYmxlQWN0aW9ucy5VUERBVEVfQ0VMTCwge1xuICAgICAgICByb3dJbmRleDogcm93SW5kZXgsXG4gICAgICAgIGNvbHVtbkluZGV4OiBjb2x1bW5JbmRleCxcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcigpOiBhbnkge1xuICAgIHZhciBoZWFkZXJzID0gW107XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBpZiAodGhpcy5wcm9wcy5kYXRhWzBdKSB7XG4gICAgICBoZWFkZXJzID0gdGhpcy5wcm9wcy5kYXRhWzBdLm1hcCgobmFtZSwgaW5kZXgpID0+IDx0aD5Db2wge2luZGV4ICsgMX08L3RoPik7XG4gICAgICByb3dzID0gdGhpcy5wcm9wcy5kYXRhLm1hcCgocm93LCBpbmRleCkgPT4gPFJvd1ZpZXdSZWFjdFxuICAgICAgICByb3c9e3Jvd31cbiAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgcm93SW5kZXg9e2luZGV4fVxuICAgICAgICB1c2Vyc1Bvc2l0aW9uPXt0aGlzLnByb3BzLnVzZXJzUG9zaXRpb259XG4gICAgICAgIHVwZGF0ZUNlbGw9e3RoaXMudXBkYXRlQ2VsbH0vPik7XG4gICAgfVxuICAgIHJldHVybiA8dGFibGU+XG4gICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj57aGVhZGVyc308L3RyPlxuICAgICAgPC90aGVhZD5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+O1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmlkVmlld1JlYWN0OyIsIid1c2Ugc3RyaWN0JztcbnZhciBDZWxsVmlld1JlYWN0ID0gcmVxdWlyZSgnLi9DZWxsVmlld1JlYWN0LmpzJyk7XG5cbnZhciBSb3dWaWV3UmVhY3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpOiBhbnkge1xuICAgIHZhciBjZWxscyA9IFtdO1xuICAgIGlmICh0aGlzLnByb3BzLnJvdy5sZW5ndGgpIHtcbiAgICAgIGNlbGxzID0gdGhpcy5wcm9wcy5yb3cubWFwKChjZWxsLCBpbmRleCkgPT4gPENlbGxWaWV3UmVhY3RcbiAgICAgICAgdmFsdWU9e2NlbGx9XG4gICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgIGNvbHVtbkluZGV4PXtpbmRleH1cbiAgICAgICAgcm93SW5kZXg9e3RoaXMucHJvcHMucm93SW5kZXh9XG4gICAgICAgIHVzZXJzUG9zaXRpb249e3RoaXMucHJvcHMudXNlcnNQb3NpdGlvbn1cbiAgICAgICAgdXBkYXRlQ2VsbD17dGhpcy5wcm9wcy51cGRhdGVDZWxsfS8+KTtcbiAgICB9XG4gICAgcmV0dXJuIDx0cj57Y2VsbHN9PC90cj47XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvd1ZpZXdSZWFjdDsiLCIndXNlIHN0cmljdCc7XG52YXIgVGFibGVBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vYWN0aW9ucy9UYWJsZUFjdGlvbnMuanMnKTtcbnZhciBUYWJsZUFjdGlvbkNyZWF0b3IgPSByZXF1aXJlKCcuLi8uLi9hY3Rpb25zL1RhYmxlQWN0aW9uQ3JlYXRvci5qcycpO1xuXG5jbGFzcyBHcmlkQWN0aW9uc0NvbnRyb2xsZXIgZXh0ZW5kcyBHTFUuVmlld0NvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3Rvcih2aWV3KSB7XG4gICAgc3VwZXIodmlldyk7XG5cbiAgICB0aGlzLnZpZXcub24oVGFibGVBY3Rpb25zLkFERF9ST1csIHRoaXMuYWRkUm93KTtcbiAgICB0aGlzLnZpZXcub24oVGFibGVBY3Rpb25zLkRFTEVURV9ST1csIHRoaXMuZGVsZXRlUm93KTtcbiAgfVxuXG4gIGFkZFJvdyhwYXlsb2FkKSB7XG4gICAgVGFibGVBY3Rpb25DcmVhdG9yLmFkZFJvdyhwYXlsb2FkKTtcbiAgfVxuXG4gIGRlbGV0ZVJvdyhwYXlsb2FkKSB7XG4gICAgVGFibGVBY3Rpb25DcmVhdG9yLmRlbGV0ZVJvdyhwYXlsb2FkKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyaWRBY3Rpb25zQ29udHJvbGxlcjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB2aWV3O1xudmFyIEdyaWRBY3Rpb25zVmlld1JlYWN0ID0gcmVxdWlyZSgnLi9HcmlkQWN0aW9uc1ZpZXdSZWFjdC5qcycpO1xuXG5jbGFzcyBHcmlkVmlldyBleHRlbmRzIEdMVS5WaWV3IHtcbiAgY29uc3RydWN0b3Iocm9vdCwgc2VsZWN0b3IpIHtcbiAgICBzdXBlcihyb290LCBzZWxlY3Rvcik7XG4gICAgdmlldyA9IHRoaXM7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgUmVhY3QucmVuZGVyKDxHcmlkQWN0aW9uc1ZpZXdSZWFjdCB2aWV3PXt2aWV3fSAvPixcbiAgICAgIHRoaXMuZWwpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR3JpZFZpZXc7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIFRhYmxlQWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uL2FjdGlvbnMvVGFibGVBY3Rpb25zLmpzJyk7XG5cbnZhciBHcmlkVmlld1JlYWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBhZGRSb3coKTogYW55IHtcbiAgICB0aGlzLnByb3BzLnZpZXcuZW1pdChUYWJsZUFjdGlvbnMuQUREX1JPVywge1xuICAgICAgcm93SW5kZXg6ICtSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMucm93UG9zaXRpb24pLnZhbHVlLnRyaW0oKVxuICAgIH0pO1xuICB9LFxuICBkZWxldGVSb3coKTogYW55IHtcbiAgICB0aGlzLnByb3BzLnZpZXcuZW1pdChUYWJsZUFjdGlvbnMuREVMRVRFX1JPVywge1xuICAgICAgcm93SW5kZXg6ICtSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMucm93UG9zaXRpb24pLnZhbHVlLnRyaW0oKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXIoKTogYW55IHtcbiAgICByZXR1cm4gPGRpdj5cbiAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5hZGRSb3d9PkFkZCBuZXcgcm93PC9idXR0b24+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuZGVsZXRlUm93fT5SZW1vdmUgcm93PC9idXR0b24+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkZWZhdWx0VmFsdWU9XCIxXCIgcmVmPVwicm93UG9zaXRpb25cIiAvPlxuICAgIDwvZGl2PjtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR3JpZFZpZXdSZWFjdDsiLCIvKmpzaGludCBkZXZlbDp0cnVlKi9cbi8qZ2xvYmFsIE9UOnRydWUqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIE9UID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaW9yaXR5LCBkYXRhO1xuICB2YXIgc3RhdGVzID0gW107XG4gIHZhciBsb2cgPSBbXTtcbiAgdmFyIGV4ZWN1dGVBY3Rpb25zID0ge307XG4gIHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHt9O1xuICB2YXIgb3B0aW9ucztcbiAgdmFyIG9uTW9kZWxDaGFuZ2VFdmVudHMgPSB7fTtcbiAgdmFyIHVzZXJzUG9zaXRpb24gPSB7fTtcblxuICB2YXIgT1QgPSBmdW5jdGlvbiAobykge1xuICAgIG9wdGlvbnMgPSBvIHx8IHt9O1xuICB9O1xuXG4gIE9ULnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24gKGQpIHtcbiAgICBkYXRhID0gZDtcbiAgfTtcblxuICBPVC5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBPVC5wcm90b3R5cGUuc2V0U3RhdGVzID0gZnVuY3Rpb24gKHMpIHtcbiAgICBzdGF0ZXMgPSBzO1xuICB9O1xuXG4gIE9ULnByb3RvdHlwZS5nZXRQcmlvcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcHJpb3JpdHk7XG4gIH07XG5cblxuICBPVC5wcm90b3R5cGUuZ2V0VXNlcnNQb3N0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1c2Vyc1Bvc2l0aW9uO1xuICB9O1xuXG4gIE9ULnByb3RvdHlwZS5zZXRFeGVjdXRlQWN0aW9ucyA9IGZ1bmN0aW9uIChhY3Rpb25zKSB7XG4gICAgZXhlY3V0ZUFjdGlvbnMgPSBhY3Rpb25zO1xuICB9O1xuXG4gIE9ULnByb3RvdHlwZS5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcbiAgICB0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG1hdHJpeDtcbiAgfTtcblxuICBPVC5wcm90b3R5cGUuY3JlYXRlTWVzc2FnZSA9IGZ1bmN0aW9uIChhY3Rpb24sIHZhbHVlKSB7XG4gICAgdmFyIGpzb24gPSB7XG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIHN0YXRlczogc3RhdGVzLFxuICAgICAgcHJpb3JpdHk6IHByaW9yaXR5LFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoanNvbik7XG4gIH07XG5cbiAgT1QucHJvdG90eXBlLm9uTW9kZWxDaGFuZ2UgPSBmdW5jdGlvbiAoYWN0aW9uLCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93ICdDYWxsYmFjayBoYXMgdG8gYmUgYSBmdW5jdGlvbic7XG4gICAgfVxuICAgIGlmICghb25Nb2RlbENoYW5nZUV2ZW50c1thY3Rpb25dKSB7XG4gICAgICBvbk1vZGVsQ2hhbmdlRXZlbnRzW2FjdGlvbl0gPSBbXTtcbiAgICB9XG4gICAgb25Nb2RlbENoYW5nZUV2ZW50c1thY3Rpb25dLnB1c2goY2FsbGJhY2spO1xuICB9O1xuXG4gIHZhciBleGVjdXRlID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICB2YXIgYWN0aW9uID0gZXhlY3V0ZUFjdGlvbnNbcmVxdWVzdC5hY3Rpb25dO1xuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgIGFjdGlvbihyZXF1ZXN0KTtcbiAgICB9XG4gICAgdmFyIG9uTW9kZWxDaGFuZ2VDYWxsYmFjayA9IG9uTW9kZWxDaGFuZ2VFdmVudHNbcmVxdWVzdC5hY3Rpb25dO1xuICAgIGlmIChvbk1vZGVsQ2hhbmdlQ2FsbGJhY2spIHtcbiAgICAgIG9uTW9kZWxDaGFuZ2VDYWxsYmFjay5mb3JFYWNoKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhyZXF1ZXN0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBzdGF0ZXNbcmVxdWVzdC5wcmlvcml0eV0gKz0gMTtcbiAgICBsb2cucHVzaChyZXF1ZXN0KTtcbiAgfTtcblxuICBPVC5wcm90b3R5cGUuZXhlY3V0ZSA9IGV4ZWN1dGU7XG5cbiAgT1QucHJvdG90eXBlLm1hcmtBc05vT3AgPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgIHJlcXVlc3Qub3JpZ2luYWxBY3Rpb24gPSByZXF1ZXN0LmFjdGlvbjtcbiAgICByZXF1ZXN0LmFjdGlvbiA9ICduby1vcCc7XG4gICAgcmV0dXJuIHJlcXVlc3Q7XG4gIH07XG5cbiAgdmFyIGNvbXBhcmVTdGF0ZSA9IGZ1bmN0aW9uIChyZXF1ZXN0U3RhdGUsIGN1cnJlbnRTdGF0ZSkge1xuICAgIHZhciBzaG91bGRUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRTdGF0ZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGN1cnJlbnRTdGF0ZVtpXSA9PT0gcmVxdWVzdFN0YXRlW2ldKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnRTdGF0ZVtpXSA+IHJlcXVlc3RTdGF0ZVtpXSkge1xuICAgICAgICBzaG91bGRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoc2hvdWxkVHJhbnNmb3JtKSA/IC0xIDogMDtcbiAgfTtcblxuICB2YXIgdHJhbnNmb3JtID0gZnVuY3Rpb24gKG5ld1JlcXVlc3QsIG9sZFJlcXVlc3QpIHtcbiAgICBpZiAobmV3UmVxdWVzdCAmJiB0cmFuc2Zvcm1hdGlvbk1hdHJpeFtuZXdSZXF1ZXN0LmFjdGlvbl0gJiYgdHJhbnNmb3JtYXRpb25NYXRyaXhbbmV3UmVxdWVzdC5hY3Rpb25dW29sZFJlcXVlc3QuYWN0aW9uXSkge1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybWF0aW9uTWF0cml4W25ld1JlcXVlc3QuYWN0aW9uXVtvbGRSZXF1ZXN0LmFjdGlvbl0obmV3UmVxdWVzdCwgb2xkUmVxdWVzdCk7XG4gICAgfVxuICAgIHJldHVybiBuZXdSZXF1ZXN0O1xuICB9O1xuXG4gIE9ULnByb3RvdHlwZS5wcm9jZXNzUmVxdWVzdCA9IGZ1bmN0aW9uIChyKSB7XG4gICAgdmFyIHJlcXVlc3QgPSBKU09OLnBhcnNlKHIpO1xuICAgIHN3aXRjaCAocmVxdWVzdC5hY3Rpb24pIHtcbiAgICBjYXNlICdpbml0JzpcbiAgICAgIGRhdGEgPSByZXF1ZXN0LnZhbHVlLmRhdGE7XG4gICAgICBwcmlvcml0eSA9IHJlcXVlc3QudmFsdWUucHJpb3JpdHk7XG4gICAgICBzdGF0ZXMgPSByZXF1ZXN0LnZhbHVlLnN0YXRlcztcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vbkluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3B0aW9ucy5vbkluaXQoZGF0YSk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICduZXctdXNlcic6XG4gICAgICBzdGF0ZXNbcmVxdWVzdC52YWx1ZV0gPSAwO1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uTmV3VXNlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvcHRpb25zLm9uTmV3VXNlcihyZXF1ZXN0KTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VzZXItY2hhbmdlLXBvc2l0aW9uJzpcbiAgICAgIHVzZXJzUG9zaXRpb25bcmVxdWVzdC5wcmlvcml0eV0gPSByZXF1ZXN0LnZhbHVlO1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uVXNlclBvc2l0aW9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG9wdGlvbnMub25Vc2VyUG9zaXRpb25DaGFuZ2UocmVxdWVzdCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICduby1vcCc6XG4gICAgICBleGVjdXRlKHJlcXVlc3QpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmIChwcmlvcml0eSAhPT0gcmVxdWVzdC5wcmlvcml0eSkge1xuICAgICAgICBzd2l0Y2ggKGNvbXBhcmVTdGF0ZShyZXF1ZXN0LnN0YXRlcywgc3RhdGVzKSkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgLy8gd2UgY2FuIGV4ZWN1dGUgdGhpcyBhY3Rpb24gcmlnaHQgYXdheVxuICAgICAgICAgIGV4ZWN1dGUocmVxdWVzdCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAvLyB0aGlzIGFjdGlvbiBoYXMgdG8gYmUgcHV0IGludG8gcXVlLCBhbmQgd2FpdCBmb3Igb3RoZXIgYWN0aW9uc1xuICAgICAgICAgIC8vIGJ1dCBzaW5jZSB3ZSB1c2Ugd2ViIHNvY2tldCwgdGhpcyBzaG91bGRuJ3QgaGFwcGVuIGFueXdheVxuICAgICAgICAgIC8vIHF1ZS5wdXNoKHJlcXVlc3QpO1xuICAgICAgICAgIC8vIFRPRE86IHdoZW4gdG8gZmlyZSBxdWU/XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgLTE6XG4gICAgICAgICAgLy8gY3JlYXRlIHRyYW5zZm9ybWF0aW9uIGZvciB0aGlzIGFjdGlvblxuICAgICAgICAgIGZvciAodmFyIGkgPSBsb2cubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgICAgICAgIC8vIGZpbmQgYWxsIGxvZ3MgdGhhdCBoYXBwZW5lZCBhZnRlciB0aGlzIHJlcXVlc3Qgd2FzIGNyYWV0ZWRcbiAgICAgICAgICAgIHZhciBjb21wYXJlU3RhdGVTdGF0dXMgPSBjb21wYXJlU3RhdGUobG9nW2ldLnN0YXRlcywgcmVxdWVzdC5zdGF0ZXMpO1xuICAgICAgICAgICAgaWYgKGNvbXBhcmVTdGF0ZVN0YXR1cyA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0cmFuc2Zvcm1lZFJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8IGxvZy5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtZWRSZXF1ZXN0ID0gdHJhbnNmb3JtKHRyYW5zZm9ybWVkUmVxdWVzdCwgbG9nW2pdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhlY3V0ZSh0cmFuc2Zvcm1lZFJlcXVlc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHJlcXVlc3QuYWN0aW9uLCBkYXRhLCBzdGF0ZXMsIGxvZyk7XG4gIH07XG5cbiAgcmV0dXJuIE9UO1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPVDsiLCIndXNlIHN0cmljdCc7XG52YXIgdGFibGVDaGFuZ2VSdWxlcyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBvdDtcblxuICB2YXIgZXhlY3V0ZUFjdGlvbnMgPSB7XG4gICAgdXBkYXRlQ2VsbDogZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHJlcXVlc3QudmFsdWU7XG4gICAgICB2YXIgZGF0YSA9IG90LmdldERhdGEoKTtcbiAgICAgIGRhdGFbdmFsdWUucm93SW5kZXhdW3ZhbHVlLmNvbHVtbkluZGV4XSA9IHJlcXVlc3QudmFsdWUudmFsdWU7XG4gICAgfSxcbiAgICBhZGRSb3c6IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICB2YXIgdmFsdWUgPSByZXF1ZXN0LnZhbHVlO1xuICAgICAgdmFyIGRhdGEgPSBvdC5nZXREYXRhKCk7XG4gICAgICB2YXIgc29tZVJvdyA9IGRhdGFbMF0gfHwgW107XG4gICAgICB2YXIgcm93ID0gc29tZVJvdy5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9KTtcblxuICAgICAgZGF0YS5zcGxpY2UodmFsdWUucm93SW5kZXgsIDAsIHJvdyk7XG4gICAgfSxcbiAgICBkZWxldGVSb3c6IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICB2YXIgdmFsdWUgPSByZXF1ZXN0LnZhbHVlO1xuICAgICAgdmFyIGRhdGEgPSBvdC5nZXREYXRhKCk7XG4gICAgICBkYXRhLnNwbGljZSh2YWx1ZS5yb3dJbmRleCwgMSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciB0cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHtcbiAgICB1cGRhdGVDZWxsOiB7XG4gICAgICB1cGRhdGVDZWxsOiBmdW5jdGlvbiAobmV3UmVxdWVzdCwgb2xkUmVxdWVzdCkge1xuICAgICAgICBpZiAobmV3UmVxdWVzdC52YWx1ZS5yb3dJbmRleCAhPT0gb2xkUmVxdWVzdC52YWx1ZS5yb3dJbmRleCB8fCBuZXdSZXF1ZXN0LnZhbHVlLmNvbHVtbkluZGV4ICE9PSBvbGRSZXF1ZXN0LnZhbHVlLmNvbHVtbkluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld1JlcXVlc3QucHJpb3JpdHkgPCBvbGRSZXF1ZXN0LnByaW9yaXR5KSB7XG4gICAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvbGRSZXF1ZXN0LnZhbHVlKSk7XG4gICAgICAgIG5ld1JlcXVlc3QudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3Q7XG4gICAgICB9LFxuICAgICAgYWRkUm93OiBmdW5jdGlvbiAobmV3UmVxdWVzdCwgb2xkUmVxdWVzdCkge1xuICAgICAgICBpZiAobmV3UmVxdWVzdC52YWx1ZS5yb3dJbmRleCA8IG9sZFJlcXVlc3QudmFsdWUucm93SW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gbmV3UmVxdWVzdDtcbiAgICAgICAgfVxuICAgICAgICBuZXdSZXF1ZXN0LnZhbHVlLnJvd0luZGV4ICs9IDE7XG4gICAgICAgIHJldHVybiBuZXdSZXF1ZXN0O1xuICAgICAgfSxcbiAgICAgIGRlbGV0ZVJvdzogZnVuY3Rpb24gKG5ld1JlcXVlc3QsIG9sZFJlcXVlc3QpIHtcbiAgICAgICAgaWYgKG5ld1JlcXVlc3QudmFsdWUucm93SW5kZXggPCBvbGRSZXF1ZXN0LnZhbHVlLnJvd0luZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCtuZXdSZXF1ZXN0LnZhbHVlLnJvd0luZGV4ID09PSArb2xkUmVxdWVzdC52YWx1ZS5yb3dJbmRleCkge1xuICAgICAgICAgIHJldHVybiBvdC5tYXJrQXNOb09wKG5ld1JlcXVlc3QpO1xuICAgICAgICB9XG4gICAgICAgIG5ld1JlcXVlc3QudmFsdWUucm93SW5kZXggLT0gMTtcbiAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3Q7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRSb3c6IHtcbiAgICAgIC8vIG5vIG5lZWQgZm9yIHRyYW5zZm9ybWF0aW9uXG4gICAgICAvLyB1cGRhdGVDZWxsOiBmdW5jdGlvbiAobmV3UmVxdWVzdCwgb2xkUmVxdWVzdCkge31cbiAgICAgIGFkZFJvdzogZnVuY3Rpb24gKG5ld1JlcXVlc3QsIG9sZFJlcXVlc3QpIHtcbiAgICAgICAgaWYgKG5ld1JlcXVlc3QudmFsdWUucm93SW5kZXggIT09IG9sZFJlcXVlc3QudmFsdWUucm93SW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gbmV3UmVxdWVzdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3QubWFya0FzTm9PcChuZXdSZXF1ZXN0KTtcbiAgICAgIH0sXG4gICAgICBkZWxldGVSb3c6IGZ1bmN0aW9uIChuZXdSZXF1ZXN0LCBvbGRSZXF1ZXN0KSB7XG4gICAgICAgIGlmIChuZXdSZXF1ZXN0LnZhbHVlLnJvd0luZGV4IDwgb2xkUmVxdWVzdC52YWx1ZS5yb3dJbmRleCkge1xuICAgICAgICAgIHJldHVybiBuZXdSZXF1ZXN0O1xuICAgICAgICB9XG4gICAgICAgIG5ld1JlcXVlc3QudmFsdWUucm93SW5kZXggLT0gMTtcbiAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3Q7XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVSb3c6IHtcbiAgICAgIC8vIG5vIG5lZWQgZm9yIHRyYW5zZm9ybWF0aW9uXG4gICAgICAvLyB1cGRhdGVDZWxsOiBmdW5jdGlvbiAobmV3UmVxdWVzdCwgb2xkUmVxdWVzdCkge31cbiAgICAgIGFkZFJvdzogZnVuY3Rpb24gKG5ld1JlcXVlc3QsIG9sZFJlcXVlc3QpIHtcbiAgICAgICAgaWYgKG5ld1JlcXVlc3QudmFsdWUucm93SW5kZXggPCBvbGRSZXF1ZXN0LnZhbHVlLnJvd0luZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgbmV3UmVxdWVzdC52YWx1ZS5yb3dJbmRleCArPSAxO1xuICAgICAgICByZXR1cm4gbmV3UmVxdWVzdDtcbiAgICAgIH0sXG4gICAgICBkZWxldGVSb3c6IGZ1bmN0aW9uIChuZXdSZXF1ZXN0LCBvbGRSZXF1ZXN0KSB7XG4gICAgICAgIGlmIChuZXdSZXF1ZXN0LnZhbHVlLnJvd0luZGV4ICE9PSBvbGRSZXF1ZXN0LnZhbHVlLnJvd0luZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIG5ld1JlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG90Lm1hcmtBc05vT3AobmV3UmVxdWVzdCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiAob3BlYXJpb25UcmFuc2Zvcm1hdGlvbikge1xuICAgIG90ID0gb3BlYXJpb25UcmFuc2Zvcm1hdGlvbjtcbiAgICBvdC5zZXRFeGVjdXRlQWN0aW9ucyhleGVjdXRlQWN0aW9ucyk7XG4gICAgb3Quc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgodHJhbnNmb3JtYXRpb25NYXRyaXgpO1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0YWJsZUNoYW5nZVJ1bGVzOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIFRhYmxlQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvVGFibGVBY3Rpb25zJyk7XG52YXIgT1QgPSByZXF1aXJlKCcuLi9vdC9vdC5qcycpO1xudmFyIHRhYmxlQ2hhbmdlUnVsZXMgPSByZXF1aXJlKCcuLi9vdC90YWJsZUNoYW5nZS5qcycpO1xudmFyIHNvY2tldCwgb3Q7XG5cbmNsYXNzIFRhYmxlU3RvcmUgZXh0ZW5kcyBHTFUuU3RvcmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLmJpbmRBY3Rpb25zKFxuICAgICAgVGFibGVBY3Rpb25zLlVQREFURV9DRUxMLCB0aGlzLnVwZGF0ZUNlbGwsIFtdLFxuICAgICAgVGFibGVBY3Rpb25zLkFERF9ST1csIHRoaXMudXBkYXRlUm93LCBbXSxcbiAgICAgIFRhYmxlQWN0aW9ucy5ERUxFVEVfUk9XLCB0aGlzLmRlbGV0ZVJvdywgW10sXG4gICAgICBUYWJsZUFjdGlvbnMuVVNFUl9DSEFOR0VfUE9TSVRJT04sIHRoaXMudXNlckNoYW5nZVBvc2l0aW9uLCBbXVxuICAgICk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSArICc6ODA4MCcsICdwcm90b2NvbE9uZScpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZW1pdENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuZW1pdENoYW5nZSgpO1xuICAgIH07XG5cbiAgICBvdCA9IG5ldyBPVCh7XG4gICAgICBvbkluaXQ6IGVtaXRDaGFuZ2UsXG4gICAgICBvblVzZXJQb3NpdGlvbkNoYW5nZTogZW1pdENoYW5nZVxuICAgIH0pO1xuICAgIHRhYmxlQ2hhbmdlUnVsZXMob3QpO1xuXG4gICAgb3Qub25Nb2RlbENoYW5nZShUYWJsZUFjdGlvbnMuVVBEQVRFX0NFTEwsIGVtaXRDaGFuZ2UpO1xuICAgIG90Lm9uTW9kZWxDaGFuZ2UoVGFibGVBY3Rpb25zLkFERF9ST1csIGVtaXRDaGFuZ2UpO1xuICAgIG90Lm9uTW9kZWxDaGFuZ2UoVGFibGVBY3Rpb25zLkRFTEVURV9ST1csIGVtaXRDaGFuZ2UpO1xuXG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgb3QucHJvY2Vzc1JlcXVlc3QoZXZlbnQuZGF0YSk7XG4gICAgfTtcbiAgfVxuXG4gIGdldCBkYXRhKCkge1xuICAgIHJldHVybiBvdC5nZXREYXRhKCk7XG4gIH1cblxuICBnZXQgdXNlcnNQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gb3QuZ2V0VXNlcnNQb3N0aW9uKCk7XG4gIH1cblxuICB0cmlnZ2VyUmVxdWVzdChhY3Rpb24sIHBheWxvYWQsIHNob3VsZFNraXApIHtcbiAgICB2YXIgbWVzc2FnZSA9IG90LmNyZWF0ZU1lc3NhZ2UoYWN0aW9uLCBwYXlsb2FkKTtcbiAgICB2YXIgcmVxdWVzdCA9IEpTT04ucGFyc2UobWVzc2FnZSk7XG4gICAgaWYgKCFzaG91bGRTa2lwKSB7XG4gICAgICBvdC5leGVjdXRlKHJlcXVlc3QpO1xuICAgIH1cbiAgICBzb2NrZXQuc2VuZChtZXNzYWdlKTtcbiAgICBpZiAoYWN0aW9uID09PSBUYWJsZUFjdGlvbnMuVVBEQVRFX0NFTEwpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkuZ2V0VGltZSgpLCBwYXlsb2FkKTtcbiAgICB9XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICB1cGRhdGVDZWxsKHBheWxvYWQpIHtcbiAgICB0aGlzLnRyaWdnZXJSZXF1ZXN0KFRhYmxlQWN0aW9ucy5VUERBVEVfQ0VMTCwgcGF5bG9hZCk7XG4gIH1cblxuICB1cGRhdGVSb3cocGF5bG9hZCkge1xuICAgIHRoaXMudHJpZ2dlclJlcXVlc3QoVGFibGVBY3Rpb25zLkFERF9ST1csIHBheWxvYWQpO1xuICB9XG5cbiAgZGVsZXRlUm93KHBheWxvYWQpIHtcbiAgICB0aGlzLnRyaWdnZXJSZXF1ZXN0KFRhYmxlQWN0aW9ucy5ERUxFVEVfUk9XLCBwYXlsb2FkKTtcbiAgfVxuXG4gIHVzZXJDaGFuZ2VQb3NpdGlvbihwYXlsb2FkKSB7XG4gICAgdGhpcy50cmlnZ2VyUmVxdWVzdChUYWJsZUFjdGlvbnMuVVNFUl9DSEFOR0VfUE9TSVRJT04sIHBheWxvYWQsIHRydWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFRhYmxlU3RvcmUoKTsiXX0=
