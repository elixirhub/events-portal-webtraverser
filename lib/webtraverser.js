/*

  Webtraverser class


This is an EventEmitter.


1. Variable naming

  - 'fromUrl' String – is the URL of the page that found the current URL.
  - 'fromUrlo' Object – is 'fromUrl' parsed with the 'url' module.
  - 'currentUrl' String – is the current URL being handled.
  - 'currentUrlo' Object – is 'currentUrl' parsed with the 'url' module.
  - 'newUrl' String – is a new URL to inspect.


2. Parameters

  @param {Object} options


3. Options

3.1 Required options

  @param {String} options.urlStart
  Is the URL of start.

  @param {String} options.mongoId
  Is the ID of the shared MongoDB client, using the mongo module. (See
  https://github.com/cydgy/mongo)


3.2 Optional options

3.2.1 Maximums

  @param {Number|Null} [options.maxTotalLinks=null]
  Is the maximum number of total links to inspect.

  @param {Number|Null} [options.maxSizeQueue=null]
  Is the maximum size of the queue.

  @param {Number|Null} [options.maxConcurrent=6]
  Is the maximum number of links to inspect concurrently.


3.2.2 Checks

  @param {Boolean} [options.checkProtocol=true]
  Check before inspecting that the protocol of the link is either 'http' or
  'https'.

  @param {Boolean} [options.checkHostname=true]
  Check before inspecting that the hostname of the link is equal to the
  hostname of the page on which the link is.

  @param {Boolean} [options.checkLastcheck=true]
  Check before inspecting that the link has not been checked for at least the
  value of 'checkLastcheckMinutes'.

  @param {Number} [options.checkLastcheckMinutes=10]
  Is the number of minutes.


3.2.3 Functions

@param {Array} [options.functions=[]] – is an array containing the
inspection functions.

*/


/**
 * Modules dependencies */

var util = require('util');
var events = require('events');


/**
 * Webtraverser class */

function Webtraverser (options) {

  events.EventEmitter.call(this);

  /* Setting default options. */
  this.options = options || {};

  if (!options.urlStart) throw new Error("'options.urlStart' is required.");
  if (!options.mongoId) throw new Error("'options.mongoId' is required.");

  this.urlStart = options.urlStart;
  this.mongoId = options.mongoId;

  this.maxTotalLinks = options.maxTotalLinks || null;
  this.maxSizeQueue = options.maxSizeQueue || null;
  this.maxConcurrent = options.maxConcurrent || 6;

  this.functions = options.functions || [];

  /* Creating counters. */
  this.totalCount = 0;
  this.currentCount = 0;
  this.queueCount = undefined;

}

util.inherits(Webtraverser, events.EventEmitter);

Webtraverser.prototype.start = require('./methods/start.js');
Webtraverser.prototype.interval = require('./methods/interval.js');
Webtraverser.prototype.removeCollections =
  require('./methods/removeCollections.js');

Webtraverser.prototype.check = require('./methods/check.js');
Webtraverser.prototype.query = require('./methods/query.js');
Webtraverser.prototype.inspect = require('./methods/inspect.js');
Webtraverser.prototype.handleLinks = require('./methods/handleLinks.js');

module.exports = Webtraverser;
