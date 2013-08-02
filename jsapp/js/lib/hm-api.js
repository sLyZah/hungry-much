;(function($) {

    $.fn.extend({
        hmapi: function(options, arg, callback) {
          if (options && typeof(options) == 'object') {
              options = $.extend( {}, $.hmapi.defaults, options );
          }

          // this creates a plugin for each element in
          // the selector or runs the function once per
          // selector.  To have it do so for just the
          // first element (once), return false after
          // creating the plugin to stop the each iteration 
          this.each(function() {
              new $.hmapi(this, options, arg, callback );
          });

          return $(this);
        }
    });

    $.hmapi = function( elem, options, arg, callback ) {

      var _this = $(elem);

      if (options && typeof(options) == 'string') {

         if (options == 'getRoomByName') {
             callback(getRoomByName(arg));
         }
         else if (options == 'GetRoomById') {
             callback(GetRoomById(arg));
         }
         return;
      }

      function getRoomByName(arg)
      {
          var data = {
            id: 0,
            name: arg,
            threshold:1,
            currentClick:0
          };

          _this.trigger('getRoomByName', data);
          return data ;
      }

      function GetRoomById(arg)
      {
          var data = {
            id: arg,
            name: '',
            threshold:1,
            currentClick:0
          };

          _this.trigger('GetRoomById', data);
          return data ;
      }
    };

    $.hmapi.defaults = {};

})(jQuery);