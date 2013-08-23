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
    ### update a user ###
    updateUserById = (arg) ->
      module = 'users'
      method = 'PUT'
      id = arg.id if arg.id? else throw new Error "updateUserById(): argument.id must be set (user id)"
      data = {}
      data.name = arg.name if arg.name?
      data.email = arg.email if arg.email?

      # ajax call
      $.ajax
        type: method
        cache: false
        data: data
        url: $.hmapi.defaults.apiUrl + module + '/'+ id
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "updateUserById", json

    ### get a user by Id ###
    getUserById = (arg) ->
      module = 'users'
      method = 'GET'
      id = arg if arg? and typeof arg is 'int' else throw new Error "getUserById(): argument must be user id "

      # ajax call
      $.ajax
        type: method
        cache: false
        url: $.hmapi.defaults.apiUrl + module + '/'+ id
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "getUserById", json

    ### add a user in db ###
    addUser = (arg) ->
      module = 'users'
      method = 'POST'
      data = {}
      data.name = arg.name if arg.name? else throw new Error "addUser(): argument.name must be set"
      data.email = arg.email if arg.email? else throw new Error "addUser(): argument.email must be set"

      # ajax call
      $.ajax
        type: method
        cache: false
        data: data
        url: $.hmapi.defaults.apiUrl + module
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "addUser", json

    ### get all rooms ###
    getAllGroup = ->
      module = 'groups'
      method = 'GET'

      # ajax call
      $.ajax
        type: method
        cache: false
        url: $.hmapi.defaults.apiUrl + module
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "getAllGroup", json

    getGroupByName = (arg) ->
      module = 'groups'
      method = 'GET'
      data = {}
      data.name = arg if arg? else throw new Error "getGroupByName(): argument must be name (group name)"

      # ajax call
      $.ajax
        type: method
        cache: false
        data: data
        url: $.hmapi.defaults.apiUrl + module
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "getGroupByName", json

    getGroupById = (arg) ->
      module = 'groups'
      method = 'GET'
      data = {}
      id = arg if arg? else throw new Error "getGroupById(): argument must be id (group id)"

      # ajax call
      $.ajax
        type: method
        cache: false
        url: $.hmapi.defaults.apiUrl + module + '/' + id
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "getGroupById", json

    addGroup = (arg) ->
      module = 'groups'
      method = 'POST'
      data = {}
      data.name = arg.name if arg.name? else throw new Error "addGroup(): argument.name must be set"
      data.admin = arg.admin if arg.admin? else throw new Error "addGroup(): argument.admin must be set (user id)"
      data.treshold = arg.treshold if arg.treshold?

      # ajax call
      $.ajax
        type: method
        cache: false
        data: data
        url: $.hmapi.defaults.apiUrl + module
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "addGroup", json

    userIsHungryInGroupId = (arg) ->
      module = 'clicks'
      method = 'POST'
      data = {}
      data.userId = arg.userId if arg.userId? else throw new Error "userIsHungryInGroupId(): argument.userId must be set"
      data.groupId = arg.groupId if arg.groupId? else throw new Error "userIsHungryInGroupId(): argument.groupId must be set"

      # ajax call
      $.ajax
        type: method
        cache: false
        data: data
        url: $.hmapi.defaults.apiUrl + module
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "userIsHungryInGroupId", json

    addUserInGroup = (arg) ->
      module = 'groups'
      method = 'POST'
      data.userId = arg.userId if arg.userId? else throw new Error "addUserInGroup(): argument.userId must be set"
      id = arg.groupId if arg.groupId? else throw new Error "addUserInGroup(): argument.groupId must be set"

      # ajax call
      $.ajax
        type: method
        cache: false
        data: data
        url: $.hmapi.defaults.apiUrl + module + '/' + id + '/users'
        async: true
        dataType: "json"
        success: (json) ->
          $.hmapi._callback json
          $.hmapi._this.trigger "userIsHungryInGroupId", json

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

      if options is "editUserById"
        editUserById(arg)
      else if options is "getUserById"
        getUserById(arg)
      else if options is "addUser"
        addUser(arg)
      else if options is "getAllGroup"
        getAllGroup()
      else if options is "getGroupByName"
        getGroupByName(arg)
      else if options is "getGroupById"
        getGroupById(arg)
      else if options is "addGroup"
        addGroup(arg)
      else if options is "userIsHungryInGroupId"
        userIsHungryInGroupId(arg)
      else if options is "addGroupInUser"
        addGroupInUser(arg)
      else if options is "addUserInGroup"
        addUserInGroup(arg)
      else
        throw new Error options + "(): method not available"
      return

  $.hmapi.defaults = apiUrl: "http://10.0.2.80:3000/"
  $.hmapi._this = null
  $.hmapi._callback = null
) jQuery