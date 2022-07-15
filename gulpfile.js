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
    return gulp.src('src/html/*.html') // Откуда
    .pipe(htmlImport('src/html/components/')) // Импорт компонентов в html
    .pipe(gulp.dest(paths.htmls.dest)) // Куда
}

function styles() {
    // Откуда
    return gulp.src(paths.style.src) // Откуда
    .pipe(sass()) // Из sass в css
    .pipe(gulp.dest(paths.style.dest)) // Макс версия
    .pipe(clean_css()) // Мин версия
    .pipe(rename({
        extname: '.min.css' //Добавили приставку мин
    }))
    .pipe(gulp.dest(paths.style.dest)); // Куда
};

function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true // Откуда
    })
    .pipe(babel()) // Рекомпилим в старые форматы
    .pipe(concat('main.js')) // Собираем в 1 файл
    .pipe(gulp.dest(paths.scripts.dest)) //Куда
    .pipe(uglify()) // Минифицируем
    .pipe(concat('main.min.js')) // Собираем в 1 файл
    .pipe(gulp.dest(paths.scripts.dest)); // Куда
};

// Чекает изменения в файлах
function watch() { 
    gulp.watch(paths.htmls.src, htmls);
    gulp.watch(paths.style.src, styles);
    gulp.watch(paths.scripts.src, scripts);
}
// Удаляет собранную папку
function clean() {
    return del(['dest']);
}

const build = gulp.series(clean, gulp.parallel(htmls, styles, scripts), watch); // Поток выполнения задач

exports.clean = clean;
exports.htmls = htmls;
exports.scripts = scripts;
exports.styles = styles;
exports.watch = watch;
exports.build = build;

exports.default = build; // gulp
