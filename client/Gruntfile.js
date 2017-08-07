var path = require('path')

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      options: {
	force: true
      },
      index: {
	src: ['tmp/**/*']
      }
    },
    jade: {
      index: {
	files: [{
	  'tmp/index.html' : ['src/index.jade']
	}]
      }
    },
    stylus: {
      options: {
	compress: true,
	'include css': true
      },
      compile: {
	files: {
	  'tmp/app.css': 'src/css/*.styl'
	}
      }
    },
    staticinline: {
      main: {
	files: {
	  'tmp/index.html': 'tmp/index.html'
	}
      }
    },    
    inline: {
      index: {
	src: [ 'tmp/index.html' ]
      }
    },
    copy: {
      index: {
	files: [{
	  expand: true,
	  flatten: true,
	  src: 'tmp/index.html',
	  dest: 'dist'
	}]
      }
    },
    watch: {
      index: {
	files: [
	  'Gruntfile.js',
	  'src/**/*',
	  'node_modules/**/*'
	],
	tasks: ['default']
      }
    },
    concat: {
      vendor: {
	files: {
	  'tmp/vendor.js': [
	    'modules/request.js',
	    'modules/element.js',
	    'node_modules/d3/build/d3.min.js',
	    'node_modules/metrics-graphics/dist/metricsgraphics.min.js'
	  ]
	}
      },
      js: {
	files: {
	  'tmp/app.js': ['src/js/**/*.js']
	}
      }
    },
    browserify: {
      dist: {
	files: {
	  'tmp/app.js': ['src/js/**/*.js']
	}
      }
    }
  })

  grunt.registerTask('base', [
    'clean',
    'stylus',
    'concat',
    'jade'
  ])

  grunt.registerTask('after', [
    'inline',
    'staticinline',
    'copy'
  ])

  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-static-inline')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-browserify')

  grunt.registerTask('default', ['base', 'after'])
}
