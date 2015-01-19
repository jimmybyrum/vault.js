'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('eslint', function() {
  return gulp.src([
    './*.js',
    'handlers/*.js',
    'lib/*.js',
    'models/**/*.js',
    'public/js/*.js',
    'routes/*.js',
    'scripts/*.js',
    'server/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .on('data', function(file) {
      if (file.eslint.messages && file.eslint.messages.length) {
        gulp.fail = true;
      }
    }
  );
});

process.on('uncaughtException', function(err) {
  console.log(err);
  console.log('Stacktrace:');
  console.log(err.stack);
  process.exit(1);
});

process.on('exit', function() {
  if (gulp.fail) {
    process.exit(1);
  }
});
