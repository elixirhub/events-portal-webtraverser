/**
 * Module dependencies */

var mongo = require('mongo');


/**
 * Start method */

module.exports = function () {

  var self = this;

  mongo.get(self.mongoId, function (err, mon) {
    if (err) return self.emit('error', err);

    mon.queue.count(function (err, count) {
      if (err) return self.emit('error', err);

      self.queueCount = count;

      if (typeof self.urlStart === 'string')
        self.inspect(self.urlStart, self.urlStart);
      else {

        var URLsList = [];
        for (var i = 1; i < self.urlStart.length; i++)
          URLsList.push({
            "newUrl": self.urlStart[i],
            "currentUrl": self.urlStart[i],
            "date": new Date()
          });

        mon.queue.insert(URLsList, function (err, result) {
          if (err) return self.emit('error', err, fromUrlo, currentUrlo);
          self.queueCount += URLsList.length;
          self.inspect(self.urlStart[0], self.urlStart[0]);
        });

      }

    });
  });

};
