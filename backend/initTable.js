/*jslint node:true*/
'use strict';

var request = require('./request');

var generateSQLQuery = function (tableID, columns) {
  var columnsList = columns
    .map(function (column) {
      return 'c<' + column.id + '>';
    })
    .join(',');
  return 'SELECT id, ' + columnsList +
    ' FROM t<' + tableID + '>' +
    ' WHERE 1 = 1' +
    ' ORDER BY c<id>';
};

exports.constructTable = function (tableID, onDone) {
  var requests = 2;
  var done = function () {
    requests -= 1;
    if (requests === 0) {
      onDone(table);
    }
  };
  var table = {};
  // get metadata
  request.getJSON({
    path: 'Table/' + tableID
  }, function (json) {
    table.metadata = json;
    done();
  }, function (err) {
    console.log(err);
  });

  // get columns
  request.getJSON({
    path: 'Search/Column?tableID=' + tableID
  }, function (columns) {
    table.columns = columns;
    // get data
    var sql = generateSQLQuery(tableID, columns);
    request.getJSON({
      path: 'QueryResult/' + encodeURI(sql)
    }, function (data) {
      table.data = data;
      done();
    }, function (err) {
      console.log(err);
    });
  }, function (err) {
    console.log(err);
  });
};