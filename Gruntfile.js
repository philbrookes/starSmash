module.exports = function(grunt) {
  grunt.initConfig({
    jshint :{
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      client: {
        src: ['client-code/**/*.js']
      },
      server: {
        src: ['private/**/*.js', 'main.js']
      }
    },
    concat_in_order: {
      'angular-app': {
        files: {
          'public_html/js/app.js': ['client-code/**/*.js']
        }
      }
    },
    watch: {
      'scripts': {
        files: ['client-code/**/*.js'],
        tasks: ['concat_in_order']
      }
    }
  });

  grunt.loadNpmTasks('grunt-concat-in-order');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-contrib-jshint');
};