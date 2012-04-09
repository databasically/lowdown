/*
 *  jquery.status.js
 *
 *  dependencies: jquery 1.3.2 or newer, jquery.template
 *
 *  --------------------------------------------------------------------------
 *
 *  Allows you to display a status message when submiting a form or clicking a link.
 *  To use, simply add the following:
 *
 *    $('a, form').status();
 *
 *  And then add an "onsubmit_status" to each form or "onclick_status" to each link
 *  that you want to display a status message on submit for:
 *
 *    <form onsubmit_status="Saving changes" ...>
 *
 *  To trigger the status window in another script or callback:
 *
 *    $.status.show('Working...');
 *
 *  To hide the status window:
 *
 *    $.status.hide();
 *
 *  Based on John Long's status.js for Prototype/LowPro.
 *
 *  --------------------------------------------------------------------------
 *
 *  Copyright (c) 2009 Sean Cribbs
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a
 *  copy of this software and associated documentation files (the "Software"),
 *  to deal in the Software without restriction, including without limitation
 *  the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *  and/or sell copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 *  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *  DEALINGS IN THE SOFTWARE.
 *
 */

(function($){
  // Cribbed and modified from prototype.js
  document.viewport = {
    getDimensions: function() {
      // Works in most browsers except Safari < 3 and Opera < 9.5, which are
      // both outdated. Ignore them for now.
      return {
        'width': document.documentElement.clientWidth,
        'height': document.documentElement.clientHeight
      };
    },

    getWidth: function() {
      return this.getDimensions().width;
    },

    getHeight: function() {
      return this.getDimensions().height;
    },

    getScrollOffsets: function() {
      return {
        'left': (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft),
        'top': (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
      };
    }
  };

  var status = {
    cornerThickness: 12,
    spinnerImage: '/images/status_spinner.gif',
    spinnerImageWidth: 32,
    spinnerImageHeight: 33,
    backgroundImage: '/images/status_background.png',
    topLeftImage: '/images/status_top_left.png',
    topRightImage: '/images/status_top_right.png',
    bottomLeftImage: '/images/status_bottom_left.png',
    bottomRightImage: '/images/status_bottom_right.png',
    modal: true
  }

  status.backgroundImages = function(){
    return [
      status.spinnerImage,
      status.backgroundImage,
      status.topLeftImage,
      status.topRightImage,
      status.bottomLeftImage,
      status.bottomRightImage
    ];
  };

  status.preloadImages = function(){
    if (!status.imagesPreloaded) {
      $.each(status.backgroundImages(), function(i,src) {
        var image = new Image();
        image.src = src;
      });
      status.preloadedImages = true;
    }
  };

  status.buildWindow = function(){
    if($('table.status_window').length != 0) return;
    if(!status.windowTemplate)
      status.windowTemplate = $.template('\
        <table class="status_window" style="display: none; position: absolute; border-collapse: collapse; padding: 0px; margin: 0px; z-index: 10000">\
          <tbody>\
            <tr>\
              <td style="background: url(${topLeftImage}); height: ${cornerThickness}px; width: ${cornerThickness}px; padding: 0px;"></td>\
              <td style="background: url(${backgroundImage}); height: ${cornerThickness}px; padding: 0px;"></td>\
              <td style="background: url(${topRightImage}); height: ${cornerThickness}px; width: ${cornerThickness}px; padding: 0px;"></td>\
            </tr>\
            <tr>\
              <td style="background: url(${backgroundImage}); width: ${cornerThickness}px; padding: 0px;"></td>\
              <td class="status_content" style="background: url(${backgroundImage}); padding: 0px ${cornerThickness}px;">\
                <table border="0" cellpadding="0" cellspacing="0" style="table-layout: auto">\
                  <tbody>\
                    <tr>\
                      <td style="width: ${spinnerImageWidth}px"><img src="${spinnerImage}" width="${spinnerImageWidth}" height="${spinnerImageHeight}" alt="" /></td>\
                      <td style="padding-left: ${cornerThickness}px;"><div></div></td>\
                    </tr>\
                  </tbody>\
                </table>\
              </td>\
              <td style="background: url(${backgroundImage}); width: ${cornerThickness}px; padding: 0px;"></td>\
            </tr>\
            <tr>\
              <td style="background: url(${bottomLeftImage}); height: ${cornerThickness}px; width: ${cornerThickness}px; padding: 0px;"></td>\
              <td style="background: url(${backgroundImage}); height: ${cornerThickness}px; padding: 0px;"></td>\
              <td style="background: url(${bottomRightImage}); height: ${cornerThickness}px; width: ${cornerThickness}px; padding: 0px;"></td>\
            </tr>\
          </tbody>\
        </table>');
      $(document.body).append(status.windowTemplate.apply(status));
  };

  status.hide = function(){
    if (status.modal) status.hideOverlay();
    return $('table.status_window').fadeOut(250);
  };

  status.show = function(){
    status.buildWindow();
    if(arguments[0])
      $('.status_content div').text(arguments[0]);
    if(status.modal) status.showOverlay();
    return $('table.status_window').show().centerInViewport();
  };

  status.buildOverlay = function(){
    if($('div.status_overlay').length != 0)
      return;
    $('body').append($.template('<div class="status_overlay" style="display: none; position: absolute; background-color:white; top:0px; left:0px; z-index:100; height: ${height}px; width: ${width}px; opacity: 0.01"></div>').apply(document.viewport.getDimensions()));
  };

  status.showOverlay = function(){
    status.buildOverlay();
    return $('.status_overlay').show();
  };

  status.hideOverlay = function(){
    return $('.status_overlay').hide();
  };

  $(status.preloadImages);

  $.extend({status: status});
  $.fn.extend({
    status: function(){
      if($(this).is('a[onclick_status]'))
        $(this).click(function(){ status.show($(this).attr('onclick_status')); });
      if($(this).is('form[onsubmit_status]'))
        $(this).submit(function(){ status.show($(this).attr('onsubmit_status')); });
    },
    centerInViewport: function(){
      var offsets = document.viewport.getScrollOffsets();
      $(this).css({
        'left': parseInt((document.viewport.getWidth() - $(this).outerWidth()) / 2) + 'px',
        'top': parseInt((document.viewport.getHeight() - $(this).outerHeight()) / 2.2) + 'px',
        'position': 'fixed'
      });
      return this;
    }
  });
  $(document.body).ajaxStop(function(){
    // Hide status window when all Ajax requests finish
    $.status.hide();
  });
})(jQuery);