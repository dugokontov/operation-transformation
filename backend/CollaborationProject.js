/*jslint node:true*/
'use strict';
var fs = require('fs');
var initTable = require('./initTable');
var requester = require('./request');
var OT = require('../ot/ot');
var tableChangeRules = require('../ot/table');

var onEverybodyOut, ot;

var hash = function (request) {
  return request.priority + ',' + request.states.toString();
};

var CollaborationProject = function (tableID, onEverybodyOutCallback, activateOnThisManyUsers) {
  this.clients = [];
  this.tableID = tableID;
  this.clientsWaitingForData = [];
  onEverybodyOut = onEverybodyOutCallback;
  ot = new OT();
  tableChangeRules(ot);
  ot.setStates([]);
  this.priority = 0;
  this.timeMeasures = {};
  this.activateOnThisManyUsers = activateOnThisManyUsers;
  console.log('We have to wait for', activateOnThisManyUsers, 'users');

  var that = this;

  var onTableLoaded = function (table) {
    console.log('data is retrieved for', tableID);
    ot.setData(table);
    
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
    that.takeTime(JSON.parse(message));
    ot.processRequest(message);
  });

  // send data or add in waiting que
  client.priority = this.priority;
  console.log(client.priority);
  if (client.priority === this.activateOnThisManyUsers) {
    console.log('sending data');
    that.clients.forEach(function (client) {
      that.sendInit(client);
    });
  }
  // if (ot.getData()) {
  //   this.sendInit(client);
  // } else {
  //   this.clientsWaitingForData.push(client);
  // }

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
  var results = Object
    .keys(this.timeMeasures)
    .map(function (hash) {
      var elements = hash.split(',');
      var clinetPriority = elements[0];
      // var status = elements.slice(1);
      return([clinetPriority].concat(that.timeDiff(that.timeMeasures[hash].times)));
    })
    .join('\n');
  ot.setData(null);
  fs.writeFile('server.csv', results, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Results saved in file server.csv');
  });
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
  var actionData = request.value;
  var that = this;
  requester.getJSON({
    method: 'POST',
    path: 'Table/' + this.tableID + '/Cell/' + actionData.columnID + '/' + actionData.rowID,
    body: {
      value: actionData.value
    }
  }, function (response) {
    that.takeTime(request);
    console.log('in response we got:', response);
    that.broadcast(JSON.stringify(request));
    that.takeTime(request);
  });
  this.takeTime(request);
};

var newTimeInMiliseconds = function (time) {
  var seconds = time[0];
  var nanoseconds = time[1];
  var timeInNanoseconds = nanoseconds / 1000000;
  return timeInNanoseconds + (seconds * 1000);
};

CollaborationProject.prototype.timeDiff = function(times) {
  return times.slice(1).map(function (stop, index) {
    var start = times[index];
    var oldTimeDiff = stop.timeOld - start.timeOld;

    var newTimeStop = newTimeInMiliseconds(stop.time);
    var newTimeStart = newTimeInMiliseconds(start.time);
    var newTimeDiff = newTimeStop - newTimeStart;

    return ((oldTimeDiff + newTimeDiff) / 2).toFixed(2);
  });
};

CollaborationProject.prototype.takeTime = function(request) {
  var key = hash(request);
  if (!this.timeMeasures[key]) {
    this.timeMeasures[key] = {
      action: request.action,
      times:[]
    };
  }
  this.timeMeasures[key].times.push({
    time: process.hrtime(),
    timeOld: new Date().getTime()
  });
};

exports.CollaborationProject = CollaborationProject;
