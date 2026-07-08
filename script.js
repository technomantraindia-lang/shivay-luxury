/* ── Loading Screen Logic ────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById("loader");
  const loaderContent = document.getElementById("loader-content");
  const pageWrapper = document.getElementById("page-wrapper");
  if (!loader || !loaderContent || !pageWrapper) return;

  document.body.style.overflow = "hidden";

  // Letters finish at ~1.3s, tagline at 1.8s (1s delay + 0.8s animation)
  // Wait just 300ms after tagline completes, then zoom
  setTimeout(() => {
    // Start zoom + reveal page + fade loader (all synchronized)
    loaderContent.classList.add("is-zooming");
    loader.classList.add("is-fading");
    
    pageWrapper.classList.remove("is-loading");
    pageWrapper.classList.add("is-revealed");

    // Cleanup after loader fade completes (zoom 1s + fade delay 0.7s + fade 0.45s)
    setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.style.overflow = "";
    }, 1300);

  }, 1500); // Letters + tagline done by ~1.8s, starting at 1.5s gives overlap for flow
})();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const counters = document.querySelectorAll("[data-count]");
const revealItems = document.querySelectorAll("[data-reveal], [data-reveal-collection]");
const storySlider = document.querySelector("[data-story-slider]");
const serviceSection = document.querySelector("#services");

const storySlides = [
  {
    image: "assets/hero-luxury-interior.png",
    preview: "assets/about-kitchen.png",
    title: "The Private Sanctuary",
    eyebrow: "Signature Journey",
    text: "A perfect balance of modern design and tranquil textures, shaped into an elegant space for everyday comfort.",
    previewLabel: "Infinity View Concept",
    alt: "Bright luxury living room interior with refined furniture",
  },
  {
    image: "assets/hero-luxury-interior-close.png",
    preview: "assets/about-dining.png",
    title: "Warm Material Stories",
    eyebrow: "Crafted Mood",
    text: "Layered lighting, tactile timber, and soft silhouettes create a warm interior story with quiet luxury.",
    previewLabel: "Candlelight Concept",
    alt: "Warm candlelit luxury interior with wooden table",
  },
  {
    image: "assets/about-kitchen.png",
    preview: "assets/hero-luxury-interior.png",
    title: "Collected Everyday Luxury",
    eyebrow: "Modern Living",
    text: "Practical spaces are refined through proportion, storage, surface detail, and an elevated material palette.",
    previewLabel: "Kitchen Detail Concept",
    alt: "Elegant kitchen with warm wood and cream cabinets",
  },
  {
    image: "assets/about-dining.png",
    preview: "assets/about-kitchen.png",
    title: "Dining With Soft Rhythm",
    eyebrow: "Interior Moments",
    text: "Intimate corners are composed with sculptural furniture, calm tones, and details that feel personal.",
    previewLabel: "Dining Nook Concept",
    alt: "Premium dining space with warm lighting",
  },
];

const serviceItems = [
  {
    number: "01",
    image: "assets/hero-luxury-interior.png",
    title: "Signature<br />Living Concepts",
    description:
      "Complete interior concepts that seamlessly blend elegance, comfort, and timeless sophistication.",
    alt: "Signature luxury living concept with fireplace and refined furniture",
  },
  {
    number: "02",
    image: "assets/hero-luxury-interior-close.png",
    title: "Lighting<br />Concepts",
    description:
      "Layered lighting plans that shape mood, highlight finishes, and bring warmth into every interior moment.",
    alt: "Warm luxury interior detail with ambient lighting",
  },
  {
    number: "03",
    image: "assets/about-kitchen.png",
    title: "Architectural<br />Surfaces",
    description:
      "Premium counters, panels, textures, and finishes curated for long-lasting elegance and daily use.",
    alt: "Elegant kitchen surfaces with warm timber and cream cabinetry",
  },
  {
    number: "04",
    image: "assets/about-dining.png",
    title: "Modular<br />Solutions",
    description:
      "Tailored storage, furniture systems, and modular layouts designed for Indian homes and modern lifestyles.",
    alt: "Refined dining corner with curated furniture",
  },
  {
    number: "05",
    image: "assets/hero-luxury-interior.png",
    title: "Art &<br />Decor",
    description:
      "Objects, art, styling, and final accents selected to give each space a personal, complete expression.",
    alt: "Luxury living room with curated decor and artful details",
  },
];

function animateCounter(counter) {
  const target = Number(counter.dataset.count || 0);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased).toString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function showRevealItem(item) {
  item.classList.add("is-visible");
}

function initStorySlider() {
  if (!storySlider) return;

  const image = storySlider.querySelector(".story__image");
  const card = storySlider.querySelector(".feature-card");
  const eyebrow = storySlider.querySelector(".story__eyebrow");
  const title = storySlider.querySelector(".feature-card h3");
  const text = storySlider.querySelector(".feature-card p");
  const preview = storySlider.querySelector(".mini-card img");
  const previewLabel = storySlider.querySelector(".mini-card span");
  const dots = storySlider.querySelectorAll(".story__controls span");
  const prev = storySlider.querySelector("[data-story-prev]");
  const next = storySlider.querySelector("[data-story-next]");
  let current = 0;
  let locked = false;

  function renderSlide(index) {
    const slide = storySlides[index];

    image.src = slide.image;
    image.alt = slide.alt;
    preview.src = slide.preview;
    previewLabel.textContent = slide.previewLabel;
    eyebrow.textContent = slide.eyebrow;
    title.textContent = slide.title;
    text.textContent = slide.text;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function goToSlide(nextIndex) {
    if (locked) return;
    locked = true;
    current = (nextIndex + storySlides.length) % storySlides.length;
    storySlider.classList.add("is-switching");
    card.classList.add("is-changing");

    window.setTimeout(() => {
      renderSlide(current);
      storySlider.classList.remove("is-switching");
      storySlider.classList.add("is-settling");
      card.classList.remove("is-changing");
    }, 520);

    window.setTimeout(() => {
      storySlider.classList.remove("is-settling");
      locked = false;
    }, 1420);
  }

  prev.addEventListener("click", () => goToSlide(current - 1));
  next.addEventListener("click", () => goToSlide(current + 1));
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });
}

function initServices() {
  if (!serviceSection) return;

  const tabs = serviceSection.querySelectorAll("[data-service-tab]");
  const featured = serviceSection.querySelector("[data-service-feature]");
  const image = serviceSection.querySelector("[data-service-image]");
  const number = serviceSection.querySelector("[data-service-number]");
  const title = serviceSection.querySelector("[data-service-title]");
  const description = serviceSection.querySelector("[data-service-description]");
  const accordions = serviceSection.querySelectorAll("[data-service-accordion]");

  function setFeatured(index) {
    const item = serviceItems[index];
    if (!item || !featured) return;

    featured.classList.add("is-changing");
    window.setTimeout(() => {
      image.src = item.image;
      image.alt = item.alt;
      number.textContent = item.number;
      title.innerHTML = item.title;
      description.textContent = item.description;
      featured.classList.remove("is-changing");
    }, 180);

    tabs.forEach((tab, tabIndex) => {
      tab.classList.toggle("is-active", tabIndex === index);
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      setFeatured(index);
    });
  });

  accordions.forEach((accordion) => {
    const button = accordion.querySelector("button");
    button.addEventListener("click", () => {
      accordions.forEach((item) => {
        const isCurrent = item === accordion;
        item.classList.toggle("is-open", isCurrent);
        item.querySelector("button").setAttribute("aria-expanded", String(isCurrent));
      });
    });
  });
}

function watchRevealItems() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(showRevealItem);
    counters.forEach(animateCounter);
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        showRevealItem(entry.target);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

if (reduceMotion) {
  revealItems.forEach(showRevealItem);
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.count || "0";
  });
  initStorySlider();
  initServices();
} else {
  watchRevealItems();
  initStorySlider();
  initServices();
}

// ─── SIDEBAR MENU ─────────────────────────────────────────────────────────────

function initSidebar() {
  const menuBtn = document.querySelector('.nav__menu');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('sidebar-close');
  const navLinks = sidebar ? sidebar.querySelectorAll('.sidebar__link') : [];

  if (!menuBtn || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('sidebar-active');
    sidebar.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn && closeBtn.focus();
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('sidebar-active');
    sidebar.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    menuBtn.focus();
  }

  // Open on menu button click
  menuBtn.addEventListener('click', openSidebar);

  // Close on X button
  closeBtn && closeBtn.addEventListener('click', closeSidebar);

  // Close on overlay click
  overlay.addEventListener('click', closeSidebar);

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  // Close when a nav link is clicked (smooth scroll takes over)
  navLinks.forEach((link) => {
    link.addEventListener('click', closeSidebar);
  });
}

initSidebar();

// ─── END SIDEBAR MENU ─────────────────────────────────────────────────────────

// ─── ENQUIRY FORM ─────────────────────────────────────────────────────────────

function initEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  const successPanel = document.getElementById("enquiry-success");
  const select = document.getElementById("enq-interest");

  if (!form || !successPanel) return;

  // Mark select as having a value so CSS can style it correctly
  if (select) {
    select.addEventListener("change", () => {
      select.classList.toggle("has-value", select.value !== "");
    });
  }

  // Validate a single field – returns true if valid
  function validateField(field) {
    const isEmpty = field.value.trim() === "";
    const isEmailField = field.type === "email";
    const isPhoneField = field.type === "tel";

    let invalid = isEmpty;

    if (!isEmpty && isEmailField) {
      invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    }

    if (!isEmpty && isPhoneField) {
      invalid = !/^[\d\s\+\-\(\)]{7,15}$/.test(field.value.trim());
    }

    field.classList.toggle("is-invalid", invalid);
    return !invalid;
  }

  // Live validation: clear error once the user starts correcting a field
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
    });

    field.addEventListener("blur", () => {
      if (field.hasAttribute("required")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Validate all required fields
    const requiredFields = form.querySelectorAll("[required]");
    let allValid = true;

    requiredFields.forEach((field) => {
      if (!validateField(field)) {
        allValid = false;
      }
    });

    if (!allValid) {
      // Scroll the first invalid field into view
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
      return;
    }

    // Disable submit while "sending"
    const submitBtn = form.querySelector(".enquiry__submit");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
    }

    // Simulate async send (replace with real fetch/API call as needed)
    window.setTimeout(() => {
      form.hidden = true;
      successPanel.hidden = false;

      // Scroll the success message into view
      successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 800);
  });
}

initEnquiryForm();

// ─── END ENQUIRY FORM ─────────────────────────────────────────────────────────

// ─── STORY IMAGE REVEAL ──────────────────────────────────────────────────────

function initStoryImageReveal() {
  if (reduceMotion) return;

  const storyImage = document.querySelector('[data-reveal-story="zoom-out"]');
  if (!storyImage) return;

  if (!("IntersectionObserver" in window)) {
    storyImage.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 } // Triggers when 60% of the image is in the viewport
  );

  observer.observe(storyImage);
}

initStoryImageReveal();

// ─── END STORY IMAGE REVEAL ──────────────────────────────────────────────────

