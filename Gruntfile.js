var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('config.json', 'utf8'));

console.log(obj);

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      script: {
        files: ['src/**/*.js'],
        tasks: ['includes'],
        options: {
          spawn: false
        }
      }
    },
    includereplace: {
      dev: {
        options: {
          globals: obj.dev,
          prefix: '{{',
          suffix: '}}',
          includesDir: 'src/'
        },
        files: [
          {src: 'src/**/*.js', dest: 'dist/', expand: true, cwd: '.'}
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
          {src: 'src/**/*.js', dest: 'dist/', expand: true, cwd: '.'}
        ]
      }
    },
    concat: {
      dist: {
        src: [
              'dist/src/init/init.js',
              'dist/src/auth/finished.js',
              'dist/src/auth/start.js',
              'dist/src/override/tab.js',
              'dist/src/options/options.js'
             ],
        dest: 'dist/build.js'
      },
    },
    watch: {
      css: {
        files: 'src/**/*.js',
        tasks: ['dev']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).

  grunt.registerTask('prod', ['includereplace:prod', 'concat']);
  grunt.registerTask('dev', ['includereplace:dev', 'concat']);
};
