/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var path = require('path');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'mustache'

module.exports = function (grunt) {
  'use strict';

  var LIVERELOAD_PORT = 35729;
  var SERVER_PORT = 9000;

  var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
  var mountFolder = function (connect, dir) {
    return connect.static(path.resolve(dir));
  };

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // load npm tasks
  grunt.loadNpmTasks('intern');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    strings: {
      src: 'app/bower_components/FindMyDevice-l10n/locale',
      dest: 'locale'
    },
    test: 'test',
    tmp: '.tmp'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    // AUTOPREFIXER TASK
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 5 versions', 'ff >= 16', 'Explorer >= 8']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.tmp %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= yeoman.tmp %>/styles/'
        }]
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= yeoman.app %>/styles/'
        }]
      }
    },

    // BOWER TASK
    bower: {
      all: {
        rjsConfig: '<%= yeoman.app %>/scripts/main.js'
      }
    },

    // CLEAN TASK
    clean: {
      dist: [
        '<%= yeoman.tmp %>',
        '<%= yeoman.dist %>/*'
      ],
      server: '<%= yeoman.tmp %>'
    },

    // CONNECT TASK
    connect: {
      options: {
        port: SERVER_PORT,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, yeomanConfig.tmp),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, yeomanConfig.tmp),
              mountFolder(connect, yeomanConfig.test),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },

    // COPY TASK
    copy: {
      strings: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.strings.src %>',
          dest: '<%= yeoman.strings.dest %>',
          src: [
            '**/*.po'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'images/{,*/}*.{png,jpg,jpeg,webp,gif}',
            'styles/fonts/{,*/}*.*',
            'index.html'
          ]
        },
        // Copy these files into tmp so that concat can find them
        {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.tmp %>',
          src: [
            'bower_components/normalize-css/normalize.css'
          ]
        }]
      }
    },

    // COPYRIGHT TASK
    copyright: {
      app: {
        options: {
          pattern: 'This Source Code Form is subject to the terms of the Mozilla Public'
        },
        src: [
          '<%= jshint.all %>'
        ]
      }
    },

    // CSSLINT TASK
    csslint: {
      strict: {
        options: {
          'csslintrc': '.csslintrc'
        },
        src: [
          '{<%= yeoman.tmp %>,<%= yeoman.app %>}/styles/**/*.css'
        ]
      }
    },

    // CSSMIN TASK
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '<%= yeoman.tmp %>/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },

    // HTMLLINT TASK
    htmllint: {
      options: {
        ignore: [
          'Bad value “token” for attribute “name” on XHTML element “meta”: Keyword “token” is not registered.',
          'Bad value “X-UA-Compatible” for attribute “http-equiv” on XHTML element “meta”.',
          'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          'Text not allowed in XHTML element “ul” in this context.',
          'XHTML element “head” is missing a required instance of child element “title”.'
        ]
      },
      dist: [
        '<%= yeoman.dist %>/*.html',
        '<%= yeoman.dist %>/scripts/templates/*.html'
      ]
    },

    // HTMLMIN TASK
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // INTERN TASK
    intern: {
      all: {
        options: {
          runType: 'runner',
          config: 'test/intern'
        }
      }
    },

    // JSCS TASK
    jscs: {
      options: {
        config: '.jscsrc'
      },
      all: '<%= jshint.all %>'
    },

    // JSHINT TASK
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
        '<%= yeoman.test %>/{,*/}*.js'
      ]
    },

    // JSONLINT TASK
    jsonlint: {
      all: [
        '{,app/**,test/**}*.json',
        '!app/bower_components/*'
      ],
      configs: [
        '.bowerrc',
        '.csslintrc',
        '.jscsrc',
        '.jshintrc',
        '.yo-rc.json',
        'test/.bowerrc'
      ]
    },

    // OPEN TASK
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      },
      test: {
        path: 'http://localhost:<%= connect.test.options.port %>'
      }
    },

    // REQUIREJS TASK
    requirejs: {
      dist: {
        options: {
          almond: true,
          baseUrl: '<%= yeoman.app %>/scripts',
          dir: '<%= yeoman.dist %>/scripts',
          mainConfigFile: '<%= yeoman.app %>/scripts/main.js',
          name: 'main',
          preserveLicenseComments: false,
          removeCombined: true,
          replaceRequireScript: [{
            files: ['<%= yeoman.dist %>/index.html'],
            module: 'main',
            modulePath: '/scripts/almond' // `almond: true` causes the output file to be named almond.js
          }],
          stubModules: ['text', 'stache'],
          useStrict: true
        }
      }
    },

    // REV TASK
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/styles/fonts/{,*/}*.*',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
          ]
        }
      }
    },

    // SASS TASK
    sass: {
      options: {
        imagePath: '../images'
      },
      dist: {
        files: {
          '<%= yeoman.tmp %>/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
        }
      },
      dev: {
        files: {
          '<%= yeoman.app %>/styles/main.css': '<%= yeoman.app %>/styles/main.scss'
        }
      }
    },

    // USEMIN TASK
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
      options: {
        dirs: ['<%= yeoman.dist %>'],
        patterns: {
          js: [
            [/(\.\.\/images\/.*?\.png)/gm, 'Update the JS to reference revved images']
          ]
        }
      }
    },

    // USEMINPREPARE TASK
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // WATCH TASK
    watch: {
      options: {
        nospawn: true,
        livereload: true
      },
      sass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.scss'],
        tasks: [
          'sass:dev',
          'autoprefixer:dev'
        ],
        options: {
          atBegin: true
        }
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '{<%= yeoman.tmp %>,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{<%= yeoman.tmp %>,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
          '<%= yeoman.app %>/scripts/templates/*.{ejs,mustache,hbs}',
          '<%= yeoman.test %>/spec/**/*.js'
        ]
      },
      test: {
        files: [
          '<%= yeoman.app %>/scripts/{,*/}*.js',
          '<%= yeoman.test %>/spec/**/*.js'
        ],
        tasks: ['test:true']
      }
    }
  });

  // BUILD TASK
  grunt.registerTask('build', [
    'clean:dist',
    'css',
    'useminPrepare',
    'copy',
    'concat',
    'cssmin',
    'requirejs',
    'rev',
    'usemin'
  ]);

  // CSS TASK
  grunt.registerTask('css', [
    'sass',
    'autoprefixer'
  ]);

  // DEFAULT TASK
  grunt.registerTask('default', [
    'lint:prebuild',
    'build',
    'lint:postbuild',
    'test'
  ]);

  // LINT TASK
  grunt.registerTask('lint', function (target) {
    switch (target) {
      case 'prebuild':
        return grunt.task.run([
          'jshint',
          'jscs',
          'jsonlint',
          'copyright'
        ]);
      case 'postbuild':
        return grunt.task.run([
          'htmllint'
        ]);
      default:
        return grunt.task.run([
          'lint:prebuild'
        ]);
    }
  });

  // SERVE TASK
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'open:server',
        'connect:dist:keepalive'
      ]);
    }

    if (target === 'test') {
      return grunt.task.run([
        'clean:server',
        'connect:test',
        'open:test',
        'watch:livereload'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'sass:dev',
      'autoprefixer',
      'connect:livereload',
      'open:server',
      'watch'
    ]);
  });

  // SERVER TASK
  grunt.registerTask('server', 'The `server` task has been deprecated. Use `grunt serve` to start a server.', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  // TEST TASK
  grunt.registerTask('test', [ 'intern' ]);

  // load grunt tasks from ./grunttasks
  grunt.loadTasks('grunttasks');
};
