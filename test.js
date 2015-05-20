/**
 * Modules dependencies */

var mongo = require('mongo');
var microdata = require('microdata');
var Webtraverser = require('./lib/webtraverser.js');


/**
 * Establishing MongoDB connection. */

mongo.set(
  'webtraverser',
  '127.0.0.1',
  27017,
  'webtraverser',
  ['links', 'queue'],
function (err, mon) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('The MongoDB client is connected.');
});

var urlsStart = [
  'https://www.csc.fi/courses-and-events',
  'http://www.dtls.nl/courses/ and http://www.dtls.nl/events/',
  'https://www.isb-sib.ch/news-a-events/events/categoryevents/2.html',

  'http://eventful.com/cityoflondon_uk/events/july',
  'http://www.france-voyage.com/events/strasbourg-christmas-market-7.htm',

  'http://elixir-uk.org/node-events',
  'http://www.tgac.ac.uk/tgac-events/',
  'http://www.ebi.ac.uk/about/events'
];

var webtraverser = new Webtraverser({
  "urlStart": urlsStart,
  "mongoId": 'webtraverser',
  "maxConcurrent": 3,
  "checkHostname": true
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var eventFound = false;
var events = [];

webtraverser.functions.push(function (fromUrlo, currentUrlo,
htmlReceived, statusCode, callback) {
  var result = microdata.parse(htmlReceived);
  if (result[0]) {
    eventFound = true;
    events.push(result);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(result);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  }
  callback();
});

webtraverser.on('error', function (err, fromUrlo, currentUrlo) {
  console.error(err, fromUrlo.href, currentUrlo.href);
  process.exit(1);
});

webtraverser.on('unsupported protocol', function (fromUrlo, currentUrlo) {
  //console.log('unsupported protocol',  currentUrlo.href);
});

webtraverser.on('different hostname', function (fromUrlo, currentUrlo) {
  //console.log('different hostname', fromUrlo.hostname, currentUrlo.hostname);
});

webtraverser.on('already checked', function (fromUrlo, currentUrlo, doc) {
  //console.log('already checked', currentUrlo.href, doc);
});

webtraverser.on('inspect', function (fromUrlo, currentUrlo) {
  console.log(
    'Inspecting %s (total = %d, current = %d, queue = %d)',
    currentUrlo.href,
    webtraverser.totalCount,
    webtraverser.currentCount,
    webtraverser.queueCount
  );
});

webtraverser.on('max total links', function () {
  console.log('Max total links reached.');
  process.exit(0);
});


webtraverser.removeCollections(function () {
  console.log('The collections in the database have been removed.');
  webtraverser.start();
  webtraverser.interval({"ms": 1000});
});

setInterval(function () {
  if (eventFound) {
    console.log('Events found:');
    console.log(events);
  }
}, 10000);
