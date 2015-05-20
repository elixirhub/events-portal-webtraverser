/**
 * Modules dependencies */

var mongo = require('mongo');
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


var webtraverser = new Webtraverser({
  "urlStart": "https://elixir-europe.org",
  "mongoId": 'webtraverser',
  "maxConcurrent": 3,
  "checkHostname": false
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
  console.log("TOTAL : %d", webtraverser.totalCount);
  console.log("CURRENT : %d", webtraverser.currentCount);
  console.log("QUEUE: %d", webtraverser.queueCount);
}, 3000);
