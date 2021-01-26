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



/*----- MODALS BLOCK -----*/

/* Modals-common */

const commonModalOpen = () => {
  document.body.classList.add("overlay");
  document.addEventListener("keydown", onEscKeyDown);
  document.querySelector(".overlay").addEventListener("click", onOverlayClick);
  floatingBasketButton.style.display = "none";
  anchor.classList.remove('anchor-show');
}

const commonModalClose = () => {
  document.body.classList.remove("overlay");
  document.removeEventListener("keydown", onEscKeyDown);
  document.body.removeEventListener("click", onOverlayClick);
  floatingBasketButton.style.display = "block";
  anchor.classList.add('anchor-show');
}

const allModalClose = () => {
  document.querySelectorAll(".modal").forEach((currentModal) => {
    if (currentModal.classList.contains("is-opened")) {
      currentModal.classList.remove("is-opened");
      commonModalClose();
    }
  })
}

const onEscKeyDown = (evt) => {
  if (evt.key === "Escape" || evt.key === "Esc") {
    allModalClose();
  }
};

const onOverlayClick = (evt) => {
  if (evt.target.className === "overlay") {
    allModalClose();
  };
};

const onCloseButtonClick = (evt) => {
  evt.preventDefault();
  evt.target.parentNode.parentNode.classList.remove("is-opened");
  commonModalClose();
}



/* Modal-consultation script */

const askQuestionButton = document.querySelector(".promo__button");
const modalConsultation = document.querySelector(".modal-consultation");
const modalConsultationCloseButton = modalConsultation.querySelector(".modal-consultation__close");
const modalConsultationTraps = modalConsultation.querySelectorAll(".focus-trap");

const modalConsultationOpen = () => {
  commonModalOpen();
  modalConsultation.classList.add("is-opened");
  modalConsultation.querySelector("textarea").focus();
}

askQuestionButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  modalConsultationOpen();
});

modalConsultationCloseButton.addEventListener("click", (evt) => {
  onCloseButtonClick(evt);
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
  commonModalOpen();
  modalFeedback.classList.add("is-opened");
}

const modalFeedbackClose = () => {
  commonModalClose();
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



/* Call-back modal */

const callBackButton = document.querySelector(".main-header__call-back");
const modalCallOrder = document.querySelector(".modal-call-order");
const closeModalCallOrderButton = modalCallOrder.querySelector(".modal-call-order__cancel-button");
const submitModalCallOrderButton = modalCallOrder.querySelector(".modal-call-order__submit-button");
const modalCallOrderTraps = modalCallOrder.querySelectorAll(".focus-trap");

const modalCallOrderOpen = () => {
  commonModalOpen();
  modalCallOrder.classList.add("is-opened");
  modalCallOrder.querySelector("input").focus();
}

callBackButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  modalCallOrderOpen();
});

closeModalCallOrderButton.addEventListener("click", (evt) => {
  onCloseButtonClick(evt);
  modalCallOrder.classList.remove("is-opened");
});

modalCallOrderTraps.forEach(element => element.addEventListener("focus", () => {
  if (element.classList.contains("focus-trap--upper")) {
    modalCallOrder.querySelector(".modal-call-order__submit-button").focus();
  } else {
    modalCallOrder.querySelector("input").focus();
  }
}));

modalCallOrder.querySelector("form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  submitModalCallOrderButton.setAttribute("disabled", "true");
  modalCallOrder.querySelector("p").textContent = "Спасибо! В ближайшее время мы вам перезвоним"
  setTimeout(() => {
    submitModalCallOrderButton.removeAttribute("disabled");
    onCloseButtonClick(evt);
    modalCallOrder.classList.remove("is-opened");
    modalCallOrder.querySelector("p").textContent = "Оставьте ваш телефон и мы обязательно свяжемся с вами";
    modalCallOrder.querySelector("form").reset();
  }, 3000);
})



/* SHOPPING-CART MODAL and CARDS SCRIPT */
const openCartButton = document.querySelector(".main-header__shopping-cart"); // Кнопка открытия корзины
const modalShoppingCart = document.querySelector(".modal-shopping-cart"); // Модалка корзины
const closeCartButton = modalShoppingCart.querySelector(".modal-shopping-cart__close-button"); // Кнопка закрытия
const modalShoppingCartTraps = modalShoppingCart.querySelectorAll(".focus-trap"); // Ловушки фокуса
const cartCont = modalShoppingCart.querySelector(".modal-shopping-cart__basket"); // Место для таблицы товара
const clearCartButton = modalShoppingCart.querySelector(".modal-shopping-cart__clear-button"); // Кнопка очистки корзины
const floatingBasketButton = document.querySelector(".aerostat");

const shoppingCartOpen = () => {
  commonModalOpen();
  modalShoppingCart.classList.add("is-opened");
  modalShoppingCart.querySelector(".modal-shopping-cart__close-button").focus();
  openCart();
}

openCartButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  shoppingCartOpen();
});

floatingBasketButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  shoppingCartOpen();
});

closeCartButton.addEventListener("click", (evt) => {
  onCloseButtonClick(evt);
});

clearCartButton.addEventListener("click", () => {
  localStorage.removeItem('cart');
	cartCont.innerHTML = 'Корзина очишена';
})

modalShoppingCartTraps.forEach(element => element.addEventListener("focus", () => {
  if (element.classList.contains("focus-trap--upper")) {
    modalShoppingCart.querySelector(".modal-shopping-cart__order-button").focus();
  } else {
    modalShoppingCart.querySelector(".modal-shopping-cart__close-button").focus();
  }
}));


/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */

const cards = document.querySelectorAll(".production__card-item"); // Все карточки товара

// Навесить слушатель добавления в корзину на каждую карточку товара
cards.forEach(card => card.querySelector(".production__card-button").addEventListener("click", addToCart));

// Записываем данные в LocalStorage
const setCartData = (itemList) => localStorage.setItem('cart', JSON.stringify(itemList));

// Получаем данные из LocalStorage
const getCartData = () => JSON.parse(localStorage.getItem('cart'));

// Функция добавления в корзину
function addToCart () {
  const productList = getCartData() || {};
  const productCard = this.parentNode.parentNode;
  const productArticle = this.getAttribute('data-id');
	const productTitle = productCard.querySelector('.production__card-heading').innerHTML;
  const productPrice = productCard.querySelector('.production__card-price').innerHTML;
	if (productList.hasOwnProperty(productArticle)) { 
		productList[productArticle].count++;
	} else {
		productList[productArticle] = {
      title: productTitle,
      price: productPrice,
      count: 1
    };
  }
  setCartData(productList);
}

// Открываем корзину со списком добавленных товаров
function openCart () {
	const productList = getCartData();
  let renderList = '';
	if (productList !== null) {
    renderList += `<table class="shopping_list"><tr><th>Наименование</th><th>Цена</th><th>Кол-во</th></tr>`;
      for (const product in productList) {
        renderList += `<tr><td>${productList[product].title}</td><td>${productList[product].price}</td><td>${productList[product].count}</td><td><button class="product-add" data-id=${product}>+</button></td><td><button class="product-remove" data-id=${product}>х</button></td><td><button class="product-subtract" data-id=${product}>-</button></td></tr>`;
      }
    renderList += `</table>`;
    cartCont.innerHTML = renderList;

    const addButtons = cartCont.querySelectorAll(".product-add");
    addButtons.forEach(button => button.addEventListener("click", () => {
      productList[button.getAttribute("data-id")].count++;
      setCartData(productList);
    }))

    const subtractButtons = cartCont.querySelectorAll(".product-subtract");
    subtractButtons.forEach(button => button.addEventListener("click", () => {
      productList[button.getAttribute("data-id")].count--;
      setCartData(productList);
    }))

    /*
    1) Вынести в функции адд, суб и рендер (сначала её)
    2) Реализовать функцию ремув
    */


	} else {
		cartCont.innerHTML = 'В корзине пусто';
  }
}

