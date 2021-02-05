// icinga2-mongo-plugin - Icinga2 plugin checking MongoDB compatible connections
// Copyright (C) 2021  e.GO Digital GmbH, Aachen, Germany
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const MongoClient = require('mongodb').MongoClient;
const url = require('url');

const args = process.argv.slice(2);

function noUrl() {
    console.warn('Please define a connection URL!');
    process.exit(2);
}

if (args.length < 1) {
    noUrl();
}

const mongoUrlString = args[0].trim();
if (!mongoUrlString) {
    noUrl();
}

const mongoUrl = url.parse(mongoUrlString);
const serverName = `${mongoUrl.hostname}:${mongoUrl.port || 27017}`;

// the time in ms if a warning message is shown
// if the connection process needs more that this
const warnIfConnectionNeedsMoreThanThis = 5000;

const start = new Date();
MongoClient.connect(mongoUrlString, {
    useUnifiedTopology: true
}, function (error, client) {
    const end = new Date();

    if (error) {
        console.log(`CRITICAL - Connection to Mongo server ${serverName} failed: ${error}`);
        process.exit(2);
    }

    try {
        client.close();  // close connection
    } catch (___) { }

    const diff = end - start;  // measure time
    if (diff > warnIfConnectionNeedsMoreThanThis) {
        // needs a long time to connect

        console.log(`WARNING - Connecting to Mongo server ${serverName} need more than ${warnIfConnectionNeedsMoreThanThis}ms`);
        process.exit(1);
    }

    console.log(`OK - Mongo server ${serverName} is up`);
    process.exit(0);
});
