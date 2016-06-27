module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n',
        banner: '/*! Made on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      basic: {
        src: ['public/javascripts/**/*.js'],
        dest: 'public/main/myApp.js',
      }
    },
    uglify: {
      options: {
        banner: '/*! Made on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      basic: {
        files: {
          'public/main/myApp.min.js': ['<%= concat.basic.dest %>']
        }
      }
    },
    concat_css: {
      options: {
        banner: '/*! Made on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      all: {
        src: ['public/stylesheets/css/**/*.css'],
        dest: 'public/main/myApp.css',
      }
    },
    cssmin: {
      options: {
        keepSpecialComments: 0,
        banner: '/*! Made on <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      site: {
        src: ['public/main/myApp.css'],
        dest: 'public/main/myApp.min.css'
      }
    },
    jshint: {
      files: ['app.js', 'gruntfile.js', 'routes/**/*.js', 'library/**/*.js', 'config/**/*.js', 'test/**/**/*.js'],
      options: {
        // options here to override JSHint defaults
        "esversion" : 6,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          boss: true,
          eqnull: true,
          node: true,
          strict: false,
          mocha: true

        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false, 
          colors: true,
          clearRequireCache: true 
        },
        src: ['test/**/**/*.js']
      }
    },
    watch: {
      js: {
        files: ['public/javascripts/**/*.js'],
        tasks: ['concat:basic', 'uglify'],
        options: {
          livereload: true,
        }
      },
      css: {
        files: ['public/stylesheets/css/**/*.css'],
        tasks: ['concat_css', 'cssmin'],
        options: {
          nospawn: false
        }
      },
      test_js: {
        options: {
          spawn: true,
          interrupt: true,
          debounceDelay: 250,
        },
        files: ['test/**/**/*.js'],
        tasks: ['mochaTest']
      },
      js_hint: {
        options: {
          nospawn: false
        },
        files: ['app.js', 'gruntfile.js', 'routes/**/*.js', 'library/**/*.js', 'config/**/*.js', 'test/**/**/*.js'],
        tasks: ['jshint']
      }

    },
    nodemon: {
      dev: {
        script: 'bin/www',
        ignore:  ['node_modules/**','bower_components/**','public/**']
      }
    },
    concurrent: {
      dev: {
        tasks: ['watch:js', 'watch:css', 'watch:test_js', 'watch:js_hint', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', '', function () {
    var taskList = [
      'concat:basic',
      'uglify',
      'concat_css',
      'cssmin',
      'jshint',
      'concurrent'
    ];
    grunt.task.run(taskList);
  });

};