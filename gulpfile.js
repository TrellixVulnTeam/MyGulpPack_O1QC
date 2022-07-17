const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require ('del');
const clean_css = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const htmlImport = require('gulp-html-import');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const newer = require('gulp-newer');

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
    },
    images: {
        src: 'src/img/*',
        dest:'dest/img'
    }
}

function htmls() {
    return gulp.src('src/html/*.html') // Откуда
    .pipe(htmlImport('src/html/components/'))
    .pipe(gulp.dest(paths.htmls.dest)) // Импорт компонентов в html
    .pipe(htmlmin({ collapseWhitespace: true })) 
    .pipe(rename({
        extname: '.min.html' //Добавили приставку мин
    })) 
    .pipe(size())
    .pipe(gulp.dest(paths.htmls.dest)); // Куда
}

function styles() {
    return gulp.src(paths.style.src) // Откуда
    .pipe(sourcemaps.init())  // Отображение реального пути
    .pipe(sass()) // Из sass в css
    .pipe(autoprefixer({ 
        cascade: false // Кроссбраузерность
    }))
    .pipe(gulp.dest(paths.style.dest)) // Макс версия
    .pipe(clean_css({
        level: 2 // Супер оптимизация
    })) // Мин версия
    .pipe(rename({
        extname: '.min.css' //Добавили приставку мин
    })) 
    .pipe(sourcemaps.write('.'))  // Отображение реального пути
    .pipe(size())
    .pipe(gulp.dest(paths.style.dest)); // Куда
};

function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true // Откуда
    })
    .pipe(sourcemaps.init())  // Отображение реального пути
    .pipe(concat('main.js')) // Собираем в 1 файл
    .pipe(gulp.dest(paths.scripts.dest)) //Куда
    .pipe(uglify()) // Минифицируем
    .pipe(concat('main.min.js')) // Собираем в 1 файл
    .pipe(babel({
    })) // Рекомпилим в старые форматы
    .pipe(sourcemaps.write('.')) // Отображение реального пути
    .pipe(size())
    .pipe(gulp.dest(paths.scripts.dest)); // Куда
}

// сжимаем img
function img () {
    return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
        progressive: true,
        optimizationLevel: 5
    }))
    .pipe(size({
        showFiles: true
    }))
    .pipe(gulp.dest(paths.images.dest));
}

// Чекает изменения в файлах
function watch() { 
    gulp.watch(paths.htmls.src, htmls);
    gulp.watch(paths.style.src, styles);
    gulp.watch(paths.scripts.src, scripts);
}
// Удаляет собранную папку
function clean() {
    return del(['dest/*', '!dest/img']);
}

const build = gulp.series(clean, gulp.parallel(htmls, styles, scripts, img), watch); // Поток выполнения задач

exports.clean = clean;
exports.htmls = htmls;
exports.scripts = scripts;
exports.styles = styles;
exports.img = img;
exports.watch = watch;
exports.build = build;

exports.default = build; // gulp
