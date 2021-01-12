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

/*
2) Автокарусель
3) Если слайд последний или первый - соответствующая кнопка дизэйблед (и стили для нее пропиши)
*/

const carousel = document.querySelector('.solutions__slider'); // сам модуль слайдера
const tape = carousel.querySelector('.solutions__slider-list'); // лента
const slides = carousel.querySelectorAll('.solutions__slider-item'); // слайды
const arrowLeft = carousel.querySelector('.solutions__slider-btn--prev'); // кнопка влево
const arrowRight = carousel.querySelector('.solutions__slider-btn--next'); // кнопка вправо
const sliderSwitcher = document.querySelectorAll(".solutions__slider-radio-group input"); // радиокнопки

const slideWidth = 960; // ширина слайда
let position = 0; // положение ленты прокрутки

// сдвиг вправо
arrowRight.onclick = function() {
  position -= slideWidth;
  position = Math.max(position, -slideWidth * (slides.length - 1));
  tape.style.marginLeft = position + 'px';
  sliderSwitcher.forEach((element) => {
    element.checked="false";
    sliderSwitcher[Math.abs(position/slideWidth)].checked="true";
  })
};

// сдвиг влево
arrowLeft.onclick = function() {
  position += slideWidth;
  position = Math.min(position, 0);
  tape.style.marginLeft = position + 'px';
  sliderSwitcher.forEach((element) => {
    element.checked="false";
    sliderSwitcher[Math.abs(position/slideWidth)].checked="true";
  })
};

// Свитчер
sliderSwitcher.forEach((element, id) => element.addEventListener("click", () => {
  position = -(slideWidth*id);
  tape.style.marginLeft = position + 'px';
}));






// console.log(Number(tape.style.marginLeft.match(/([0-9]+)/g))/slideWidth);
// Ну и третья задача, АВТОПРОКРУТКА, просто по сет таймауту подставляет в эту же формулу 0, 1, 2, 0, 1, 2...