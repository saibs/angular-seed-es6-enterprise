'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    config: {
      // configurable paths
      appPath: require('./bower.json').appPath || 'app',
      distPath: 'dist'
    },

    watch: {
      injectCss: {
        files: [
          '<%= config.appPath %>/**/*.css'
        ],
        tasks: ['injector:css']
      },
      jsTest: {
        files: [
          '<%= config.appPath %>/**/*.spec.js',
          '<%= config.appPath %>/**/*.mock.js'
        ],
        tasks: ['eslint', 'karma']
      },
      injectLess: {
        files: [
          '<%= config.appPath %>/**/*.less'],
        tasks: ['injector:less']
      },
      less: {
        files: [
          '<%= config.appPath %>/**/*.less'],
        tasks: ['less', 'autoprefixer']
      },
      browserify: {
        files: [
          '<%= config.appPath %>/**/*.js',
          '!<%= config.appPath %>/**/*.spec.js'
        ],
        tasks: ['browserify']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= config.appPath %>}/**/*.css',
          '{.tmp,<%= config.appPath %>}/**/*.html',

          '{.tmp,<%= config.appPath %>}/**/*.js',

          '!{.tmp,<%= config.appPath %>}/**/*.spec.js',
          '!{.tmp,<%= config.appPath %>}/**/*.mock.js',
          'assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                  '/bower_components',
                  connect.static('./bower_components')
              ),
              connect.static('app'),
              connect.static('./')
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                  '/bower_components',
                  connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= config.distPath %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes

    eslint: {
      options: {
        eslintrc: '.eslintrc'
      },
      app: {
        src: [
          '<%= config.appPath %>/**/*.js',
          '!<%= config.appPath %>/**/*.spec.js',
          '!<%= config.appPath %>/**/*.mock.js'
        ]
      },
      test: {
        src: [
          '<%= config.appPath %>/**/*.spec.js',
          '<%= config.appPath %>/**/*.mock.js'
        ]
      }
    },


    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.distPath %>/*',
            '!<%= config.distPath %>/.git*',
            '!<%= config.distPath %>/Procfile'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.css',
          dest: '.tmp/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: 'index.html',
        ignorePath: './',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/ ]
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.distPath %>/public/{,*/}*.js',
            '<%= config.distPath %>/public/{,*/}*.css',
            '<%= config.distPath %>/public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= config.distPath %>/public/assets/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['index.html'],
      options: {
        dest: '<%= config.distPath %>/public'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= config.distPath %>/public/{,*/}*.html'],
      css: ['<%= config.distPath %>/public/{,*/}*.css'],
      js: ['<%= config.distPath %>/public/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= config.distPath %>/public',
          '<%= config.distPath %>/public/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= config.distPath %>/public/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/images',
          src: '{,*/}*.svg',
          dest: '<%= config.distPath %>/public/assets/images'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '**/*.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: 'seedApp',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app/app.js'
      },
      main: {
        cwd: './',
        src: ['app/**/*.html'],
        dest: '.tmp/templates.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= config.distPath %>/public/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: './',
          dest: '<%= config.distPath %>/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/**/*',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= config.distPath %>/public/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%= config.distPath %>',
          src: [
            'package.json',
            'server/**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: './',
        dest: '.tmp/',
        src: ['app/**/*.css']
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'browserify',
        'less'
      ],
      test: [
        'browserify',
        'less'
      ],
      dist: [
        'browserify',
        'less',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },

    browserify: {
      dist: {
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [["babelify", { "stage": 0 }]]
        },
        files: [{
          expand: true,
          cwd: './',
          src: [
            'app/**/*.js',
            '!app/**/*.spec.js'
          ],
          dest: '.tmp'
        }]
      }
    },

    // Compiles Less to CSS
    less: {
      options: {
        paths: [
          'bower_components',
          'app'
        ]
      },
      server: {
        files: {
          '.tmp/app/app.css' : 'app/app.less'
        }
      }
    },

    injector: {
      options: {

      },

      // Inject component less into app.less
      less: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('./app/', '');
            //filePath = filePath.replace('./components/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%= config.appPath %>/app.less': [
            '<%= config.appPath %>/**/*.less',
            '!<%= config.appPath %>/app.less'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'index.html': [
            '<%= config.appPath %>/**/*.css'
          ]
        }
      }
    }
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:prod', 'wait']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'injector:less',
        'injector',
        'wiredep',
        'connect:livereload',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'injector:less',
      'injector',
      'wiredep',
      'autoprefixer',
      'browserify',
      'less',
      'wait',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function(target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:test'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'injector:less',
        'wiredep',
        'concurrent:test',
        'injector',
        'autoprefixer',
        'karma'
      ]);
    }

    else if (target === 'e2e') {
      return grunt.task.run([
        'clean:server',
        'env:test',
        'injector:less',
        'concurrent:test',
        'injector',
        'wiredep',
        'autoprefixer',
        'protractor'
      ]);
    }

    else grunt.task.run([
        'test:server',
        'test:client'
      ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'injector:less',
    'concurrent:dist',
    'injector',
    'wiredep',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'eslint',
    'test',
    'build'
  ]);
};