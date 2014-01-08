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
		}
	});
	
	grunt.loadNpmTasks('grunt-simple-mocha');
	
	// DEFAULT TASK
	grunt.registerTask('default', ['simplemocha']);
	
};