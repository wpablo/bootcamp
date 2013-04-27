var expect = require('chai').expect;
var ObjectID = require('mongodb').ObjectID;

var getDb = require('mongo-getdb');
getDb.init({url: 'mongodb://localhost/mydocs-tests'});

var docs = require('../lib/docs');

var fakeUser1 = {
  id: 'user1'
};
var fakeUser2 = {
  id: 'user2'
};

describe('documents store', function () {
  var db;
  beforeEach(function (done) {
    getDb(function(_db){
      _db.collection('documents').remove({}, done);
      db = _db;
    });
  });

  it('should save the user id', function (done) {
    docs.createNew(fakeUser1, function (err, id) {
      if(err) return done(err);
      db.collection('documents').findOne({_id: new ObjectID(id)}, function (err, doc) {
        if(err) return done(err);
        expect(doc.user).to.equal(fakeUser1.id);
        done();
      });
    });
  });

  it('should not update if the doc belongs to another user', function (done) {
    docs.createNew(fakeUser1, function (err, id) {
      if(err) return done(err);
      docs.save(id, {content: 'aaaa'}, fakeUser2, function (err, count) {
        if(err) return done(err);
        expect(count).to.equal(0);
        done();
      });
    });
  });

  describe('queries', function () {
    var doc1, doc2;
    beforeEach(function (done) {
      docs.createNew(fakeUser1, function (err, id) {
        if (err) return done(err);
        doc1 = id;
        docs.createNew(fakeUser2, function (err, id) {
          if (err) return done(err);
          doc2 = id;
          done();
        });
      });
    });

    it('should only return users document when query', function (done) {
      docs.find('', fakeUser1, function (err, docs) {
        if (err) return done(err);
        var resultIds = docs.map(function (d) { return d._id.toString(); });
        expect(resultIds).to.include(doc1);
        expect(resultIds).to.not.include(doc2);
        done();
      });
    });
  
    it('should not return the doc if it belongs to another user (getById)', function (done) {
      docs.getById(doc2, fakeUser1, function (err, doc) {
        if (err) return done(err);
        expect(doc).to.be.null;
        done();
      });
    });
  });

});