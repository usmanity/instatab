var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('config.json', 'utf8'));

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    includereplace: {
      dev: {
        options: {
          globals: obj.dev,
          prefix: '{{',
          suffix: '}}',
          includesDir: 'src/'
        },
        files: [
          {src: ['src/**/*'], dest: 'dist/', expand: true, cwd: '.'},
        ]
      },
      prod: {
        options: {
          globals: obj.prod,
          prefix: '{{',
          suffix: '}}',
          includesDir: 'src/'
        },
        files: [
          {src: 'src/**/*', dest: 'prod/dist/', expand: true, cwd: '.'}
        ]
      }
    },
    browserify: {
      dev: {
        src: 'src/index.js',
        dest: 'dist/build.js',
        options: {
          browserifyOptions: {
            debug: true
          }
        }
      },
      prod: {
        src: 'src/index.js',
        dest: 'prod/dist/build.js'
      }
    },
    watch: {
      js: {
        files: ['src/**/*'],
        tasks: ['dev']
      }
    },
    uglify: {
      prod: {
        files: {
          'prod/dist/build.js': 'prod/dist/build.js'
        },
        mangle: false
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          src: ['manifest.json', '_locales/**', 'images/'],
          dest: 'prod/',
          filter: 'isFile'
        }]
      },
      dev: {
        files: [{
            expand: true,
            src: ['src/**/*.html', 'src/**/*.css', 'images/*'],
            dest: 'dist/',
            filter: 'isFile'
        }]
      },
      prod: {
        files: [{
            expand: true,
            src: ['src/**/*.html', 'src/**/*.css', 'icons/**', 'js/**', 'manifest.json', '_locales/**', 'images/*'],
            dest: 'prod/',
            filter: 'isFile'
        }]
      }
    },
    clean: {
      prod: {
        src: ["prod/dist/src/**/*.js"]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'instatab.zip'
        },
        files: [
          {expand: true, cwd: '.', src: ['prod/**'], dest: '.'}, // makes all src relative to cwd
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).

  grunt.registerTask('prod', ['includereplace:prod', 'browserify:prod', 'copy:prod', 'uglify:prod', 'clean:prod', 'compress:main']);
  grunt.registerTask('dev', ['includereplace:dev', 'browserify:dev', 'copy:dev']);
};
