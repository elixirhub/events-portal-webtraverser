/*

  Query method


Parameters

  @param {Object} fromUrlo
  @param {Object} currentUrlo
  @param {Function} callback


Callback

  @callback
  @param {String} htmlReceived
  @param {Number} statusCode


Events

  @fires Webtraverser#'error'

  'error' event
    @event Webtraverser#'error'
    @param {Error} err
    param {Object} fromUrlo
    param {Object} currentUrlo

*/


/**
 * Module dependencies */

var http = require('http');
var https = require('https');


/**
 * Query method */

module.exports = function (fromUrlo, currentUrlo, callback) {

  var self = this;

  var protocol = currentUrlo.protocol === 'http:' ? http : https;

  protocol.get(currentUrlo.href, function (res) {

    var htmlReceived = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      htmlReceived += chunk;
    });

    res.on('end', function () {
      callback(htmlReceived, res.statusCode);
    });

  }).on('error', function (err) {
    self.emit('error', err, fromUrlo, currentUrlo);
  });

};
