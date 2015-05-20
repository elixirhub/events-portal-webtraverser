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
      self.inspect(self.urlStart, self.urlStart);

    });
  });

};
