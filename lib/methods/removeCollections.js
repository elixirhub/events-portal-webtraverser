/**
 * Modules dependencies */

 var mongo = require('mongo');


 /**
  * removeCollections method */

module.exports = function (callback) {

  var self = this;

  mongo.get(self.mongoId, function (err, mon) {
    if (err) return self.emit('error', err);

    mon.links.remove({}, function (err, result) {
      if (err) return self.emit('error', err);

      mon.queue.remove({}, function (err, result) {
        if (err) return self.emit('error', err);

        callback();

      });
    });
  });

};
