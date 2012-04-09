(function($){
   $.fn.autocomplete = function(options){
     var $this = $(this);

     var opts = $.extend({
         param: $this.attr('name'),
         url: $this.parents('form').attr('action'),
         template: '<li><span class="value">${value}</span></li>',
         valueSelector: 'span.value',
         itemSelector: 'li',
         delay: 250,
         itemsKey: 'values',
         highlightClass: 'selected'
       }, options);

     // Setup DOM for autocomplete
     var $list = $('<ul class="autocomplete" />').hide();
     $this.after($list);
     $list.click(function(e){
                   var $target = $(e.target);
                   var self = $target.filter(opts.valueSelector);
                   var siblings = $target.siblings(opts.valueSelector);
                   var children = $target.find(opts.valueSelector);
                   self.add(siblings).add(children)
                   complete(self);
                   e.preventDefault();
                 });

     // Ajax callback to fill autocomplete
     var ajaxCallback = function(){
       var params = {};
       params[opts.param] = $this.val();
       $.getJSON(opts.url, params, function(data){
                   $list.empty();
                   if(opts.itemsKey)
                     data = data[opts.itemsKey];
                   if(data.length > 0){
                     $.each(data, function(i,item){
                              $list.append($.template(opts.template).apply(item));
                     });
                     $list.fadeIn(200);
                   } else
                     $list.fadeOut(200);
                 });
     };

     var complete = function(value){
       if(value.length > 0){
         $this.val(value.text());
         $list.empty().hide();
       }
     };

     var highlight = function(which){
       $list.find(opts.itemSelector).removeClass(opts.highlightClass);
       $($list.find(opts.itemSelector).eq(which)).addClass(opts.highlightClass);
     };

     var highlightPrev = function(){
       var selected = $list.find('.' + opts.highlightClass);
       if(selected.length == 0){
         highlight(0);
       } else {
         var items = $list.find(opts.itemSelector);
         var currindex = items.index(selected);
         highlight((currindex + items.length - 1) % items.length);
       }
     };

     var highlightNext = function(){
       var selected = $list.find('.' + opts.highlightClass);
       if(selected.length == 0) {
         highlight(0);
       } else {
         var items = $list.find(opts.itemSelector);
         var currindex = items.index(selected);
         highlight((currindex + 1) % items.length);
       }
     };

     var scheduleAutocomplete = function(){
       clearTimeout($this.data('autocomplete_timeout'));
       $this.data('autocomplete_timeout', setTimeout(ajaxCallback, opts.delay));
     };

     $this.keydown(function(e){
                   switch(e.keyCode){
                   case 27: // Esc key
                     $list.fadeOut(200); break;
                   case 37: case 38: // Up or Left arrow keys
                     highlightPrev(); e.preventDefault(); break;
                   case 39: case 40: // Down or Right arrow keys
                     highlightNext(); e.preventDefault(); break;
                   case 9: case 13: // Tab and enter keys - select the item
                     var highlighted = $list.find("." + opts.highlightClass);
                     if(highlighted.length > 0){
                       e.preventDefault();
                       complete(highlighted.find(opts.valueSelector));
                     }
                     if(e.keyCode == 13 && $list.is(':visible'))
                       e.preventDefault();
                     break;
                   default:
                     scheduleAutocomplete();
                   }});

     $this.focus(function(){
                   if($list.find(opts.itemSelector).length > 0){
                     $list.fadeIn(200).find(opts.itemSelector).removeClass(opts.highlightClass);
                   }
                 });

     $this.blur(function(){
                  setTimeout(function(){ $list.fadeOut(200); }, opts.delay);
                });
   };
})(jQuery);