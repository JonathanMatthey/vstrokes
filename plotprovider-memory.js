var plotCounter = 1;

PlotProvider = function(){};
PlotProvider.prototype.dummyData = [];

PlotProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};

PlotProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  callback(null, result);
};

PlotProvider.prototype.save = function(plots, callback) {
  var plot = null;

  if( typeof(plots.length)=="undefined")
    plots = [plots];

  for( var i =0;i< plots.length;i++ ) {
    plot = plots[i];
    plot._id = plotCounter++;
    plot.created_at = new Date();

    this.dummyData[this.dummyData.length]= plot;
  }
  callback(null, plots);
};


var dummydata = [];

for ( i = 0; i < 4; i++){
  for ( j = 0; j < 9; j++){
    /* Lets bootstrap with dummy data */
    dummydata.push({x: i*300, y: j*100, author: null, image_data: null});
  }
}
console.log(dummydata);

new PlotProvider().save(dummydata, function(error, plots){});

exports.PlotProvider = PlotProvider;

