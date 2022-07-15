const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require ('del');
const clean_css = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const htmlImport = require('gulp-html-import');

const paths = {
    htmls: {
        src: 'src/html/**/*.html',
        dest:'dest/html'
    },
    style: {
        src:'src/styles/**/*.sass',
        dest:'dest/css'
    },
    scripts: {
        src:'src/js/**/*.js',
        dest:'dest/js'
    }
};

function htmls() {
    return gulp.src('src/html/*.html')
    .pipe(htmlImport('src/html/components'))
    .pipe(gulp.dest(paths.htmls.dest))
}

function styles() {
    return gulp.src(paths.style.src)
    .pipe(sass())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(paths.style.dest))
    .pipe(clean_css())
    .pipe(concat('main.min.css'))
    // .pipe(rename({
    //     extname: '.min.css'
    // }))
    .pipe(gulp.dest(paths.style.dest));
};

function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
};

gulp.task('import', function () {
    gulp.src('./demo/index.html')
        .pipe(gulpImport('./demo/components/'))
        .pipe(gulp.dest('dist')); 
})

function watch() {
    gulp.watch(paths.htmls.src, htmls);
    gulp.watch(paths.style.src, styles);
    gulp.watch(paths.scripts.src, scripts);
}

function clean() {
    return del(['dest']);
}

const build = gulp.series(clean, gulp.parallel(htmls, styles, scripts), watch);

exports.clean = clean;
exports.htmls = htmls;
exports.scripts = scripts;
exports.styles = styles;
exports.watch = watch;
exports.build = build;

exports.default = build;
