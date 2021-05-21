"use strict";

/* ПОДКЛЮЧЕНИЕ */

var gulp = require("gulp");  // сам Галп

// Набор для разработки
var less = require("gulp-less");  // декодер less-css
var sourcemap = require("gulp-sourcemaps");  // карта исходников
var server = require("browser-sync").create();  // локальный веб-сервер
var plumber = require("gulp-plumber");  // гаситель критичности ошибок

// Работа с графикой
var imagemin = require("gulp-imagemin");  // 4 плагина по оптимизации изображений
var webp = require("gulp-webp");  // преобразователь растра в webp
var svgstore = require("gulp-svgstore");  // сборщик svg-спрайта
/*
var posthtml = require("gulp-posthtml");  // post-html
var include = require("posthtml-include");  // и плагин инклюд для него
*/

// Набор для деплоя
var del = require("del");  // галп-удалятель
var rename = require("gulp-rename");  // галп-переименователь

var autoprefixer = require("gulp-autoprefixer");  // автопрефиксер

var minhtml = require("gulp-minimize");  // минификатор html
var csso = require("gulp-csso");  // минификатор css
var minjs = require("gulp-uglify");  // минификатор js

// Так, а наверняка ведь есть и какая-нибудь штука, помогающая деплоить на гх-пагес, создавая сразу отдельную ветку..

/* ЗАДАЧИ */

// РАЗРАБОТКА
// Преобразование Less, карта исходников, локальный сервер, гаситель критичности ошибок
gulp.task("development", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

// Автообновления локального сервера при разработке
gulp.task("live reload", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch("source/less/**/*.less", gulp.series("development"));
  gulp.watch("source/*.html").on("change", server.reload);
});



// ГРАФИКА

//Оптимизация изображений (png, jpg, svg)
gulp.task("images optimization", function() {
	return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel:3}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
});

//Создание webp из растра и копирование в продакшн
gulp.task("create webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp())
    .pipe(gulp.dest("build/img"));
})

// Создание векторного спрайта
// gulp.task("create vector sprite", function() {
//   return gulp.src("source/img/svg/**/*.svg")
//   .pipe(svgstore({
//     inlineSvg: true
//   }))
//   .pipe(rename("sprite.svg"))
//   .pipe(gulp.dest("source/img/svg"))
//   .pipe(gulp.dest("build/img/svg"));
// })



// ПРЕДЕПЛОЙ

// Удаление папки билда (чтобы удалённое в source при разработке не оставалось в build)
gulp.task("clean build", function () {
	return del("build");
});

// Минимизация CSS и закидывание его в продакшн
gulp.task("css for production", function () {
  return gulp.src("source/css/style.css") // Взяли отсюда
    .pipe(autoprefixer()) // Прогнал через автопрефиксер
    .pipe(csso()) // Минифицировали
    // .pipe(rename("style.css")) // Обозвали вот так
    .pipe(gulp.dest("build/css")); // Закинули сюда
});

// Минификация JS
gulp.task("compress js", function() {
  return gulp.src("source/js/*.js")
  .pipe(minjs())
  .pipe(gulp.dest("build/js"));
});

// Минификация HTML (с предварительной вставкой содержимого include туда)
gulp.task("html for production", function() {
  return gulp.src("source/*.html")
    /*
    .pipe(posthtml([
      include()
    ]))
    */
    .pipe(minhtml())
    .pipe(gulp.dest("build"));
})

// Копирование остального в папку продакшена
gulp.task("copy other", function() {
	return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/*.{ico,png}",
    "source/video/*.{mp4,webm,ogg}"
    // "source/video/**/*"
    ], {
			base: "source"
		})
		.pipe(gulp.dest("build"));
});



/* КОМАНДЫ */

// Запуск разработки
gulp.task("start", gulp.series(
  "development",
  "live reload"
));

// Сборка проекта
gulp.task("build", gulp.series(
  "clean build",
  "development",
  // "images optimization",
  // "create webp",
  // "create vector sprite",
  "html for production",
  "css for production",
  "compress js",
  "copy other"
));
