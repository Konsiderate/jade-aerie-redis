var JARedisConnector = require('../');
var assert = require('assert');
var redis = require('redis');
var redisMock = require('fakeredis');
var sinon = require('sinon');

describe('Jade Aerie Redis Connector', function () {
  var keyDb = ['host1', '1111', 'pw1'];
  var viewDb = ['host2', '2222', 'pw2'];

  beforeEach(function () {
    sinon.stub(redis, 'createClient', redisMock.createClient);
    this.jarc = new JARedisConnector(keyDb, viewDb);
  });

  afterEach(function () {
    redis.createClient.restore();
  });

  it('returns a new instance of JARedisConnector', function () {
    assert(this.jarc instanceof JARedisConnector);
  });

  it('should store individual values for keyDB', function () {
    assert(this.jarc.keyHost === keyDb[0], 'keyHost does not match');
    assert(this.jarc.keyPort === keyDb[1], 'keyPort does not match');
    assert(this.jarc.keyPw === keyDb[2], 'keyPw does not match');
  });

  it('should store individual values for viewDB', function () {
    assert(this.jarc.viewHost === viewDb[0], 'viewHost does not match');
    assert(this.jarc.viewPort === viewDb[1], 'viewPort does not match');
    assert(this.jarc.viewPw === viewDb[2], 'viewPw does not match');
  });

  it('should create two redis connections', function () {
    assert(typeof this.jarc.keyClient === 'object');
    assert(typeof this.jarc.viewClient === 'object');
  });

  it('generates keys', function () {
    var key = 'sometestkey';
    var expected = ['viewKey:2426', key];
    var actual = this.jarc.generateKey(key);
    assert.deepEqual(expected, actual);
  });

  it('should have promisified clients', function () {
    assert(this.jarc.keyClient.hgetAsync, 'Key Client not promisified');
    assert(this.jarc.viewClient.hgetAsync, 'View Client not promisified');
    assert(this.jarc.keyClient.hsetAsync, 'Key Client not promisified');
    assert(this.jarc.viewClient.hsetAsync, 'View Client not promisified');
  });
});
