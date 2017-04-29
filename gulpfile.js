'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglifyjs');
var browserify = require('gulp-browserify');

gulp.task('clean', () => {
  gulp.src('./dist/*')
    .pipe(clean({
      read: false
    }));
});

gulp.task('js', () => {
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

gulp.task('eslint', () => gulp.src([
  './*.js',
  'lib/*.js'
])
  .pipe(eslint())
  .pipe(eslint.format())
  .on('data', file => {
    if (file.eslint.messages && file.eslint.messages.length) {
      gulp.fail = true;
    }
  }
));

gulp.task('watch', () => {
  gulp.watch([
    './lib/*.js'
  ], ['js']);
});

process.on('uncaughtException', err => {
  console.log(err);
  console.log('Stacktrace:');
  console.log(err.stack);
  process.exit(1);
});

process.on('exit', () => {
  if (gulp.fail) {
    process.exit(1);
  }
});
