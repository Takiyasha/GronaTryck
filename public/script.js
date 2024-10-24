var productSwiper = new Swiper(".productSwiper", {
  slidesPerView: 4,    // Standardvärde
  spaceBetween: 30,    // Avstånd mellan slides
  loop: true,          // Loop-funktion
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {       // Definiera olika värden beroende på skärmbredd
    320: {             // Vid skärmar ≥ 320px
      slidesPerView: 1,  // Visa 1 slide
      spaceBetween: 10,  // Avstånd mellan slides minskat till 10px
    },
    640: {             // Vid skärmar ≥ 640px
      slidesPerView: 2,  // Visa 2 slides
      spaceBetween: 20,  // Avstånd mellan slides
    },
    1024: {            // Vid skärmar ≥ 1024px
      slidesPerView: 3,  // Visa 3 slides
      spaceBetween: 30,  // Avstånd mellan slides
    },
    1440: {            // Vid skärmar ≥ 1440px
      slidesPerView: 4,  // Visa 4 slides (eller mer beroende på ditt standardvärde)
      spaceBetween: 30,  // Samma avstånd som standard
    }
  }
});


var heroSwiper = new Swiper(".heroSwiper", {
  slidesPerView: 1,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});


var swiper = new Swiper(".colabSwiper", {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 5,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2,
    slideShadows: false,
  },
  loop: true,
  speed: 2000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1440: {
      slidesPerView: 4,
    }
  },
  
});

/* Accordion */

document.querySelectorAll('.hallbarhetAccordion-header').forEach(header => {
  header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true' || false;
      header.setAttribute('aria-expanded', !expanded);
  });
});