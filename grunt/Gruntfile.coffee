module.exports = (grunt) ->
  
  utils = (require './gruntcomponents/misc/commonutils')(grunt)
  grunt.task.loadTasks 'gruntcomponents/tasks'
  grunt.task.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.initConfig
    uglify:
      hmapi:
        src: '../jsapp/js/lib/hmapi.js'
        dest: '../jsapp/js/lib/hmapi.min.js'

    coffee:
      hmapi:
        options: {bare: true}
        files: [
          '../jsapp/js/lib/hmapi.coffee'
        ]
        dest: '../jsapp/js/lib/hmapi.js'

    watch:
      hmapi:
        files: '<%= coffee.hmapi.files %>'
        tasks: [ 'coffee:hmapi']
      
  grunt.event.on 'coffee.error', (msg) ->
    utils.growl 'ERROR!!', msg

  grunt.registerTask 'default', ['coffee', 'uglify']

  grunt.registerTask 'dev', ['coffee']
