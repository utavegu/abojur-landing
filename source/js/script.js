'use strict';



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



/* SLIDER SCRIPT */

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

setInterval(shiftRight, 5000);



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

  videoDisplay.addEventListener('loadedmetadata', () => {
    fullTimeline.setAttribute('max', videoDisplay.duration);
    currentTimeIndicator.textContent = "00:00";
    fullTimeIndicator.textContent = getTime(videoDisplay.duration);
  });

  videoDisplay.addEventListener('timeupdate', () => {
    if (!fullTimeline.getAttribute('max')) fullTimeline.setAttribute('max', videoDisplay.duration); // Для мобильных браузеров
    fullTimeline.value = videoDisplay.currentTime;
    filledTimeline.style.width = Math.floor((videoDisplay.currentTime / videoDisplay.duration) * 100) + '%';
    currentTimeIndicator.textContent = getTime(videoDisplay.currentTime);
    if (videoDisplay.ended) {
      playPauseButton.style = 'background-image: url("../img/svg/player/play_arrow-white-18dp.svg")';
    }
  });

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
    playPauseButton.style = 'background-image: url("../img/svg/player/play_arrow-white-18dp.svg")';
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

  soundIndicator.addEventListener("input", () => {
    videoDisplay.volume = soundIndicator.value;
  });
  
  soundIndicator.addEventListener("change", () => {
    if (soundIndicator.value == 0) muteButton.setAttribute("disabled", "disabled");
    else muteButton.removeAttribute("disabled");
  });

  muteButton.addEventListener('click', () => {
    videoDisplay.muted = !videoDisplay.muted;
    let previousSoundLevel = videoDisplay.volume;
    if (videoDisplay.muted) {
      muteButton.style = 'background-image: url("../img/svg/player/volume_off-white-18dp.svg")';
      soundIndicator.value = 0;
      soundIndicator.setAttribute("disabled", "disabled");
    }
    else {
      muteButton.style = 'background-image: url("../img/svg/player/volume_mute-white-18dp.svg")';
      soundIndicator.value = previousSoundLevel;
      soundIndicator.removeAttribute("disabled");
    }   
  });

  videoControls.querySelector('.v-controls__sound-up').addEventListener('click', () => {
    changeVolume('+');
  });

  videoControls.querySelector('.v-controls__sound-down').addEventListener('click', () => {
    changeVolume('-');
  });

  /* Блок управления полноэкранным режимом */
  const fullscreenButton = videoControls.querySelector('.v-controls__fullscreen');

  const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
  if (!fullScreenEnabled) { // 
    fullscreenButton.style.display = 'none';
  }

  const setFullscreenData = (state) => {
    videoContainer.setAttribute('data-fullscreen', !!state);
  }

  const isFullScreen = function() {
    return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
  }

  const handleFullscreen = function() {
    if (isFullScreen()) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setFullscreenData(false);
      fullscreenButton.style = 'background-image: url("../img/svg/player/fullscreen-white-18dp.svg")';
    }
    else {
      if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
      else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
      else if (videoContainer.webkitRequestFullScreen) videoDisplay.webkitRequestFullScreen();
      else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
      setFullscreenData(true);
      fullscreenButton.style = 'background-image: url("../img/svg/player/fullscreen_exit-white-18dp.svg")';
    }
  }

  fullscreenButton.addEventListener('click', () => {
    handleFullscreen();
  });

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



/* CARDS SCRIPT */
const cards = document.querySelectorAll(".production__card-item");

console.log(cards[0].querySelector(".production__card-heading").textContent);

cards.forEach(card => card.addEventListener("click", () => {
  console.log(`Товар "${card.querySelector(".production__card-heading").textContent}" добавлен в корзину`);
}));



/*----- MODALS BLOCK -----*/

/* Modals-common */

/* Modal-consultation script */

const askQuestionButton = document.querySelector(".promo__button");
const modalConsultation = document.querySelector(".modal-consultation");
const modalConsultationCloseButton = modalConsultation.querySelector(".modal-consultation__close");
const modalConsultationSendButton = modalConsultation.querySelector(".modal-consultation__send");
const modalConsultationTraps = modalConsultation.querySelectorAll(".focus-trap");

const modalConsultationOpen = () => {
  document.body.classList.add("overlay");
  modalConsultation.classList.add("is-opened");
  modalConsultation.querySelector("textarea").focus();
  document.addEventListener("keydown", onEscKeyDown);
  document.querySelector(".overlay").addEventListener("click", onOverlayClick);
}

const modalConsultationClose = () => {
  document.body.classList.remove("overlay");
  modalConsultation.classList.remove("is-opened");
  document.removeEventListener("keydown", onEscKeyDown);
  document.body.removeEventListener("click", onOverlayClick);
}

const onEscKeyDown = (evt) => {
  if (evt.key === "Escape" || evt.key === "Esc") {
    modalConsultationClose();
  }
};

const onOverlayClick = (evt) => {
  if (evt.target.className === "overlay") {
    modalConsultationClose();
  };
};

askQuestionButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  evt.stopPropagation() 
  modalConsultationOpen();
});

modalConsultationCloseButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  modalConsultationClose();
});

modalConsultationTraps.forEach(element => element.addEventListener("focus", () => {
  if (element.classList.contains("focus-trap--upper")) {
    modalConsultation.querySelector(".modal-consultation__close").focus();
  } else {
    modalConsultation.querySelector("textarea").focus();
  }
}));



/* FEEDBACK-MODAL SCRIPT */
const feedbackSendButton = document.querySelector(".feedback__button");
const modalFeedback = document.querySelector(".modal-feedback");
const feedbackAgree = document.querySelector(".feedback__checkbox");
const feedbackForm = document.querySelector(".feedback form");

const modalFeedbackOpen = () => {
  document.body.classList.add("overlay");
  modalFeedback.classList.add("is-opened");
}

const modalFeedbackClose = () => {
  document.body.classList.remove("overlay");
  modalFeedback.classList.remove("is-opened");
}

feedbackForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  modalFeedbackOpen();
  feedbackForm.reset();
  setTimeout(modalFeedbackClose, 3000);
})

feedbackAgree.addEventListener("invalid", function () {
  this.setCustomValidity("К сожалению, нам нужно, чтобы вы подтвердили свое согласие, как того требует текущее законодательство");
})

feedbackAgree.addEventListener("change", function () {
  this.setCustomValidity("");
})