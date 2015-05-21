/**
 * Module dependencies */

var url = require('url');
var basics = require('../basics.js');


/**
 * Inspect method */

module.exports = function (fromUrlOrfromUrlo, currentUrl) {

  var self = this;

  self.currentCount++;
  self.totalCount++;

  var currentUrlo = basics.setNoHash(url.parse(currentUrl));
  var fromUrlo = typeof fromUrlOrfromUrlo === 'string'
    ? basics.setNoHash(url.parse(fromUrlOrfromUrlo)) : fromUrlOrfromUrlo;

  self.emit('inspect', fromUrlo, currentUrlo);

  self.check(fromUrlo, currentUrlo, self.options, function () {
    self.query(fromUrlo, currentUrlo, function (htmlReceived, statusCode) {

      /**
       * Execute personal functions then handle the links when finished.
       */

      var i;

      (function serie (i) {

        /* If there is no functions. */
        if (!self.functions.length)
          return self.handleLinks(fromUrlo, currentUrlo, htmlReceived);

        /* If an error occurs, the user should emit an error. */
        self.functions[i](self, fromUrlo, currentUrlo, htmlReceived, statusCode,
        function (result) {

          /* Personal functions have finished. */
          if (self.functions.length === ++i)
            self.handleLinks(fromUrlo, currentUrlo, htmlReceived);
          else
            serie(i);

        });

      })(i = 0);

    });
  });

};
