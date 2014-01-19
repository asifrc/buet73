//Bismillah
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
			
		}
	});
	
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	// DEFAULT TASK
	grunt.registerTask('default', ['simplemocha']);
	
};