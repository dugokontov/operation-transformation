/*jslint node:true*/
'use strict';
var CollaborationProject = require('./CollaborationProject').CollaborationProject;

var collaborationProjects = {};

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  port: 28735
});

var onEverybodyOut = function (tableID) {
  collaborationProjects[tableID] = undefined;
};

wss.on('connection', function (ws) {
  var tableID = ws.protocol;
  if (!collaborationProjects[tableID]) {
    collaborationProjects[tableID] = new CollaborationProject(tableID, onEverybodyOut);
  }
  collaborationProjects[tableID].addClient(ws);
});
