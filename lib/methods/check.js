/*

  Check method


Parameters

  @param {Object} fromUrlo
  @param {Object} currentUrlo
  @param {Object} options
         {Boolean} [options.checkProtocol=true]
         {Boolean} [options.checkHostname=true]
         {Boolean} [options.checkLastcheck=true]
         {Number}  [options.checkLastcheckMinutes=10]
  @param {Function} callback


Events

  @fires Webtraverser#'error'
  @fires Webtraverser#'unsupported protocol'
  @fires Webtraverser#'different hostname'
  @fires Webtraverser#'already checked'

  'error' event
    @event Webtraverser#'error'
    @param {Error} err
    @param {Object} fromUrlo
    @param {Object} currentUrlo

  'unsupported protocol' event
    @event Webtraverser#'unsupported protocol'
    @param {Object} fromUrlo
    @param {Object} currentUrlo


  'different hostname' event
    @event Webtraverser#'different hostname'
    @param {Object} fromUrlo
    @param {Object} currentUrlo


  'already checked' event
    @event Webtraverser#'already checked'
    @param {Object} fromUrlo
    @param {Object} currentUrlo
    @param {Object} previousDocument
    The document of the link before updating it.

*/


/**
 * Module dependencies */

var mongo = require('mongo');


/**
 * Check method */

module.exports = function (fromUrlo, currentUrlo, options, callback) {

  var self = this;

  /* Setting the default options. */
  if (options.checkProtocol === undefined) options.checkProtocol = true;
  if (options.checkHostname === undefined) options.checkHostname = true;
  if (options.checkLastcheck === undefined) options.checkLastcheck = true;
  if (options.checkLastcheckMinutes === undefined)
    options.checkLastcheckMinutes = 10;

  /* Checking the protocol */
  if (options.checkProtocol
    && (currentUrlo.protocol !== 'http:' && currentUrlo.protocol !== 'https:'))
  {
    self.currentCount--;
    self.emit('unsupported protocol', fromUrlo, currentUrlo);
    return;
  }

  /* Checking the hostname. */
  if (options.checkHostname && fromUrlo.hostname !== currentUrlo.hostname) {
    self.currentCount--;
    self.emit('different hostname', fromUrlo, currentUrlo);
    return;
  }

  mongo.get(self.mongoId, function (err, mon) {
    if (err) return self.emit('error', err, fromUrlo, currentUrlo);

    /* Setting the date of the check. */
    mon.links.findAndModify(
      { "url": currentUrlo.hrefNoHash },
      [[ '_id', 1 ]],
      {
        $inc: { "checkingCount": 1 },
        // $currentDate: { "lastChecked": true } // For last MongoDB version.
        $set: { "lastChecked": new Date() } // For old MongoDB version.
      },
      { upsert: true },
    function (err, lastDoc) {
      if (err) return self.emit('error', err, fromUrlo, currentUrlo);

      var minus10Minutes = new Date();
      minus10Minutes.setMinutes(
        minus10Minutes.getMinutes() - options.checkLastcheckMinutes
      );

      /* Check whether the link has already been checked. */
      if (options.checkLastcheck
        && lastDoc.value && lastDoc.value.lastChecked
        && lastDoc.value.lastChecked.getTime() >= minus10Minutes.getTime()
      ) {
        self.currentCount--;
        self.emit('already checked', fromUrlo, currentUrlo, lastDoc.value);
      }

      // Next
      else callback();

    });
  });

};
