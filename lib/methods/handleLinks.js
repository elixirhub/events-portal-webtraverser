/**
 * Modules dependencies */

var url = require('url');
var cheerio = require('cheerio');
var mongo = require('mongo');


/**
 * HandleLinks method
 *
 * @param {Object} fromUrlo
 * @param {Object} currentUrlo
 * @param {String} htmlReceived
 */

module.exports = function (fromUrlo, currentUrlo, htmlReceived) {

  var self = this;

  var $ = cheerio.load(htmlReceived);
  var linksElements = $('a');

  var URLsList = [];
  var i, c, hrefValue, newUrl;

  if (self.maxSizeQueue) {
    if (self.queueCount < self.maxSizeQueue) {
      if (self.queueCount + linksElements.length <= self.maxSizeQueue)
        c = linksElements.length;
      else
        c = linksElements.length - (self.maxSizeQueue - self.queueCount);
    } else c = 0;
  } else c = linksElements.length;

  if (c === 0) {
    self.currentCount--; // The inspection is finished.
    return;
  }

  c = c <= 1000 ? c : 1000; // Setting the maximum for MongoDB.

  for (i = 0; i < c; i++) {
    hrefValue = $(linksElements[i]).attr('href') || '';
    newUrl = url.resolve(currentUrlo.href, hrefValue);
    URLsList.push({
      "newUrl": newUrl,
      "currentUrl": currentUrlo.href,
      "date": new Date()
    });
  }

  mongo.get(self.mongoId, function (err, mon) {
    if (err) return self.emit('error', err, fromUrlo, currentUrlo);

    self.queueCount += URLsList.length;

    mon.queue.insert(URLsList, function (err, result) {
      if (err) return self.emit('error', err, fromUrlo, currentUrlo);
      self.currentCount--; // The inspection is finished.
    });

  });

};
