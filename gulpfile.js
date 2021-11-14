import gulp from 'gulp';
import clean from 'gulp-clean';
import eslint from 'gulp-eslint';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import browserify from 'gulp-browserify';

let fail = false;

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

// gulp.task('build', ['clean', 'js'], () => {});

gulp.task('eslint', () => {
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
});

gulp.task('watch', () => {
  gulp.watch([
    './lib/*.js'
  ], ['js']);
});

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
