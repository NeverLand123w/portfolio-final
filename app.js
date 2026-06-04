gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.querySelectorAll(".nav-anchor").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    lenis.scrollTo(this.getAttribute("href"), {
      offset: window.innerWidth > 900 ? -80 : -60,
    });
  });
});

let isMenuOpen = false;
let menuTL = gsap.timeline({ paused: true });

menuTL
  .to("#menu-overlay", {
    x: "0%",
    duration: 0.8,
    ease: "power4.inOut",
  })
  .to(
    ".menu-overlay-links a span",
    {
      y: "0%",
      opacity: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=0.4",
  );

const menuToggleBtn = document.getElementById("menu-toggle");
const line1 = document.getElementById("line-1");
const line2 = document.getElementById("line-2");
const navLogo = document.getElementById("nav-logo");
const navbar = document.getElementById("navbar");

function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  if (isMenuOpen) {
    lenis.stop();
    gsap.to(line1, {
      rotation: 45,
      y: 6.25,
      backgroundColor: "var(--bg)",
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(line2, {
      rotation: -45,
      y: -6.25,
      backgroundColor: "var(--bg)",
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(navLogo, { color: "var(--bg)", duration: 0.4, overwrite: true });
    gsap.to(navbar, {
      backgroundColor: "transparent",
      borderBottomColor: "transparent",
      duration: 0.3,
      overwrite: true,
    });
    menuTL.play();
  } else {
    menuTL.reverse();
    gsap.to(line1, {
      rotation: 0,
      y: 0,
      backgroundColor: "var(--text)",
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(line2, {
      rotation: 0,
      y: 0,
      backgroundColor: "var(--text)",
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(navLogo, {
      color: "var(--text)",
      duration: 0.4,
      delay: 0.2,
      overwrite: true,
    });
    gsap.to(navbar, {
      backgroundColor: "rgba(255, 253, 208, 0.7)",
      borderBottomColor: "rgba(51, 51, 51, 0.2)",
      duration: 0.3,
      delay: 0.4,
      overwrite: true,
    });
    lenis.start();
  }
}

menuToggleBtn.addEventListener("click", toggleMenu);

document.querySelectorAll(".mobile-nav-anchor").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    let target = this.getAttribute("href");
    toggleMenu();
    setTimeout(() => {
      lenis.scrollTo(target, { offset: -60 });
    }, 300);
  });
});

ScrollTrigger.create({
  start: "top top",
  end: 99999,
  onUpdate: (self) => {
    if (!isMenuOpen) {
      if (self.direction === 1 && self.scroll() > 150) {
        gsap.to(navbar, {
          yPercent: -100,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else if (self.direction === -1 || self.scroll() <= 150) {
        gsap.to(navbar, {
          yPercent: 0,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    }
  },
});

const cursor = document.getElementById("cursor");
if (window.matchMedia("(pointer: fine)").matches) {
  document.body.classList.add("has-custom-cursor");
  window.addEventListener("mousemove", (e) =>
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power2.out",
    }),
  );
  document.querySelectorAll(".hover-target").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
}

let progress = 0;
let updateLoader = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 2;
  if (progress > 100) progress = 100;
  document.getElementById("loader-num").innerHTML =
    progress < 10 ? `0${progress}` : progress;
  if (progress === 100) {
    clearInterval(updateLoader);
    initIntroAnimations();
  }
}, 20);

function initIntroAnimations() {
  gsap
    .timeline()
    .to("#loader", {
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      duration: 1.2,
      ease: "power4.inOut",
    })
    .to(
      ".title-word",
      { y: "0%", rotation: 0, duration: 1.4, stagger: 0.15, ease: "expo.out" },
      "-=0.6",
    )
    .to(
      "#hero-divider",
      { scaleX: 1, duration: 1.5, ease: "expo.inOut" },
      "-=1",
    )
    .from(
      ".hero-anim",
      { opacity: 0, y: 10, duration: 1, stagger: 0.1, ease: "power2.out" },
      "-=1.2",
    )
    .fromTo(
      navbar,
      { yPercent: -100 },
      { yPercent: 0, duration: 1.2, ease: "expo.out" },
      "-=1.2",
    );
}

gsap.to(".marquee-track", {
  xPercent: -50,
  ease: "none",
  duration: 15,
  repeat: -1,
});

gsap.to(".skills-container .fade-text-light", {
  scrollTrigger: { trigger: ".skills-container", start: "top 80%" },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
});

let skillsMm = gsap.matchMedia();

skillsMm.add("(min-width: 901px)", () => {
  let track = document.getElementById("skills-track");

  function getScrollAmount() {
    return track.scrollWidth - window.innerWidth;
  }

  const trackTween = gsap.to(track, {
    x: () => -getScrollAmount() - window.innerWidth * 0.05,
    ease: "none",
  });

  ScrollTrigger.create({
    trigger: ".skills-pin-wrap",
    start: "center center",
    end: () => `+=${getScrollAmount() + 500}`,
    pin: true,
    animation: trackTween,
    scrub: 1.2,
    invalidateOnRefresh: true,
  });

  gsap.fromTo(
    ".expertise-panel",
    { opacity: 0, filter: "blur(4px)" },
    {
      opacity: 1,
      filter: "blur(0px)",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".skills-pin-wrap",
        start: "top 60%",
      },
    },
  );
});

skillsMm.add("(max-width: 900px)", () => {
  gsap.utils.toArray(".expertise-panel").forEach((panel) => {
    gsap.fromTo(
      panel,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: { trigger: panel, start: "top 85%" },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
    );
  });
});

let accItems = gsap.utils.toArray(".acc-item");
let vCount = accItems.length;

document.documentElement.style.setProperty("--v-count", vCount);

gsap.to(".projects-container .fade-text", {
  scrollTrigger: { trigger: ".projects-container", start: "top 80%" },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
});

gsap.to(".footer .fade-text", {
  scrollTrigger: { trigger: ".footer", start: "top 80%" },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
});

let getActiveVertHeight = () => {
  let maxViewportConstraint = window.innerWidth < 900 ? 50 : 60;
  let availableH = maxViewportConstraint - vCount * 4.5;
  return `${Math.max(15, availableH)}vh`;
};

accItems.forEach((item, i) => {
  let img = item.querySelector("img");
  let content = item.querySelector(".acc-content");
  let header = item.querySelector(".acc-header");
  let title = item.querySelector(".project-title");
  let stackPills = item.querySelectorAll(".proj-tech-stack .pill");

  if (i === 0) {
    gsap.set(header, { opacity: 1 });
    gsap.set(content, { height: () => getActiveVertHeight() });
    gsap.set(img, { scale: 1 });
    gsap.set(title, { letterSpacing: "4px" });
  } else {
    gsap.set(header, { opacity: 0.3 });
    gsap.set(content, { height: 0 });
    gsap.set(img, { scale: 1.2 });
    gsap.set(title, { letterSpacing: "0px" });
    gsap.set(stackPills, { opacity: 0, y: -10 });
  }
});

gsap.fromTo(
  accItems[0].querySelectorAll(
    ".project-title, .tech-label-placeholder, .proj-tech-stack .pill",
  ),
  { y: 15, opacity: 0 },
  {
    scrollTrigger: { trigger: ".projects-container", start: "top 70%" },
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.2,
  },
);

let projectTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".projects-container",
    pin: true,
    start: "top top",
    end: "+=" + vCount * 80 + "%",
    scrub: 1,
    invalidateOnRefresh: true,
  },
});

projectTL.to({}, { duration: 0.15 });

accItems.forEach((item, i) => {
  if (i === 0) return;
  let prevItem = accItems[i - 1];
  let label = `projStep${i}`;

  projectTL
    .addLabel(label)
    .to(
      prevItem.querySelector(".acc-content"),
      { height: 0, duration: 1, ease: "power2.inOut" },
      label,
    )
    .to(
      prevItem.querySelector(".acc-header"),
      { opacity: 0.3, duration: 1, ease: "power2.inOut" },
      label,
    )
    .to(
      prevItem.querySelector(".project-title"),
      { letterSpacing: "0px", duration: 1, ease: "power2.inOut" },
      label,
    )
    .to(
      prevItem.querySelectorAll(".proj-tech-stack .pill"),
      { y: -10, opacity: 0, duration: 0.6, stagger: 0.05 },
      label,
    )
    .to(
      prevItem.querySelector("img"),
      { scale: 1.2, duration: 1, ease: "power2.inOut" },
      label,
    )
    .to(
      item.querySelector(".acc-content"),
      {
        height: () => getActiveVertHeight(),
        duration: 1,
        ease: "power2.inOut",
      },
      label,
    )
    .to(
      item.querySelector(".acc-header"),
      { opacity: 1, duration: 1, ease: "power2.inOut" },
      label,
    )
    .to(
      item.querySelector("img"),
      { scale: 1, duration: 1, ease: "power2.inOut" },
      label,
    )
    .to(
      item.querySelector(".project-title"),
      { letterSpacing: "4px", duration: 1, ease: "power2.inOut" },
      label,
    )
    .fromTo(
      item.querySelectorAll(".proj-tech-stack .pill"),
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
      label,
    )
    .to({}, { duration: 0.3 });
});

window.addEventListener("resize", () => ScrollTrigger.refresh());
