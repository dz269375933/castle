var MongoClient = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017';
module.exports = {
    insertOne: insertOne,
    insertMany: insertMany,
    queryList:queryList
}

function insertOne(property) {
    MongoClient.connect(dbURL, (err, db) => {
        if (err) throw err;
        // console.log("MongoDB connect……");
        var dbase = db.db('castle');
        dbase.collection("michelin").insertOne(property, (err, res) => {
            if (err) throw err;
            db.close();
        })
    })
}

function insertMany(propertys) {
    MongoClient.connect(dbURL, (err, db) => {
        if (err) throw err;
        // console.log("MongoDB connect……");
        var dbase = db.db('castle');
        dbase.collection("michelin").insertMany(property, (err, res) => {
            if (err) throw err;
            db.close();
        })
    })
}
function queryList(){
    return new Promise((resolve,reject) =>{
        MongoClient.connect(dbURL,function(err, db) {
            if (err) throw err;

            var dbase = db.db('castle');

            dbase.collection("michelin").find({}).toArray(function(error, docs) {
                resolve(docs);
                db.close();
            })
        })
    } );
}