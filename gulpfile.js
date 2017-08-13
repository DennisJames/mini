'use strict';
var gulp = require('gulp');
var vfe = require('vfem');
var inject = require('gulp-inject');
var watch = require('gulp-watch');
var fs = require('fs');
var path = require('path');


var COMPONENT_MODULES = "c";
var dist = "./release";
var config = {
	watch_dirs: ['views/**', COMPONENT_MODULES + '/**']
};
var libs = ['vue', 'vue-router', 'vue-resource'].map(function(i){return './views/libs/' + i + '.js'});

var opts = {
	static: './views/styles/*',
	minify: false,
	name: 'mini_food',
	views: ['./views/index.html'],
	libs: libs,
	entry: './c/index.js'
}
gulp.task('watch', function () {
	return watch(config.watch_dirs, vfe.util.once(function (next) {
		gulp.start('default', function (err) {
			next()
		})
	}))
});
gulp.task('default', ['clean'], build(opts));
gulp.task('clean', function () {
	return gulp.src(['/*.js', '/*.css', '*.html'].map(function(i){
		return dist + i;
	}), { read: false })
	   .pipe(vfe.clean())
});

function build(options){
	var releaseDist = options.dist || dist;
	return function(a){
		var index = fs.readFileSync('./views/index.html', 'utf-8');
		var name = options.name;
		var streams = [];
		streams.push(
			gulp.src(options.views)
				.pipe(inject(
					vfe.merge(
						/**
						 * Libs
						 */
						gulp.src(options.libs || ['./views/lib/*.js'])
							.pipe(vfe.concat(name + '-lib.js', {newLine: ';'}))
							.pipe(vfe.hash({
					            hashLength: 6,
					            template: '<%= name %>_<%= hash %><%= ext %>'
					        }))
							.pipe(vfe.if(options.minify, vfe.uglify()))
							.pipe(gulp.dest(releaseDist)),
						/**
						 * Components
						 */
						vfe({
							minify: options.minify,
							name: name,
							entry: options.entry,
							libs: [],
							modulesDirectories: [COMPONENT_MODULES, 'node_modules'],
							onRequest: function (f) {
								return !/\/node_modules\//.test(f.context)
							}
						})
						.pipe(gulp.dest(releaseDist))
					),
					{
						transform: function (filepath) {
							var filename = path.basename(filepath)
							/**
							 * Javascript release prefix
							 */
							filename = '/' + filename
							return '<script type="text/javascript" src="%s?max_age=2592000"></script>'.replace('%s', filename)
						}
					}
				))
				.pipe(gulp.dest(releaseDist))
		)
		if (options.static) {
			streams.push(
				gulp.src(options.static)
					.pipe(gulp.dest(releaseDist))
			)
		}
		return vfe
				.merge.apply(vfe, streams)
				.on('end', function () {
					gulp.stop(null, true)
				})
	}
}