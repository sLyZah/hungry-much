(($) ->
  $.fn.extend hmapi: (options, arg, callback) ->
    options = $.extend({}, $.hmapi.defaults, options)  if options and typeof (options) is "object"
    
    # this creates a plugin for each element in
    # the selector or runs the function once per
    # selector.  To have it do so for just the
    # first element (once), return false after
    # creating the plugin to stop the each iteration 
    @each ->
      new $.hmapi(this, options, arg, callback)

    $ this

  $.hmapi = (elem, options, arg, callback) ->
    ### get a room by Name ###
    getRoomByName = (arg) ->
      data =
        id: 0
        name: arg
        threshold: 1
        currentClick: 0

      $.hmapi._this.trigger "getRoomByName", data
      data

    ### get a room by Id ###
    GetRoomById = (arg) ->
      data =
        id: arg
        name: ""
        threshold: 1
        currentClick: 0

      $.hmapi._this.trigger "GetRoomById", data
      data

    ### get all rooms ###
    getAllRooms = ->
      module = 'groups'
      method = 'GET'
      param = ''

      console.log $.hmapi.defaults.apiUrl + module

      # ajax call
      $.ajax
        type: method
        data: param
        cache: false
        url: $.hmapi.defaults.apiUrl + module
        async: true
        dataType: "json"
        success: (json) ->
          console.log 'result !!'
          console.log json
          $.hmapi._callback json
          $.hmapi._this.trigger "getAllRooms", json


    ### ---------------- ###
    ### var assignements ###
    ### ---------------- ###
    $.hmapi._this = $ elem

    callback = arg if typeof arg is 'function'
    $.hmapi._callback = callback

    ### ----------------- ###
    ### available methods ###
    ### ----------------- ###
    if options and typeof options is "string"

      if options is "getRoomByName"
        getRoomByName(arg)

      else if options is "GetRoomById"
        GetRoomById(arg)  

      else if options is "getAllRooms"
        getAllRooms()

      return

  $.hmapi.defaults = apiUrl: "http://10.0.2.80:3000/"
  $.hmapi._this = null
  $.hmapi._callback = null
) jQuery