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



/* *** script */