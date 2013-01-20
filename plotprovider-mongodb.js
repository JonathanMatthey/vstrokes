var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

// local connect
var host;
var port;

var plotCounter = 1;

function connectToMongoDB(callback){
    if (process.env.MONGOLAB_URI !== undefined ){

    var mongostr = process.env.MONGOLAB_URI;

    mongo.connect(mongostr, {}, function(error, db)
    {       
      console.log('error');
      console.log(error);
      console.log('db');
      console.log("connected, db: " + db);

      this.db = db;

      this.db.addListener("error", function(error){
        console.log("Error connecting to MongoLab");
      });
      callback();
    });
  }
  else{
    // local connect
    this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){
      callback();
    });
  }
}

PlotProvider = function(host2, port2) {
  host = host2;
  port = port2;

  // this.db= new Db('node-mongo-blog', new Server(host2, port2, {auto_reconnect: true}, {}));
  // this.db.open(function(){});
};

PlotProvider.prototype.dummyData = [];

PlotProvider.prototype.getCollection = function(callback) {
  console.log('getCollection()');
  connectToMongoDB(function(){
    this.db.collection('plots', function(error, plot_collection) {
      if( error ) callback(error);
      else callback(null, plot_collection);
    });
  });
};

PlotProvider.prototype.findEmptyPlot = function(callback) {
    this.getCollection(function(error, plot_collection) {
      if( error ) callback(error)
      else {
        // improve this by adding a key / randomindex field to each record / object in DB.
        // http://cookbook.mongodb.org/patterns/random-attribute/
        plot_collection.find({"state":"blank"}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results[Math.floor(Math.random()*results.length)])
        });
      }
    });
};

PlotProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, plot_collection) {
      if( error ) callback(error)
      else {
        plot_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

PlotProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, plot_collection) {
      if( error ) callback(error)
      else {
        plot_collection.findOne({_id: plot_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

PlotProvider.prototype.save = function(plots, callback) {
    this.getCollection(function(error, plot_collection) {
      if( error ) callback(error)
      else {
        if( typeof(plots.length)=="undefined")
          plots = [plots];

        for( var i =0;i< plots.length;i++ ) {
          plot = plots[i];
          plot.created_at = new Date();

        }

        plot_collection.insert(plots, function() {
          callback(null, plots);
        });
      }
    });
};

PlotProvider.prototype.updatePlot = function(drawnPlot, callback) {
    this.getCollection(function(error, plot_collection) {
      if( error ) callback(error)
      else {


        plot_collection.save(drawnPlot, function() {
          callback(null, drawnPlot);
        });

      }
    });
};



exports.PlotProvider = PlotProvider;

