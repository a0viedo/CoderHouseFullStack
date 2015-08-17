var Mongo = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/instroo';

var itemModel = {
    insert: function(item, callback) {
        Mongo.connect(dbURL, function(err, db) {
            db.collection('items').insert(item, function(err) {
                db.close();
                callback(err);
            });
        });
    },
    get: function(itemId, callback) {

        Mongo.connect(dbURL, function(err, db) {
            db.collection('items').findOne({
                id: itemId
            }, function(err, item) {
                db.close();
                callback(err, item);
            });
        });
    },
    search: function(keyword, callback) {
        var items = [];

        Mongo.connect(dbURL, function(err, db) {
            var cursor = db.collection('items').find({
                description: {
                    $regex: 'teclado|casio' ,
                    $options: "i"
                },
                title: {
                    $regex: keyword,
                    $options: "i"
                }
            });
            cursor.on('data', function(doc) {
                items.push(doc);
            });

            cursor.on('error', function(err) {
                console.log(err);
            });

            cursor.on('end', function() {
                callback(err, items);
                db.close();
            });
        });
    }
};

module.exports = itemModel;