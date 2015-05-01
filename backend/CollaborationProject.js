/*jslint node:true*/
'use strict';
var initTable = require('./initTable');
var OT = require('../ot/ot');

var onEverybodyOut, ot, priority;

var CollaborationProject = function (tableID, onEverybodyOutCallback) {
  this.clients = [];
  this.tableID = tableID;
  this.clientsWaitingForData = [];
  onEverybodyOut = onEverybodyOutCallback;
  ot = new OT();
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

exports.CollaborationProject = CollaborationProject;
