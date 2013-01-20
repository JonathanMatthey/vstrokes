$(document).ready(function() {
  // Handler for .ready() called.

  $("#show-ori-painting").click(function(){
    console.log('aaa');
    if ($("#canvas").css('background-image') !== "none"){
      $("#canvas").css('background-image','');
    }
    else{
      $("#canvas").css('background-image','url(../images/ori-painting.jpg)');
    }
  });

  var socket = io.connect('http://localhost:7666');

  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
    $("#empty-plots-count").html(data.plotCount); 

    // paint new plot on canvas
    $("#"+data.plot._id).attr('src',data.plot.image_data);
  });

});