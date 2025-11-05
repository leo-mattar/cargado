// --- GSAP
gsap.registerPlugin(ScrollTrigger);

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

let mm = gsap.matchMedia();

// --------------- LENIS ---------------
window.lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add(time => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --- FADE
function fade() {
  const cards = document.querySelectorAll("[fade]");

  ScrollTrigger.batch(cards, {
    once: true,
    onEnter: batch => {
      batch.forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
        el.classList.add("revealed");

        // Cleanup
        const cleanup = event => {
          if (
            event.propertyName === "opacity" ||
            event.propertyName === "transform"
          ) {
            el.style.transitionDelay = "";
            el.removeEventListener("transitionend", cleanup);
          }
        };

        el.addEventListener("transitionend", cleanup);
      });
    },
  });
}

// --- PARALLAX
function parallax() {
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  parallaxElements.forEach(el => {
    const speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0.12; // default speed

    gsap.to(el, {
      yPercent: -speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "clamp(top bottom)",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}

function blogCopyLink() {
  const wrapEl = document.querySelector(".article_header_share");
  if (!wrapEl) return;

  const triggers = document.querySelectorAll("[data-copy-link]");

  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.preventDefault();

      const currentURL = window.location.href;
      const tinyText = trigger.querySelector(".text-size-tiny");

      navigator.clipboard
        .writeText(currentURL)
        .then(() => {
          if (tinyText) {
            tinyText.classList.remove("hide");
            setTimeout(() => {
              tinyText.classList.add("hide");
            }, 2000);
          }
        })
        .catch(err => console.error("Copy failed:", err));
    });
  });
}

// --------------- INIT ---------------
function init() {
  blogCopyLink();
}

init();

// --------------- MATCHMEDIA (DESKTOP) ---------------
mm.add("(min-width: 992px)", () => {
  fade();
  parallax();
  return () => {
    //
  };
});

// --------------- MATCHMEDIA (TABLET AND MOBILE) ---------------
mm.add("(max-width: 991px)", () => {
  //
  return () => {
    //
  };
});
