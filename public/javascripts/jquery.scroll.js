(function($){
  $.fn.scrollTo = function(callback){
    var duration = arguments[0] || 1000;
    $('html, body').animate({scrollTop: $(this).offset().top}, duration, callback);
    return $(this);
  };

  $.scrollUpBy = function(amount, callback) {
    var duration = arguments[0] || 250;
    var newPosition = $('html, body').scrollTop() - amount;
    if(newPosition < 0) newPosition = 0;
    $('html, body').animate({scrollTop: newPosition}, duration, callback);
  }
})(jQuery);