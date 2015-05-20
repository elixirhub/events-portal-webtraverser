/**
 * Modules dependencies */

var url = require('url');


/**
 * setNoHash
 *
 * @param {Object} currentUrlo
 */

exports.setNoHash = function (currentUrlo) {

  // Copy the object.
  var currentUrlo2 = url.parse(currentUrlo.href);

  // Remove the hash.
  currentUrlo2.hash = null;

  // Add the property without hash.
  currentUrlo.hrefNoHash = url.format(currentUrlo2);

  // Return the new object in case 'currentUrlo' is not a pointer.
  return currentUrlo;

};
