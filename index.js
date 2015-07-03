var Promise = require('bluebird');
var redis = Promise.promisifyAll(require('redis'));

var JARC = module.exports = function JARedisConnector(keyDb, viewDb) {
  this.keyHost = keyDb[0];
  this.keyPort = keyDb[1];
  this.keyPw = keyDb[2];

  this.viewHost = viewDb[0];
  this.viewPort = viewDb[1];
  this.viewPw = viewDb[2];

  this.keyClient = redis.createClient(this.keyPort, this.keyHost, {
    'auth_pass': this.keyPw
  });
  this.viewClient = redis.createClient(this.viewPort, this.viewHost, {
    'auth_pass': this.viewPw
  });
};

JARC.prototype.generateKey = function (key) {
  var bucket = (key.split('').reduce(function (pv, cv) {
    return pv + cv.charCodeAt(0);
  }, 0) * 2000) / 1000;

  return ['viewKey:' + bucket, key];
};

JARC.prototype.getKey = function (key) {
  return this.keyClient.hgetAsync(key[0], key[1]);
};

JARC.prototype.setKey = function (key, value) {
  return this.keyClient.hsetAsync(key[0], key[1], value);
};

JARC.prototype.getView = function (viewKey) {
  return this.viewClient.getAsync(viewKey);
};

JARC.prototype.setView = function (viewKey, view) {
  return this.viewClient.setAsync(viewKey, view);
};
