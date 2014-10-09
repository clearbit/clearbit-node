'use strict';

var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')();
var argv    = require('yargs').argv;

gulp.task('cover', function () {
  return gulp.src('./src/**/*.js')
    .pipe(plugins.istanbul());
});

gulp.task('test', ['cover'], function () {
  return gulp.src('./test/**/*.js')
    .pipe(plugins.mocha({
      grep: argv.grep
    }))
    .pipe(plugins.istanbul.writeReports());
});