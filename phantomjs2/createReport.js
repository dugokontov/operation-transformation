/*jshint node:true*/
'use strict';
var parse = require('csv-parse');
var fs = require('fs');

var report = {};
var dataFromServer;

var tableIdToTableSize = {
    1057: 5,
    1122: 12,
    1123: 24,
    1124: 96
};

var reportFile = 'report.csv';
fs.unlinkSync(reportFile);

var client = function (data, filename) {
    var regexMatch = filename.match(/^\d+/);
    var clientId = +regexMatch[0];
    if (data.length > 4) {
        data = data.slice(1, 5);
    }
    for (var i = data.length - 1; i >= 0; i -= 1) {
        if (data[i].length < 4) {
            data.splice(i, 1);
            continue;
        }
        if (data[i].length > 4) {
            data[i].splice(0, data[i].length - 4);
        }
    }
    report[clientId] = data;
};

var server = function (tableId, numberOfClients) {
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
        if (!clientReport[clientIndex]) {
            console.error('corrupted data for client', clientId, tableId, numberOfClients, clientIndex);
            return;
        }
        Array.prototype.push.apply(clientReport[clientIndex], row.slice(1));
        clientReport[clientIndex].push(tableId, numberOfClients);
    });
};

var printReport = function () {
    var stringToWrite = Object
        .keys(report)
        .map(function (clientId) {
            return report[clientId]
                .map(function (row) {
                    // 0 - Client process time
                    // 1 - Client wait time
                    // 2 - Region
                    // 3 - Client init load time
                    // 4 - Server process time
                    // 5 - Server wait time
                    // 6 - Server send message
                    // 7 - TableId
                    // 8 - number of clients
                    return [
                        clientId,
                        row[3],
                        row[2],
                        row[8],
                        tableIdToTableSize[row[7]] || 1,
                        (+row[0] + (row[1] - row[5])).toFixed(0)
                    ].join(',');
                })
                .join('\n');
        })
        .join('\n');
    if (!fs.existsSync(reportFile)) {
        var header = [
            'Client Id',
            'Client init load time',
            'Region',
            'Number of clients inside test',
            'Size of data',
            'Client wait time'
        ];
        stringToWrite = header.join(',') + '\n' + stringToWrite;
    } else {
        stringToWrite = '\n' + stringToWrite;
    }
    fs.writeFileSync(reportFile, stringToWrite, { flag: 'a' });
};

var measuresList = [];

var createReportForMeasure = function () {
    if (Object.keys(report).length > 0) {
        printReport();
    }
    var directory = measuresList.pop();
    if (!directory) {
        return;        
    }
    var metadata = directory.split('-');
    var tabelId = metadata[0];
    var numberOfClients = metadata[1];
    report = {};
    dataFromServer = undefined;
    fs.readdir(readFrom + directory, function (err, files) {
        if (err) {
            console.error(err);
            return;
        }
        files = files.filter(function (file) {
            return /^\d.+\.csv$/.test(file) || file === 'server.csv';
        });
        var rest = files.length;
        files.forEach(function (file) {
            fs.readFile(readFrom + directory + '/' + file, {encoding: 'UTF-8'}, function (err, data) {
                if (err) {
                    console.error('Error reading file', readFrom + directory, file);
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
                        server(tabelId, numberOfClients);
                        createReportForMeasure();
                    }
                });
            });
        });
    });
};

var readFrom = process.argv[2] || '.';
fs.readdir(readFrom, function (err, folders) {
    if (err) {
        console.error(err);
        return;
    }
    measuresList = folders.filter(function (folder) {
        return /^\d+\-\d+$/.test(folder);
    });
    createReportForMeasure();
    
    return;
});
