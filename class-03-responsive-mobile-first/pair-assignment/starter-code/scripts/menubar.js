$(function() {
  var size = $( window ).width();
    if (size > 960) {
      $('.menu-items').show();
    } else {
      $('.menu-items').hide();
    }
});

$( window ).on('resize', function() {
  var size = $( window ).width();
  if (size >= 960) {
    $('.menu-items').show();
  } else {
    $('.menu-items').hide();
  }
});
var counter = 0;

$('#ham').on('click', function() {
  $('.menu-items').show();
});
