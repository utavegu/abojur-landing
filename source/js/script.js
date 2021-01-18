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

var supportsVideo = !!document.createElement('video').canPlayType;

if (supportsVideo) {

  const videoContainer = document.querySelector('.video-module');
  const videoDisplay = videoContainer.querySelector('.video-module__display');
  const videoControls = videoContainer.querySelector('.video-module__controls');

  videoDisplay.controls = false;
  videoControls.style.display = 'grid';


  /* Блок управления таймлайном */

  const fullTimeline = videoControls.querySelector('.v-controls__timeline-full');
  const filledTimeline = videoControls.querySelector('.v-controls__timeline-filled');

  const currentTimeIndicator = videoControls.querySelector('.v-controls__current-time');
  const fullTimeIndicator = videoControls.querySelector('.v-controls__full-time');

  const getTime = (time) => { 
    let minutes = Math.trunc(time/60);
    if (minutes < 10) minutes = `0${minutes}`;
    let seconds = Math.trunc(time%60);
    if (seconds < 10) seconds = `0${seconds}`;
    return `${minutes}:${seconds}`;
  }

  // Занесли в элемент прогресс (и не только в него) данные о длине видео
  videoDisplay.addEventListener('loadedmetadata', () => {
    fullTimeline.setAttribute('max', videoDisplay.duration);
    currentTimeIndicator.textContent = "00:00";
    fullTimeIndicator.textContent = getTime(videoDisplay.duration);
  });

  // Если позиция таймлайна поменялась, то...
  videoDisplay.addEventListener('timeupdate', () => {
    if (!fullTimeline.getAttribute('max')) fullTimeline.setAttribute('max', videoDisplay.duration); // Для мобильных браузеров
    fullTimeline.value = videoDisplay.currentTime; // ...меняем текущее значение прогресса...
    filledTimeline.style.width = Math.floor((videoDisplay.currentTime / videoDisplay.duration) * 100) + '%'; // ...и перерисовываем шкалу заполненности
    currentTimeIndicator.textContent = getTime(videoDisplay.currentTime);
  });

  // Реакция на клик пользователя в по таймлайну
  fullTimeline.addEventListener('click', function (evt) {
    videoDisplay.currentTime = (evt.offsetX / this.offsetWidth) * videoDisplay.duration;
  });

  const playPauseButton = videoControls.querySelector('.v-controls__play-pause');

  const playPauseFunction = () => {
    if (videoDisplay.paused || videoDisplay.ended) {
      videoDisplay.play();
      playPauseButton.style = 'background-image: url("../img/svg/player/pause-white-18dp.svg")';
    }
    else {
      videoDisplay.pause();
      playPauseButton.style = 'background-image: url("../img/svg/player/play_arrow-white-18dp.svg")';
    }
  }
  
  playPauseButton.addEventListener('click', playPauseFunction);
  videoDisplay.addEventListener('click', playPauseFunction);

  videoControls.querySelector('.v-controls__stop').addEventListener('click', () => {
    videoDisplay.pause();
    videoDisplay.currentTime = 0;
    fullTimeline.value = 0;
  });

  videoControls.querySelector('.v-controls__rewind-right').addEventListener('click', () => videoDisplay.currentTime += 5);
  videoControls.querySelector('.v-controls__rewind-left').addEventListener('click', () => videoDisplay.currentTime -= 5);


  /* Блок управления звуком */
  const muteButton = videoControls.querySelector('.v-controls__mute');
  const soundIndicator = videoControls.querySelector('.v-controls__sound-indicator');

  const changeVolume = (dir) => {
    let currentVolume = Math.floor(videoDisplay.volume * 10) / 10;
    if (dir === '+') {
      if (currentVolume < 1) {
        videoDisplay.volume = (videoDisplay.volume + 0.1).toFixed(1);
        soundIndicator.value = Number(soundIndicator.value) + 0.1;
      }
    }
    else if (dir === '-') {
      if (currentVolume > 0) {
        videoDisplay.volume = (videoDisplay.volume - 0.1).toFixed(1);
        soundIndicator.value = Number(soundIndicator.value) - 0.1;
      }
    }
  }

  muteButton.addEventListener('click', () => {
    videoDisplay.muted = !videoDisplay.muted;
    if (videoDisplay.muted) muteButton.style = 'background-image: url("../img/svg/player/volume_off-white-18dp.svg")';
    else muteButton.style = 'background-image: url("../img/svg/player/volume_mute-white-18dp.svg")';
  });

  videoControls.querySelector('.v-controls__sound-up').addEventListener('click', () => {
    changeVolume('+');
  });

  videoControls.querySelector('.v-controls__sound-down').addEventListener('click', () => {
    changeVolume('-');
  });

	soundIndicator.addEventListener("input", () => {
    videoDisplay.volume = soundIndicator.value;
	});


  /* Блок управления полноэкранным режимом */
  const fullscreenButton = videoControls.querySelector('.v-controls__fullscreen');

  // Проверка, поддерживает ли браузер Fullscreen API
  const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
  // Если не поддерживает - прячем кнопку
  if (!fullScreenEnabled) { // 
    fullscreenButton.style.display = 'none';
  }

  // Функция установки видеоконтейнеру атрибута полноэкранности
  const setFullscreenData = (state) => {
    videoContainer.setAttribute('data-fullscreen', !!state);
  }

  
  // Функция проверки, находится ли документ в полноэкранном режиме
  const isFullScreen = function() {
    return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
  }

  // Функция-обработчик, свитчер фулскрина
  const handleFullscreen = function() {
    // Если режим фулскрина активен...
    if (isFullScreen()) {
      // ... то выйти из режима фуллскрин
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setFullscreenData(false);
      fullscreenButton.style = 'background-image: url("../img/svg/player/fullscreen-white-18dp.svg")';
    }
    else {
      // ...иначе войти в полноэкранный режим
      if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
      else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
      else if (videoContainer.webkitRequestFullScreen) videoDisplay.webkitRequestFullScreen();
      else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
      setFullscreenData(true);
      fullscreenButton.style = 'background-image: url("../img/svg/player/fullscreen_exit-white-18dp.svg")';
    }
  }

  // Слушатель кнопки фулскрина
  fullscreenButton.addEventListener('click', () => {
    handleFullscreen();
  });

  // Слушатели событий изменения полноэкранного режима из других элементов управления
  document.addEventListener('fullscreenchange', () => {
    setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
  });
  document.addEventListener('webkitfullscreenchange', () => {
    setFullscreenData(!!document.webkitIsFullScreen);
  });
  document.addEventListener('mozfullscreenchange', () => {
    setFullscreenData(!!document.mozFullScreen);
  });
  document.addEventListener('msfullscreenchange', () => {
    setFullscreenData(!!document.msFullscreenElement);
  });

}
