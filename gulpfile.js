"use strict";

/* ПОДКЛЮЧЕНИЕ */

var gulp = require("gulp");  // подключил сам галп

// Набор для разработки
var less = require("gulp-less");  // подключил декодер less-css
var sourcemap = require("gulp-sourcemaps");  // подключил карту исходников
var server = require("browser-sync").create();  // подключил локальный веб-сервер
var plumber = require("gulp-plumber");  // подключил гаситель критичности ошибок

// Набор для деплоя
var del = require("del");  // подключил галп-удалятель
var rename = require("gulp-rename");  // подключил галп-переименователь
var autoprefixer = require("gulp-autoprefixer");  // подключил  автопрефиксер
var minhtml = require("gulp-minimize");  //минификатор html
var csso = require("gulp-csso");  // подключил минификатор css
var minjs = require("gulp-uglify");  // подключил минификатор js

// Работа с графикой
var imagemin = require("gulp-imagemin");  //подключил 4 плагина по оптимизации изображений
var webp = require("gulp-webp");  //подключил оптимизатор webp
var svgstore = require("gulp-svgstore");  //подключил сборщик svg-спрайта
var posthtml = require("gulp-posthtml");  //подключил post-html
var include = require("posthtml-include");  //и плагин инклюд для него


// Далее - минификация хтмл (пока без инклюда), минификация всех картинок
// Так, а наверняка ведь есть и какая-нибудь штука, помогающая деплоить на гх-пагес, создавая сразу отдельную ветку...

/* КОМАНДЫ */

// РАЗРАБОТКА
gulp.task("dev", function () {
  return gulp.src("source/less/style.less") // взял стайл-лесс
    .pipe(plumber()) // активировал гаситель критичности ошибок
    .pipe(sourcemap.init()) // инициировал карту исходников
    .pipe(less()) // декодировал Less
    .pipe(sourcemap.write(".")) // чтение(?) карты исходников
    .pipe(gulp.dest("source/css")) // закинул то, что получилось в сорс-цсс
    .pipe(server.stream()); // запустил лайв-сервер (вроде так это называется...)
});

// Автообновления локального сервера при разработке
gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch("source/less/**/*.less", gulp.series("css-dev"));
  gulp.watch("source/*.html").on("change", server.reload);
});



// ЗАДАЧИ

// Удаление папки билда (чтобы удалённое в source при разработке не оставалось в build)
gulp.task("clean", function () {
	return del("build");
});

// Минимизация CSS и закидывание его в продакшн
gulp.task("css-prod", function () {
  return gulp.src("source/css/style.css") // Взяли отсюда
    .pipe(autoprefixer()) // Прогнал через автопрефиксер
    .pipe(csso()) // Минифицировали
    // .pipe(rename("style.css")) // Обозвали вот так
    .pipe(gulp.dest("build/css")); // Закинули сюда
});

// Минификация JS
gulp.task("compress-js", function() {
  return gulp.src("source/js/*.js")
  .pipe(minjs())
  .pipe(gulp.dest("build/js"));
});

// Минификация HTML (с предварительной вставкой содержимого include туда)
gulp.task("html", function() {
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
    "source/fonts/**/*.{woff,woff2}", // взяли все шрифты из всех вложенных папок (вроде так)
    // "source/js/picturefill.min.js", // взяли минифицированный пикчурфилл
    "source/*.ico" // взяли все иконки
    ], {
			base: "source" // я забыл, что это значит. Но походу то, что когда он будет скидывать всё в папку билд, он решит, что теперь вместо сорса билд
		})
		.pipe(gulp.dest("build"));
});



/* КОМАНДЫ */

// Запуск разработки
gulp.task("start", gulp.series(
  "dev",
  "server"
));

// Сборка проекта
gulp.task("build", gulp.series(
  "clean",
  "dev",
  "css-prod",
  "compress-js",
  "html",
  "copy other"
));






// var postcss = require("gulp-postcss");  //подключил плагин postcss(для работы автопрефиксера)
// var autoprefixer = require("autoprefixer");  //подключил сам автопрефиксер
// var rename = require("gulp-rename");  //подключил галп-переименователь
// var imagemin = require("gulp-imagemin");  //подключил 4 плагина по оптимизации изображений
// var webp = require("gulp-webp");  //подключил оптимизатор webp
// var minhtml = require("gulp-minimize");  //минификатор html
// var csso = require("gulp-csso");  //подключил минификатор css
// var minjs = require("gulp-uglify");  //минификатор js
// var svgstore = require("gulp-svgstore");  //подключил сборщик svg-спрайта
// var posthtml = require("gulp-posthtml");  //подключил post-html
// var include = require("posthtml-include");  //и плагин инклюд для него

/*
//Минимизация css и закидывание его в продакшн
gulp.task("css-prod", function () {
  return gulp.src("source/css/style.css")
    .pipe(csso())
    // .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});
*/

/*
//Вставка содержимого include в итоговый html
gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(minhtml())
    .pipe(gulp.dest("build"));
})
*/

//Оптимизация изображений (png, jpg, svg)
// gulp.task("images", function() {
// 	return gulp.src("source/img/**/*.{png,jpg,svg}")
//     .pipe(imagemin([
//       imagemin.optipng({optimizationLevel:3}),
//       imagemin.jpegtran({progressive:true}),
//       imagemin.svgo()
//     ]))
//     .pipe(gulp.dest("build/img"))
// });

//Создание webp из растра и копирование в продакшн
// gulp.task("webp", function() {
//   return gulp.src("source/img/**/*.{png,jpg}")
//     .pipe(webp())
//     .pipe(gulp.dest("build/img"));
// })

//Создание svg-спрайта
// gulp.task("sprite", function() {
//   return gulp.src("source/img/*_spr.svg")
//   .pipe(svgstore({
//     inlineSvg: true
//   }))
//   .pipe(rename("sprite.svg"))
//   .pipe(gulp.dest("source/img"))
//   .pipe(gulp.dest("build/img"));
// })

/*
// Минификация JS
gulp.task("compress-js", function() {
  return gulp.src("source/js/*.js")
  .pipe(minjs())
  .pipe(gulp.dest("build/js"));
});
*/

/*
gulp.task("untrack", function () {
  return del("source/img/sprite.svg");
});
*/

//Сборка проекта
// gulp.task("build", gulp.series("css-dev", "clean", "copy", "css-prod", "compress-js", "images", "webp", "sprite", "html", "untrack"));

//Тестирование в препродакшене (обязательно после npm run build и без untrack в билде)
// gulp.task("prepro", gulp.series("css-dev", "copy", "css-prod", "html"));
