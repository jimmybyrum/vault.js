import gulp from 'gulp';
import clean from 'gulp-clean';
import eslint from 'gulp-eslint';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

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
  browserify(['browser.js'])
    .transform('babelify')
    .bundle()
    .pipe(source('browser.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename('vault.min.js'))
    .pipe(gulp.dest('./dist'));
  cb();
}

function eslintTask() {
  return gulp.src([
    './*.js',
    'lib/*.js'
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
    './lib/*.js'
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
