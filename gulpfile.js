const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("csso");
const rename = require("rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("svg-store");
const del = require("del");

// images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran ({progressive: true}),
      imagemin.svgo()
    ]))
}

// webp

const webp = () => {
  return gulp.src("source/img/**/*.{png,svg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"))
}

exports.webp = webp;

//sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

//my

exports.default = gulp.series(
  styles, server, watcher
);

var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

//build

const copy = () => {
  return gulp.src ([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
    ], {
      base: "source"
      })
    .pipe(gulp.dest("build"));
};

exports.copy = copy

const build = () => gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "html"
);

// del

const clean = () => {
  return del("build");
}
