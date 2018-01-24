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
      templates: {
	files: [{
	  expand: true,
	  src: ['**/*.jade'],
	  dest: 'tmp/',
	  cwd: 'src/html/',
	  ext: '.html'
	}]
      },
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
    inline_angular_templates: {
      index: {
	options: {
	  base: 'tmp',
	  prefix: '/',
	  selector: 'body',
	  method: 'prepend'
	},
	files: {
	  'tmp/index.html': ['tmp/**/*.html', '!tmp/index.html']
	}
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
      files: [
	'src/**/*.jade',
	'src/**/*.js',
	'src/**/*.styl',
	'src/**/*.css'
      ],
      tasks: ['default']
    },
    concat: {
      vendor: {
	files: {
	  'tmp/vendor.js': [
	    'modules/request.js',
	    'modules/element.js',
	    'node_modules/d3/build/d3.min.js',
	    'node_modules/dot/doT.min.js',
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
    'inline_angular_templates',
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
  grunt.loadNpmTasks('grunt-inline-angular-templates')

  grunt.registerTask('default', ['base', 'after'])
}
