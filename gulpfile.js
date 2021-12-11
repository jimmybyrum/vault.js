const gulp = require('gulp');
const clean = require('gulp-clean');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

let fail = false;

gulp.task('clean', cleanTask);
gulp.task('js', jsTask);
gulp.task('eslint', eslintTask);
gulp.task('watch', watchTask);

gulp.task('build', cb => {
  gulp.series('clean', 'js')();
  cb();
});

function cleanTask(cb) {
  gulp.src('./dist/*')
    .pipe(clean({
      read: false
    }));
  cb();
}

function jsTask(cb) {
  browserify(['./build/browser.js'])
    .transform('babelify')
    .bundle()
    .pipe(source('./build/browser.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename('vault.min.js'))
    .pipe(gulp.dest('./dist'));
  cb();
}

function eslintTask() {
  return gulp.src([
    './build/*.js',
    './build/lib/*.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .on('data', function(file) {
      if (file.eslint.messages && file.eslint.messages.length) {
        fail = true;
      }
    }
  );
}

function watchTask() {
  gulp.watch([
    './build/lib/*.js'
  ], ['js']);
}

process.on('uncaughtException', function(err) {
  console.log(err);
  console.log('Stacktrace:');
  console.log(err.stack);
  process.exit(1);
});

process.on('exit', () => {
  if (fail) {
    process.exit(1);
  }
});
