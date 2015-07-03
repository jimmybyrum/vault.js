'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglifyjs');
var browserify = require('gulp-browserify');

gulp.task('clean', function() {
  gulp.src('./dist/*')
    .pipe(clean({
      read: false
    }));
});

gulp.task('js', function() {
  gulp.src('./browser.js')
    .pipe(browserify({
      read: false,
      standalone: 'Vault',
      debug: process.env.NODE_ENV === 'dev'
    }))
    .pipe(uglify())
    .pipe(rename('vault.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean', 'js']);

gulp.task('eslint', function() {
  return gulp.src([
    './*.js',
    'lib/*.js'
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
