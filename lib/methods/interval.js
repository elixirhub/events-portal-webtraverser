/*

  Interval method


Parameters

  @param {Object} options
  @param {Number} [options.ms=5000]

*/


/**
 * Modules dependencies */

var mongo = require('mongo');


/**
 * Interval method */
module.exports = function (options) {

  var self = this;

  options = options || {};

  var intervalID = setInterval(function () {

    /* Maximum total links inspected has been reached. */
    if (self.maxTotalLinks && self.maxTotalLinks === totalCount) {
      clearInterval(intervalID);
      self.emit('max total links');
      return;
    }

    mongo.get(self.mongoId, function (err, mon) {
     if (err) return self.emit('error', err, null, null);

     mon.queue.find({}).sort([['date', 1]]).limit(self.maxConcurrent)
     .toArray(function (err, docs) {
       if (err) return self.emit('error', err, null, null);

       var nbAbleToBeInspected = self.maxConcurrent - self.currentCount;
       nbAbleToBeInspected = docs.length >= nbAbleToBeInspected
                           ? nbAbleToBeInspected : docs.length;

       var IDsToRemove = [];

       for (var i = 0; i < nbAbleToBeInspected; i++) {
         IDsToRemove.push(docs[i]._id);
         self.inspect(docs[i].currentUrl, docs[i].newUrl);
       }

       mon.queue.remove({"_id": {$in: IDsToRemove}}, function (err, result) {
         if (err) return self.emit('error', err, null, null);
         self.queueCount -= IDsToRemove.length;
       });

     });

   });

  }, options.ms || 5000);

};
