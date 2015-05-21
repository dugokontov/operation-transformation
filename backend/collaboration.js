/*jslint node:true*/
'use strict';
var CollaborationProject = require('./CollaborationProject').CollaborationProject;

var collaborationProjects = {};
var port = 28735;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
  port: port
});

console.log('web socket opened on port', port);

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
