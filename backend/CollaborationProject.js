/*jslint node:true*/
'use strict';
var initTable = require('./initTable');
var requester = require('./request');
var OT = require('../ot/ot');
var tableChangeRules = require('../ot/table');

var onEverybodyOut, ot;

var CollaborationProject = function (tableID, onEverybodyOutCallback) {
  this.clients = [];
  this.tableID = tableID;
  this.clientsWaitingForData = [];
  onEverybodyOut = onEverybodyOutCallback;
  ot = new OT();
  tableChangeRules(ot);
  ot.setStates([]);
  this.priority = 0;
  this.timeMeasures = {};

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
  states[this.priority] = 0;
  var that = this;
  this.clients.push(client);

  // suscribe on web socket events
  client.on('close', function () {
    that.removeClient(client);
  });

  client.on('message', function (message) {
    var when = process.hrtime();
    var request = JSON.parse(message);
    ot.processRequest(message);
    // TODO: put this in callback called after calling backend is done
    that.clients.forEach(function (client) {
      client.send(message);
      if (+client.priority === request.priority) {
        that.measure(when, process.hrtime(), request);
      }
    });
  });

  // send data or add in waiting que
  client.priority = this.priority;
  if (ot.getData()) {
    this.sendInit(client);
  } else {
    this.clientsWaitingForData.push(client);
  }

  this.priority += 1;
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
  var that = this;
  // write results
  Object.keys(this.timeMeasures).forEach(function (hash) {
    var elements = hash.split(',');
    var clinetPriority = elements[0];
    var status = elements.slice(1);
    console.log(clinetPriority, status, that.timeMeasures[hash].action, that.timeMeasures[hash].time);
  });
  ot.setData(null);
  onEverybodyOut(this.tableID);
};

CollaborationProject.prototype.sendInit = function(client) {
  client.send(ot.createMessage('init', {
    data: ot.getData(),
    states: ot.getStates(),
    priority: client.priority
  }));
  this.broadcast(ot.createMessage('new-user', client.priority));
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
  var actionData = request.value;
  requester.getJSON({
    method: 'POST',
    path: 'Table/' + this.tableID + '/Cell/' + actionData.columnID + '/' + actionData.rowID,
    body: {
      value: actionData.value
    }
  }, function (response) {
    console.log('in response we got:', response);
  });
};

CollaborationProject.prototype.measure = function(start, end, request) {
  var hash = request.priority + ',' + request.states.toString();
  var seconds = end[0] - start[0];
  var nanoseconds = end[1] - start[1];
  var timePassed = nanoseconds / 1000000000.0;
  timePassed += seconds;
  this.timeMeasures[hash] = {
    action: request.action,
    time: timePassed
  };
};

exports.CollaborationProject = CollaborationProject;
