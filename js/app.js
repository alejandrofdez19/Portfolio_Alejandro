// FINAL APP.JS - TRAPDOOR COMINVI + FILTER + CURSOR + IMAGEKIT FIX
const toggle = document.getElementById("menuToggle");
const overlay = document.getElementById("menuOverlay");
const wrapper = document.getElementById("siteWrapper");
const menuText = document.getElementById("menuText");
const filterBtns = document.querySelectorAll(".filter__btn");
const cards = document.querySelectorAll(".card");
let isOpen = false;

// 1. TRAPDOOR TIMELINE - CLON COMINVI
const tl = gsap.timeline({ paused: true });
tl.to(
  wrapper,
  {
    y: "88vh",
    scale: 0.92,
    borderRadius: "24px",
    duration: 0.9,
    ease: "power4.inOut",
  },
  0,
)
  .to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
  .fromTo(
    ".menu-links a.big span",
    { yPercent: 100 },
    { yPercent: 0, duration: 0.8, stagger: 0.07, ease: "power4.out" },
    0.2,
  )
  .fromTo(
    ".menu-side",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    0.4,
  );

toggle.addEventListener("click", () => {
  isOpen = !isOpen;
  toggle.classList.toggle("is-open", isOpen);
  overlay.classList.toggle("is-open", isOpen);
  menuText.textContent = isOpen ? "CLOSE" : "MENU";
  if (isOpen) {
    tl.play();
    document.body.style.overflow = "hidden";
  } else {
    tl.reverse();
    document.body.style.overflow = "";
  }
});

// 2. FILTRO GLITCH & GRIT
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    cards.forEach((card) => {
      const show = cat === "all" || card.dataset.category.includes(cat);
      if (show) {
        card.style.display = "flex";
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
        );
      } else {
        gsap.to(card, {
          autoAlpha: 0,
          scale: 0.95,
          duration: 0.25,
          onComplete: () => (card.style.display = "none"),
        });
      }
    });
  });
});

// 3. REVEAL INICIAL
gsap.set(cards, { autoAlpha: 0, y: 24 });
gsap.to(cards, {
  autoAlpha: 1,
  y: 0,
  duration: 0.8,
  stagger: 0.06,
  ease: "power4.out",
  delay: 0.2,
});

// 4. FIX IMAGEKIT - onerror fallback
document.querySelectorAll('img[src*="imagekit"]').forEach((img) => {
  img.addEventListener("error", () => {
    console.warn("ImageKit no cargó:", img.src);
    img.style.background = "#222";
    img.alt = "Error cargando ImageKit - revisa url() con comillas";
  });
});

console.log(
  "%cFINAL: Glitch & Grit + Cominvi trapdoor + ImageKit FIX",
  "background:#ff4d00;color:#fff;padding:8px 12px;font-weight:900",
);

// ===== ANIMACIONES EXTRA - SOLO JS - NO TOCA HTML =====

// 0. HEADER HIDE ON SCROLL (estilo Cominvi)
let lastScroll = 0;
const topbar = document.querySelector(".topbar");
if (topbar) {
  window.addEventListener(
    "scroll",
    () => {
      const curr = window.scrollY;
      if (curr > 120) {
        topbar.classList.add("is-scrolled");
        if (curr > lastScroll) {
          topbar.classList.add("is-hidden");
        } else {
          topbar.classList.remove("is-hidden");
        }
      } else {
        topbar.classList.remove("is-scrolled", "is-hidden");
      }
      lastScroll = curr;
    },
    { passive: true },
  );
}

// 1. INTRO TIMELINE - Filter by reveal
const introTl = gsap.timeline({ delay: 0.2 });
if (document.querySelector(".filter__label")) {
  gsap.set(".filter__label", { autoAlpha: 0, y: 10 });
  gsap.set(".filter__btn", { clipPath: "inset(0 100% 0 0)" });
  introTl
    .to(".filter__label", {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    })
    .to(
      ".filter__btn",
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.9,
        stagger: 0.07,
        ease: "power4.inOut",
      },
      "-=0.2",
    )
    .fromTo(
      ".topbar",
      { yPercent: -100 },
      { yPercent: 0, duration: 0.8, ease: "power4.out" },
      0,
    );
}

// 2. CARDS - Batch reveal mejorado + parallax interno
if (window.ScrollTrigger) {
  ScrollTrigger.batch(".card", {
    onEnter: (batch) => {
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power4.out",
        stagger: 0.08,
        overwrite: true,
        onStart: () => batch.forEach((c) => c.classList.add("is-revealed")),
      });
      // parallax de la imagen dentro
      batch.forEach((card) => {
        const img = card.querySelector(".card__media img");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.15 },
            {
              yPercent: 8,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          );
        }
      });
    },
    start: "top 92%",
  });

  // Footer reveal
  gsap.set(".footer__top span", { autoAlpha: 0, y: 10 });
  gsap.set(".footer__big a", { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch(".footer__top", {
    onEnter: (b) =>
      gsap.to(b[0].querySelectorAll("span"), {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }),
  });
  ScrollTrigger.batch(".footer__big a", {
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
        onStart: () => batch.forEach((el) => el.classList.add("is-revealed")),
      }),
    start: "top 85%",
  });
  ScrollTrigger.batch(".footer__top", {
    onEnter: (b) => b[0].classList.add("is-revealed"),
  });
}

// 3. CURSOR - Estado hover-card + glitch
const cursorEl = document.getElementById("cursor");
if (cursorEl) {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cursorEl.classList.add("is-hover-card");
      cursorEl.querySelector("span").textContent = "VIEW";
    });
    card.addEventListener("mouseleave", () => {
      cursorEl.classList.remove("is-hover-card");
      cursorEl.querySelector("span").textContent = "VIEW";
    });
  });
  document.querySelectorAll(".footer__big a").forEach((a) => {
    a.addEventListener("mouseenter", () => {
      cursorEl.classList.add("is-hover-card");
      cursorEl.querySelector("span").textContent = "GO";
    });
    a.addEventListener("mouseleave", () => {
      cursorEl.classList.remove("is-hover-card");
      cursorEl.querySelector("span").textContent = "VIEW";
    });
  });
}

// 4. FILTRO - animación de texto con scramble sutil
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // efecto de glitch rápido en todos los botones al cambiar filtro
    gsap.fromTo(
      ".filter__title",
      { filter: "blur(0px)" },
      {
        filter: "blur(1px)",
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      },
    );
  });
});

// 5. META BAR - conteo animado al hacer hover (sin cambiar HTML)
document.querySelectorAll(".card__meta").forEach((meta) => {
  const num = meta.querySelector("span:first-child");
  if (!num) return;
  meta.addEventListener("mouseenter", () => {
    gsap.fromTo(
      num,
      { y: 0 },
      { y: -2, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" },
    );
  });
});
