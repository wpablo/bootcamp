var getDb    = require('mongo-getdb');
var ObjectID = require('mongodb').ObjectID;
var docs     = module.exports;

docs.find = function (query, user, callback) {
  if(!user) return callback(null, []);
  getDb(function (db) {
    db.collection('documents')
      .find({
            content: {
              $regex:   query,
              $options: 'i'
            },
            user: user.id
      }, { limit: 10 })
      .toArray(callback);
  });

};


docs.createNew = function (user, callback) {

  getDb(function (db) {
    db.collection('documents').insert({
      content: 'NEW DOCUMENT',
      user:    user.id
    }, function (err, inserted) {
      if (err) return callback(err);
      var doc = inserted[0];
      callback(null, doc._id.toString());
    });
  
  });

};

docs.getById = function (id, user, callback) {
  getDb(function (db) {
    db.collection('documents')
      .findOne({
        _id: new ObjectID(id),
        user: user.id
      }, callback);
  });
};

docs.save = function (id, doc, user, callback) {
  var change = {};

  if (doc.content){
    change.content = doc.content; 
  }

  if (doc.title) {
    change.title = doc.title;
  }
  
  getDb(function (db) {
    db.collection('documents').update({
      _id: new ObjectID(id),
      user: user.id
    }, {
      $set: change
    }, callback);
  });
};