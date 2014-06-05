module.exports = function(grunt) {

  // Configuration.
  grunt.initConfig({
    jshint: {
      options: {
        "undef": true,
        "unused": true
      },

      files: 'jquery.hotkeys.js'
    },
    jasmine: {
      pivotal: {
        src: 'jquery.hotkeys.js',
        options: {
          vendor: ['jquery-2.1.1.js', 'test/lib/**.js'],
          outfile: 'test/SpecRunner.html',
          keepRunner: true,
          specs: 'test/spec/*Spec.js'
        }
      }
    },
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['default'],
        options: {
          spawn: false,
          interrupt: true,
          debounceDelay: 1000
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

  // Task loading.
  grunt.loadNpmTasks("grunt-contrib-jshint");

  // tests
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Task registration.
  grunt.registerTask("default", ["jshint", "jasmine"]);
};
