//Bismillah
var path = require('path');

module.exports = function(grunt) {

	log = function(err, stdout, stderr, cb) {
		console.log(stdout);
		cb();
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		simplemocha: {
			options: {
				reporter: 'spec'
			},
			all: { src: ['test/*.js'] }
		},
		jshint: {
			all: ['app.js', 'Gruntfile.js', 'models', 'routes', 'views/*.js', 'test'],
			options: {
				'-W030': true
			}

		},
		casperjs: {
			files: ['test/functional/**/*.js']
		},
		express: {
			custom: {
				options: {
					port: 3000,
					bases: 'www-root',
					server: path.resolve('./app.js')
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-casperjs');
	grunt.loadNpmTasks('grunt-express');

	// DEFAULT TASK
	grunt.registerTask('default', ['simplemocha']);

	grunt.registerTask('functional-test', ['express', 'casperjs'])

};
