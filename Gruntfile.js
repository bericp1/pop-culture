'use strict';

var matchdep = require('matchdep');

/**
 * @param {{util, loadTasks, loadNpmTasks, initConfig, renameTask, registerTask, file:{readJSON}}} grunt
 */
module.exports = function (grunt) {
  // load all grunt tasks
  matchdep.filter('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('tasks');

  grunt.initConfig({

    //General tasks

    shell:{
      theme:{
        command:function(toWhich){
          var bootswatchDir = 'public/vendor/bootswatch/';
          var activeDir = 'active-theme';
          var cmd = '';
          if(typeof toWhich === 'string' && toWhich !== 'list'){
            cmd = 'rm -rf "' + bootswatchDir + activeDir + '"; ' +
              'ln -s "' + toWhich + '" "' + bootswatchDir + activeDir + '"';
          }else{
            cmd = 'ls "' + bootswatchDir + '"';
          }
          console.log('Running: ', cmd.blue);
          return cmd;
        },
        options:{
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      templates: {
        files: 'public/**/*.tmpl',
        tasks: ['ngtemplates:dev']
      },
      index: {
        files: 'public/index.html'
      },
      js: {
        files: 'public/**/*.js'
      },
      css: {
        files: '{public,.tmp}/**/*.css'
      },
      less: {
        files: 'public/**/*.less',
        tasks: ['less:dev']
      },
      images: {
        files: 'public/**/*.{png,jpg,jpeg,gif,webp,svg}'
      },
      fonts: {
        files: 'public/**/*.{woff,otf,ttf,eot}'
      },
      server:{
        files: ['app.js', 'routes/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
        tasks: ['express:dev'],
        options: {
          nospawn: true
        }
      }
    },

    express: {
      options: {
        script: 'app.js',
        output: '^Listening'
      },
      dev: {
        options: {
          port: 8000,
          'node_env': 'development'
        }
      }
    },


    clean: {
      tmp: '.tmp',
      prod: [
        '**/README.md',
        'tasks',
        '*.log',
        'public/*',
        'dest',
        'tmp',
        '!public/favicon.ico',
        '!public/index.html',
        '!public/scripts*.js',
        '!public/styles*.css',
        '!public/vendor',
        '!public/assets',
        '!node_modules/**/*',

        '!public/presentation'
      ]
    },

    //Build-related Tasks
    jshint: {
      options: {
        node: true,
        esnext: true,
        es5: true,
        bitwise: true,
        camelcase: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        nonew: true,
        quotmark: 'single',
        regexp: true,
        trailing: true,
        undef: true,
        unused: true
      },
      dev: [
        'Gruntfile.js',
        'tasks/**/*.js'
      ],
      client: {
        src: ['public/**/*.js', '!public/vendor/**/*.js', '!public/presentation/**/*.js'],
        options: {
          browser: true,
          node: false,
          esnext: false,
          strict: true,
          globals: {
            angular: false,
            '$': false,
            jQuery: false,
            console: false
          }
        }
      },
      server: ['app.js', 'routes/**/*.js']
    },
    ngtemplates: {
      options: {
        module: {
          name: 'compiled-templates',
          define: true
        },
        base: 'public'
      },
      prod: {
        src: 'public/**/*.tmpl',
        dest: 'public/assets/js/templates.js'
      },
      dev: {
        src: 'public/**/*.tmpl',
        dest: '.tmp/assets/js/templates.js'
      }
    },
    less:{
      dev:{
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: ['**/*.less', '!vendor/**/*'],
            dest: '.tmp/',
            ext: '.css'
          }
        ]
      },
      prod:{
        files: [
          {
            expand: true,
            cwd: 'public/',
            src: ['**/*.less', '!vendor/**/*'],
            dest: 'public/',
            ext: '.css'
          }
        ]
      }
    },
    useminPrepare: {
      html: 'public/index.html',
      options: {
        dest: 'public'
      }
    },
    usemin:{
      html: 'public/index.html',
      options:{
        base: 'public'
      }
    },
    filerev: {
      prod:{
        src: ['public/scripts.js','public/styles.css']
      }
    }
  });

  grunt.registerTask('dev', [
    'clean:tmp',
    'ngtemplates:dev',
    'less:dev',
    'loadenv',
    'express:dev',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:tmp',
    'jshint',
    'ngtemplates:prod',
    'less:prod',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'filerev:prod',
    'usemin',
    'clean:prod'
  ]);

  grunt.registerTask('heroku:production', ['build']);

  grunt.registerTask('default', ['dev']);
};
