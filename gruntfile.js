module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

  //  Config
    pkg: grunt.file.readJSON('package.json')

   ,config: {
      dev: {
        options: {
          variables: {
            'dest': '_site'
          }
        }
      },
      stage: {
        options: {
          variables: {
            'dest': 'beta'
          }
        }
      },
      deploy: {
        options: {
          variables: {
            'dest': '2014'
          }
        }
      }
    }

  //  Build Site

   ,watch: {
      files: ['src/**/*', '!src/_includes/bower_components/**/*']
     ,tasks: ['dev']
     ,options: {
        livereload: true
      }
    }

   ,express: {
      dev: {
        options: {
          port: 3000,
          hostname: 'localhost',
          bases: '<%= grunt.config.get("dest") %>'
        }
      }
    }

   ,shell: {
      jekyll_dev: {
        command: 'jekyll build'
      },
      jekyll_stage: {
        command: 'jekyll build --destination <%= grunt.config.get("dest") %> --config _config.stage.yml'
      },
      jekyll_deploy: {
        command: 'jekyll build --destination <%= grunt.config.get("dest") %> --config _config.production.yml'
      },
      open: {
        command: 'open ./<%= grunt.config.get("dest") %>'
      }
    }

   ,copy: {
      bower: {
        files: [
          { expand: true, flatten: true, cwd: 'src/_includes/bower_components', src: ['html5shiv/dist/html5shiv.js'], dest: '<%= grunt.config.get("dest") %>/static/js/lib'},
          { expand: true, flatten: true, cwd: 'src/_includes/bower_components', src: ['respondJS/dest/respond.min.js'], dest: '<%= grunt.config.get("dest") %>/static/js/lib'}
        ]
      }
    }

   ,clean: {
      files: ['<%= grunt.config.get("dest") %>']
    }

  // Compile

   ,less: {
      development: {
        options: {
          paths: ['src/static/css']
        }
       ,files: {
          'src/static/css/global.css': ['src/_includes/less/global.less'],
          'src/_includes/css/preload.css': ['src/_includes/less/preload.less']
        }
      }
     ,production: {
        options: {
          compress: true
         ,paths: ['src/static/css']
        }
       ,files: {
          'src/static/css/global.css': ['src/_includes/less/global.less'],
          'src/_includes/css/preload.css': ['src/_includes/less/preload.less']
        }
      }
    }

  // Validate

   ,htmlhint: {
      options: {
        'tag-pair': true,
        'tagname-lowercase': true,
        'attr-lowercase': true,
        'attr-value-double-quotes': true,
        'doctype-first': true,
        'spec-char-escape': true,
        'id-unique': true,
        'style-disabled': true,
        'src-not-empty': true,
        'img-alt-require': true
      },
      src: ['<%= grunt.config.get("dest") %>/**/*.html']

    }

   ,csslint: {
      options: {
        'adjoining-classes': false,
        'box-model': false,
        'box-sizing': false,
        'regex-selectors': false,
        'universal-selector': false,
        'font-sizes': false  //  Until CSSLint has the option to set an ammount
      },
      src: ['<%= grunt.config.get("dest") %>/static/css/*.css']
    }

   ,jshint: {
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        indent: 2,
        laxbreak: true,
        laxcomma: true,
        quotmark: 'single',
        trailing: true,
        undef: true,
        globals: {
          console: true,
          module: true,
          jQuery: true,
          Modernizr: true
        }
      },
      src: ['gruntfile.js', 'src/_includes/js/*.js']
    }

  // Optimise

   ,modernizr: {
      dist: {
        // [REQUIRED] Path to the build you're using for development.
        'devFile' : 'src/static/js/lib/modernizr-dev.js',
        // [REQUIRED] Path to save out the built file.
        'outputFile' : '<%= grunt.config.get("dest") %>/static/js/lib/modernizr.js',
        // Based on default settings on http://modernizr.com/download/
        'extra' : {
          'shiv' : false,
          'printshiv' : false,
          'load' : true,
          'mq' : false,
          'cssclasses' : true
        },
        // Based on default settings on http://modernizr.com/download/
        'extensibility' : {
          'addtest' : false,
          'prefixed' : false,
          'teststyles' : false,
          'testprops' : false,
          'testallprops' : false,
          'hasevents' : false,
          'prefixes' : false,
          'domprefixes' : false
        },
        'files' : {
          'src': ['src/**/*.*']
        },
        // Define any tests you want to implicitly include.
        'tests' : [],
        'matchCommunityTests' : false,
      }
    }

   ,imagemin: {
      options: {
        optimizationLevel: 3
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= grunt.config.get("dest") %>/static/gui',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= grunt.config.get("dest") %>/static/gui'
        },
        {
          expand: true,
          cwd: '<%= grunt.config.get("dest") %>/media',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: '<%= grunt.config.get("dest") %>/static/media'
        }]
      }
    }

   ,hashres: {
      options: {
        encoding: 'utf8',
        fileNameFormat: '${name}.${hash}.${ext}',
        renameFiles: true
      },
      image: {
        src: ['<%= grunt.config.get("dest") %>/media/**/*.{png,jpg,gif,svg}','<%= grunt.config.get("dest") %>/static/**/*.{png,jpg,gif,svg}'],
        dest: '<%= grunt.config.get("dest") %>/**/*.{html,css}',
      },
      css: {
        src: ['<%= grunt.config.get("dest") %>/static/css/**/*.css'],
        dest: '<%= grunt.config.get("dest") %>/**/*.html',
      },
      js: {
        src: ['<%= grunt.config.get("dest") %>/static/js/**/*.js'],
        dest: '<%= grunt.config.get("dest") %>/**/*.html',
      }
    }

  });

  // Tasks

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-htmlhint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-config');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-hashres');
  //grunt.loadNpmTasks('grunt-autoprefixer');

  // Options

  grunt.registerTask('default', ['dev', 'serve']);
  grunt.registerTask('test', ['config:dev', 'htmlhint', 'csslint', 'jshint']);
  grunt.registerTask('optim', ['imagemin']);
  grunt.registerTask('dev', ['config:dev', 'clean', 'less:development', 'shell:jekyll_dev', 'copy']);
  grunt.registerTask('serve', ['express', 'watch']);
  grunt.registerTask('stage', ['config:stage', 'clean', 'less:production', 'shell:jekyll_stage', 'copy', 'hashres', 'optim']);
  grunt.registerTask('deploy', ['config:deploy', 'clean', 'less:production', 'shell:jekyll_deploy', 'copy', /*'modernizr',*/ 'hashres', 'optim']);

};
