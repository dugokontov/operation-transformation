'use strict';
var parse = require('csv-parse');
var fs = require('fs');

var report = {};
var dataFromServer;

var client = function (data, filename) {
    var regexMatch = filename.match(/^\d+/);
    var clientId = +regexMatch[0];
    report[clientId] = data;
};

var server = function () {
    var whatRow = {};
    dataFromServer.forEach(function (row) {
        var clientId = row[0];
        var clientReport = report[clientId];
        if (!clientReport) {
            console.error('Clinet', clientId, 'has not sent report');
            return;
        }
        if (whatRow[clientId] === undefined) {
            whatRow[clientId] = -1;
        }
        whatRow[clientId] += 1;
        var clientIndex = whatRow[clientId];
        Array.prototype.push.apply(clientReport[clientIndex], row.slice(1));
    });
};

var printReport = function () {
    var stringToWrite = Object
        .keys(report)
        .map(function (clientId) {
            return report[clientId]
                .map(function (row) {
                   return clientId + ',' + row.join(',');
                })
                .join('\n');
        })
        .join('\n');
    var header = [
        'ClientID',
        'Client process time',
        'Client wait time',
        'Region',
        'Server process time',
        'Server wait time',
        'Server send message'
    ];
    stringToWrite = header.join(',') + '\n' + stringToWrite;
    console.log(stringToWrite);
    fs.writeFile('report.csv', stringToWrite, function (err) {
        if (err) {
            console.error(err);
        }
    });
};

fs.readdir('.', function (err, files) {
    if (err) {
        console.error(err);
        return;
    }
    files = files.filter(function (file) {
        return /^\d.+\.csv$/.test(file) || file === 'server.csv';
    });
    var rest = files.length;
    files.forEach(function (file) {
        fs.readFile(file, {encoding: 'UTF-8'}, function (err, data) {
            if (err) {
                console.error(err);
                return;
            }
            parse(data, function (err, data) {
                if (err) {
                    console.error(err);
                }
                if (/^\d+/.test(file)) {
                    client(data, file);
                } else {
                    dataFromServer = data;
                }
                rest -= 1;
                if (!rest) {
                    server();
                    printReport();
                }
            });
        });
    });
});
