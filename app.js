/**
 * Module dependencies.
 */

var express = require('express');
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;
var PlotProvider = require('./plotprovider-mongodb').PlotProvider;

var app = module.exports = express();

var server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

// check we're on heroku
if (process.env.MONGOLAB_URI !== undefined ){
  io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });
}
else{
  // local socket io

  // socket io server
  server.listen(7666);

}
// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var articleProvider= new ArticleProvider();

console.log('new plotp');
var plotProvider= new PlotProvider('localhost', 27017);

// Routes

app.get('/', function(req, res){

  // 
  // plotProvider.getAvailablePlot();
  // 
    plotProvider.findEmptyPlot( function(error,emptyPlot){
      console.log('emptyPlot');
      console.log(emptyPlot.y);
      console.log(emptyPlot.x);
      console.log(emptyPlot.author);
        res.render('index.jade', { 
            title: 'Blog',
            emptyPlot: emptyPlot
        });
    })

});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});



app.post('/addSketch', function(req, res) {
  
  // console.log(req.param('_id'));
  // console.log("image_data:" + req.param('image_data'));
  // console.log("author:" + req.param('author'));
  // console.log("completed_at:" );

  var plotData = {_id: req.param('_id'),
    x: req.param('x'),
    y: req.param('y'),
    author: req.param('author'),
    image_data: req.param('image_data'),
    state: "drawn"
  };
  console.log(' plot received - _id:' + plotData._id + ' author:' + plotData.author + ' - x:' + plotData.x + ' y:' + plotData.y);

  plotProvider.updatePlot(plotData, function(error, plot){
    plotProvider.getEmptyPlotsCount(function(error, plotCount){
      // update canvas count
      io.sockets.emit('news', { 'plot': plot, 'plotCount' : plotCount });
    });
  });
});

app.get('/canvas', function(req, res){
    plotProvider.getEmptyPlotsCount(function(error, plotCount){
      // update canvas count
      plotProvider.findAll( function(error,plots){
          res.render('canvas.jade', { 
              title: 'Blog',
              plots: plots,
              emptyPlotCount: plotCount
          });
      });
    });
});

app.get('/clear-plots', function(req, res){
  console.log('clearing plots');
  plotProvider.clearCollection(function(error, plots){
    console.log(' done - clearing plots');
  }); 
});

app.get('/generate-plots', function(req, res){
  console.log('generating plots:');
  var dummydata = [];

  for ( i = 0; i < 4; i++){
    for ( j = 0; j < 9; j++){
      /* Lets bootstrap with dummy data */
      dummydata.push({state: "blank", x: i*300, y: j*100, author: null, image_data: null});
    }
  }

  console.log(dummydata);
  plotProvider.save(dummydata, function(error, plots){});
  console.log(' done - generated ' + dummydata.length + ' plots');
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode",  port, app.settings.env);
});