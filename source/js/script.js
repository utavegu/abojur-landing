'use strict';

/* ДАВАЙ-КА, ПОЖАЛУЙ, ДЛЯ КАЖДОГО СКРИПТА ОТДЕЛЬНЫЙ ФАЙЛ И ПОТОМ СОБИРАЙ КАК СТИЛИ ГАЛПОМ */



/* Menu open-close script */

const menuBurgerButton = document.querySelector(".main-header__menu");
const headerNavigation = document.querySelector(".main-header__navigation");

menuBurgerButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  headerNavigation.classList.toggle("hidden");
})



/* Anchor script */

const anchor = document.querySelector('.anchor');

const showAnchor = () => {
  if (window.pageYOffset > document.documentElement.clientHeight) {
    anchor.classList.add('anchor-show');
  } else {
    anchor.classList.remove('anchor-show');
  }
}

let coords;

const go = () => {
  if (anchor.classList.contains("anchor-downward")) {
    window.scrollTo({
      top: coords,
      behavior: "smooth"
    });
    anchor.classList.remove("anchor-downward");
  }
  else {
    coords = window.pageYOffset;
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    anchor.classList.add("anchor-downward");
    window.removeEventListener('scroll', showAnchor);
  }
}

window.addEventListener('scroll', showAnchor);
anchor.addEventListener('click', go);



/* Modal-consultation script */

/* ВНИМАТЕЛЬНО ПЕРЕПРОВЕРЬ ВИСЯЩИЕ ОБРАБОТЧИКИ ЧЕРЕЗ ИВЕНТ... А лучше в ФФ, там понятнее */

// Кнопка вызова модалки
const askQuestionButton = document.querySelector(".promo__button");
// Всё модальное окно
const modalConsultation = document.querySelector(".modal-consultation");

// Крестик закрытия модалки
const modalConsultationCloseButton = modalConsultation.querySelector(".modal-consultation__close");
// Кнопка отправки формы
const modalConsultationSendButton = modalConsultation.querySelector(".modal-consultation__send");
// Ловушки фокуса
const modalConsultationTraps = modalConsultation.querySelectorAll(".focus-trap");


// Функция закрытия модалки по нажатию клавиши Esc
const onEscKeyDown = (evt) => {
  if (evt.key === `Escape` || evt.key === `Esc`) {
    modalConsultationClose();
  }
};

// Функция закрытия модалки по клику по оверлэю
const onOverlayClick = (evt) => {
  if (evt.target.className === "overlay") {
    modalConsultationClose();
  };
};

// Функция открытия модального окна
const modalConsultationOpen = () => {
  document.body.classList.add("overlay");
  modalConsultation.classList.add("is-opened");
  modalConsultation.querySelector("textarea").focus();
  document.addEventListener(`keydown`, onEscKeyDown);
  document.querySelector(".overlay").addEventListener("click", onOverlayClick);
}

// Функция закрытия модального окна
const modalConsultationClose = () => {
  document.body.classList.remove("overlay");
  modalConsultation.classList.remove("is-opened");
  document.removeEventListener(`keydown`, onEscKeyDown);
  document.body.removeEventListener("click", onOverlayClick);
}

// Слушаель открытия модалки по кнопке
askQuestionButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  evt.stopPropagation() 
  modalConsultationOpen();
});

// Слушаель закрытия модалки по крестику
modalConsultationCloseButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  modalConsultationClose();
});

// Ловушки фокуса
modalConsultationTraps.forEach(element => element.addEventListener("focus", () => {
  if (element.classList.contains("focus-trap--upper")) {
    modalConsultation.querySelector(".modal-consultation__close").focus();
  } else {
    modalConsultation.querySelector("textarea").focus();
  }
}));



/* SLIDER SCRIPT */

/* ОТРЕФАКТОРИ-КА, ПОЖАЛУЙ, НАЗВАНИЕ МОДУЛЯ СЛАЙДЕРА */

const carousel = document.querySelector('.solutions__slider');
const tape = carousel.querySelector('.solutions__slider-list');
const slides = carousel.querySelectorAll('.solutions__slider-item');
const arrowLeft = carousel.querySelector('.solutions__slider-btn--prev');
const arrowRight = carousel.querySelector('.solutions__slider-btn--next');
const sliderSwitcher = document.querySelectorAll(".solutions__slider-radio-group input");
const slideWidth = 960;
let position = 0;
const startPosition = 0;
const endPosition = -slideWidth * (slides.length - 1);

sliderSwitcher.forEach((element, id) => element.addEventListener("click", () => {
  position = -(slideWidth*id);
  tape.style.marginLeft = position + 'px';
}));

const setSwitcherIndicator = () => {
  sliderSwitcher.forEach((element) => {
    element.checked="false";
    sliderSwitcher[Math.abs(position/slideWidth)].checked="true";
  })
}

const shiftRight = () => {
  position -= slideWidth;
  if (position < endPosition) {
    position = 0;
  }
  position = Math.max(position, endPosition);
  tape.style.marginLeft = position + 'px';
  setSwitcherIndicator();
}

const shiftLeft = () => {
  position += slideWidth;
  if (position > startPosition) {
    position = endPosition;
  }
  position = Math.min(position, startPosition);
  tape.style.marginLeft = position + 'px';
  setSwitcherIndicator();
}

arrowRight.onclick = shiftRight;
arrowLeft.onclick = shiftLeft;

// setInterval(shiftRight, 5000);



/* VIDEO SCRIPT */
/* ТУТ ПОДУМАЙ ХОРОШО, ГДЕ НЕЛЬЗЯ ЕС6+ ИСПОЛЬЗОВАТЬ */
var supportsVideo = !!document.createElement('video').canPlayType;

if (supportsVideo) {

  const videoContainer = document.querySelector('.video-module');
  const video = videoContainer.querySelector('.video-module__display');
  const videoControls = videoContainer.querySelector('.video-module__controls');

  video.controls = false;
  videoControls.style.display = 'grid';


  /* Timeline */
  const progress = videoControls.querySelector('.v-controls__timeline-full');
  const progressBar = videoControls.querySelector('.v-controls__timeline-filled');

  // Занесли в элемент прогресс данные о длине видео
  video.addEventListener('loadedmetadata', () => {
    progress.setAttribute('max', video.duration);
  });

  // Если позиция таймлайна поменялась, то...
  video.addEventListener('timeupdate', function() {
    if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration); // Для мобильных браузеров
    progress.value = video.currentTime; // ...меняем текущее значение прогресса...
    progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%'; // ...и перерисовываем шкалу заполненности
  });

  // Реакция на клик пользователя в по таймлайну
  progress.addEventListener('click', function(evt) {
    video.currentTime = (evt.offsetX / this.offsetWidth) * video.duration;
  });


  /* Play / Pause */
  const playPauseFunction = () => {
    if (video.paused || video.ended) video.play();
    else video.pause();
  }
  const playpause = videoControls.querySelector('.v-controls__play-pause');
  playpause.addEventListener('click', playPauseFunction);
  video.addEventListener('click', playPauseFunction);

  /* Stop */
  const stop = videoControls.querySelector('.v-controls__stop');
  stop.addEventListener('click', () => {
    video.pause();
    video.currentTime = 0;
    progress.value = 0;
  });


  /* Sound */
  const mute = videoControls.querySelector('.v-controls__mute');
  const volinc = videoControls.querySelector('.v-controls__sound-up');
  const voldec = videoControls.querySelector('.v-controls__sound-down');

  var alterVolume = (dir) => {
    var currentVolume = Math.floor(video.volume * 10) / 10;
    if (dir === '+') {
      if (currentVolume < 1) video.volume += 0.1;
    }
    else if (dir === '-') {
     if (currentVolume > 0) video.volume -= 0.1;
    }
  }

  mute.addEventListener('click', () => {
    video.muted = !video.muted;
  });

  // Ага... когда сначала мышью тычешь в дефолтный контроль звука, значение становится не точным и как итог переваливает за единицу (или не может стать нулевым). В принципе, учитывая, что одновременно не может быть кастомного управления звуком или встроенного - можешь на эту ошибку забить, она вероятна только при отладке

  volinc.addEventListener('click', () => {
    alterVolume('+');
    // console.log(video.volume);
  });

  voldec.addEventListener('click', () => {
    alterVolume('-');
    // console.log(video.volume);
  });


  /* Fullscreen */
  let fullscreen = videoControls.querySelector('.v-controls__fullscreen');

  // Проверка, поддерживает ли браузер Fullscreen API
  var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
  // Если не поддерживает - прячем кнопку
  if (!fullScreenEnabled) { // 
    fullscreen.style.display = 'none';
  }

  // Функция установки видеоконтейнеру атрибута полноэкранности
  var setFullscreenData = function(state) {
    videoContainer.setAttribute('data-fullscreen', !!state);
  }

  
  // Функция проверки, находится ли документ в полноэкранном режиме
   var isFullScreen = function() {
     return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
   }

   
   

  // Функция-обработчик, свитчер фулскрина
  var handleFullscreen = function() {
    // Если режим фулскрина активен...
    if (isFullScreen()) {
      // ... то выйти из режима фуллскрин
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setFullscreenData(false);
    }
    else {
      // ...иначе войти в полноэкранный режим
      if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
      else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
      else if (videoContainer.webkitRequestFullScreen) video.webkitRequestFullScreen();
      else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
      setFullscreenData(true);
    }
  }

  // Слушатель кнопки фулскрина
  fullscreen.addEventListener('click', function() {
    handleFullscreen();
  });

  // Слушатели событий изменения полноэкранного режима из других элементов управления
  document.addEventListener('fullscreenchange', function(e) {
    setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
  });
  document.addEventListener('webkitfullscreenchange', function() {
    setFullscreenData(!!document.webkitIsFullScreen);
  });
  document.addEventListener('mozfullscreenchange', function() {
    setFullscreenData(!!document.mozFullScreen);
  });
  document.addEventListener('msfullscreenchange', function() {
    setFullscreenData(!!document.msFullscreenElement);
  });


}
