$(document).ready(function() {
  // Handler for .ready() called.

  $(function() {
    $.each(['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#000', '#fff'], function() {
      $('#colors_demo .tools').append("<a href='#colors_sketch' data-color='" + this + "' style='width: 10px; background: " + this + ";'></a> ");
    });
    $.each([3, 5, 10, 15], function() {
      $('#colors_demo .tools').append("<a href='#colors_sketch' data-size='" + this + "' style='background: #ccc'>" + this + "</a> ");
    });
    $('#colors_sketch').sketch();
  });

  console.log('vstrokes - done');

  $("#btn-done-sketch").click(function(){
    var image_data = $("#colors_sketch").data('sketch').el.toDataURL('mime/png');
    console.log($("#colors_sketch").data('plot-id'));
    $.ajax({
      type: "POST",
      url: "/addSketch",
      data:  { _id: $("#colors_sketch").data('plot-id'), x: $("#colors_sketch").data('plot-x'), y: $("#colors_sketch").data('plot-y'), author: "John", image_data: image_data },
      success: function(){
        console.log('success ! ');
      },
      dataType: "json"
    });
  });

  $("#show-ori-painting").click(function(){
    console.log('aaa');
    if ($("#canvas").css('background-image') !== "none"){
      $("#canvas").css('background-image','');
    }
    else{
      $("#canvas").css('background-image','url(../images/ori-painting.jpg)');
    }
  });

});