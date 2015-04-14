'use strict';

var TableActions = require('../actions/TableActions');
var OT = require('../ot/ot.js');
var tableChangeRules = require('../ot/tableChange.js');
var socket, ot;

class TableStore extends GLU.Store {
  constructor() {
    super();

    this.init();

    this.bindActions(
      TableActions.UPDATE_CELL, this.updateCell, [],
      TableActions.ADD_ROW, this.updateRow, [],
      TableActions.DELETE_ROW, this.deleteRow, [],
      TableActions.USER_CHANGE_POSITION, this.userChangePosition, []
    );
  }

  init() {
    socket = new WebSocket('ws://' + window.location.hostname + ':8080', 'protocolOne');
    var self = this;
    var emitChange = function () {
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

  get data() {
    return ot.getData();
  }

  get usersPosition() {
    return ot.getUsersPostion();
  }

  triggerRequest(action, payload, shouldSkip) {
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

  updateCell(payload) {
    this.triggerRequest(TableActions.UPDATE_CELL, payload);
  }

  updateRow(payload) {
    this.triggerRequest(TableActions.ADD_ROW, payload);
  }

  deleteRow(payload) {
    this.triggerRequest(TableActions.DELETE_ROW, payload);
  }

  userChangePosition(payload) {
    this.triggerRequest(TableActions.USER_CHANGE_POSITION, payload, true);
  }
}

module.exports = new TableStore();