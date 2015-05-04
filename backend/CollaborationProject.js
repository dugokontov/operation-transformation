/*jslint node:true*/
'use strict';
var initTable = require('./initTable');
var OT = require('../ot/ot');
var tableChangeRules = require('../ot/table');

var onEverybodyOut, ot, priority;

var CollaborationProject = function (tableID, onEverybodyOutCallback) {
  this.clients = [];
  this.tableID = tableID;
  this.clientsWaitingForData = [];
  onEverybodyOut = onEverybodyOutCallback;
  ot = new OT();
  tableChangeRules(ot);
  ot.setStates([]);
  priority = 0;

  var that = this;

  var onTableLoaded = function (table) {
    console.log('data is retrieved for', tableID);
    ot.setData(table);
    that.clientsWaitingForData.forEach(function (client) {
      that.sendInit(client);
    });
    that.clientsWaitingForData.length = 0;
  };

  initTable.constructTable(tableID, onTableLoaded);
  this.suscribeOnEvents();
};

CollaborationProject.prototype.addClient = function (client) {
  var states = ot.getStates();
  states[priority] = 0;
  var that = this;
  this.clients.push(client);

  // suscribe on web socket events
  client.on('close', function () {
    that.removeClient(client);
  });

  client.on('message', function (message) {
    ot.processRequest(message);
    // TODO: put this in callback called after calling backend is done
    that.clients.forEach(function (client) {
      client.send(message);
    });
  });

  // send data or add in waiting que
  if (ot.getData()) {
    this.sendInit(client);
  } else {
    this.clientsWaitingForData.push(client);
  }

  this.broadcast(ot.createMessage('new-user', priority));
  priority += 1;
};

CollaborationProject.prototype.removeClient = function (client) {
  var clinetIndex = this.clients.indexOf(client);
  this.clients.splice(clinetIndex, 1);
  if (this.clients.length === 0) {
    this.destroy();
    console.log('everybody left', this.tableID);
  } else {
    console.log('clients left in this project', this.clients.length);
  }
};

CollaborationProject.prototype.destroy = function() {
  ot.setData(null);
  onEverybodyOut(this.tableID);
};

CollaborationProject.prototype.sendInit = function(client) {
  client.send(ot.createMessage('init', {
    data: ot.getData(),
    states: ot.getStates(),
    priority: priority
  }));
};

CollaborationProject.prototype.broadcast = function(message) {
  this.clients.forEach(function (client) {
    client.send(message);
  });
};

CollaborationProject.prototype.suscribeOnEvents = function() {
  ot.onModelChange('updateCell', this.onUpdateCell.bind(this));
};

CollaborationProject.prototype.onUpdateCell = function(request) {
  // TODO: implement call on backend
  console.log('onUpdateCell', request.value);
};

exports.CollaborationProject = CollaborationProject;
