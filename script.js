"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");
const sections = document.querySelectorAll(".section");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainers = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const images = document.querySelectorAll(".features__img");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");
    siblings.forEach((ele) => {
      if (ele !== link) ele.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnScrollTo.addEventListener("click", function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: "smooth" });
});

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// smooth navigation using event propagation
nav.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.getAttribute("class") === "nav__link")
    document
      .querySelector(e.target.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  e.stopPropagation();
});

tabsContainers.addEventListener("click", function (e) {
  const tab = e.target.closest(".operations__tab");

  if (!tab) return;

  const idx = tab.dataset.tab;
  const div = document.querySelector(`.operations__content--${idx}`);

  tabsContent.forEach((div) =>
    div.classList.remove("operations__content--active")
  );
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));

  tab.classList.add("operations__tab--active");
  div.classList.add("operations__content--active");
});

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// without using event propagation
// const links = document.querySelectorAll('.nav__link');
// const logo = document.querySelector('img');

// const handle = function (link1) {
//   logo.style.opacity = this;
//   links.forEach(link2 => {
//     if (link1 !== link2) link2.style.opacity = this;
//   });
// };

// links.forEach(link1 => {
//   link1.addEventListener('mouseover', handle.bind(0.5, link1));
//   link1.addEventListener('mouseout', handle.bind(1, link1));
// });

// Observe Navigation
(function () {
  const navHeight = nav.getBoundingClientRect().height;
  const obsFunc = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  };
  const options = {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  };
  const observer = new IntersectionObserver(obsFunc, options);
  observer.observe(header);
  return observer;
})();

// Observe Sections
(function () {
  const secFun = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  };

  const obserSec = new IntersectionObserver(secFun, {
    root: null,
    threshold: 0.1,
  });

  sections.forEach((sec) => {
    sec.classList.add("section--hidden");
    obserSec.observe(sec);
  });
})();

// load Images
(function () {
  const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });

    observer.unobserve(entry.target);
  };

  const obsImg = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0.1,
  });

  images.forEach((img) => obsImg.observe(img));
})();

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  // Observe Slider

  const obsSlid = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    });
  };

  const obsSlider = new IntersectionObserver(obsSlid, {
    root: null,
    threshold: Array.from({ length: 10 }, (_, i) => (i + 1) * 0.1),
  });

  obsSlider.observe(slider);
};
slider();
