(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // پس‌زمینه‌ی ستاره‌ای سبک؛ تعداد محدود برای عملکرد بهتر روی موبایل
  const starField = $("#ambient-stars");
  if (starField) {
    const amount = matchMedia("(max-width: 480px)").matches ? 30 : 48;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < amount; i += 1) {
      const star = document.createElement("span");
      star.className = "ambient-star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--dur", `${3 + Math.random() * 4}s`);
      star.style.animationDelay = `${Math.random() * -6}s`;
      fragment.appendChild(star);
    }
    starField.appendChild(fragment);
  }

  // موسیقی فقط با انتخاب کاربر شروع می‌شود؛ فایل assets/piano.mp3 را خودت اضافه کن.
  const music = $("#site-music");
  const musicToggle = $("#music-toggle");
  const musicLabel = $("#music-label");
  if (music && musicToggle) {
    musicToggle.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();
          musicToggle.classList.add("is-playing");
          musicToggle.setAttribute("aria-pressed", "true");
          musicLabel.textContent = "توقف پیانو";
        } catch {
          musicLabel.textContent = "فایل piano.mp3 را اضافه کن";
        }
      } else {
        music.pause();
        musicToggle.classList.remove("is-playing");
        musicToggle.setAttribute("aria-pressed", "false");
        musicLabel.textContent = "پیانوی ما";
      }
    });
    music.addEventListener("ended", () => {
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "پیانوی ما";
    });
  }

  // پاکت‌های تعاملی
  const letterData = {
    always: {
      title: "چیزی که می‌خوام همیشه بدونی",
      text: "رومی جان، لازم نیست همیشه قوی، شاد یا بی‌نقص باشی تا دوست‌داشتنی باشی. می‌خوام بتونی کنار من خودت باشی؛ با روزهای خوبت، خستگی‌هات، حرف‌هات و سکوت‌هات. دوست داشتن برای من یعنی شناختن تو، نه ساختن تصویری بی‌نقص از تو."
    },
    sad: {
      title: "وقتی دلت گرفت، اینو بخون",
      text: "ماه من، اگر امروز روز سختی بود، لازم نیست همین حالا همه‌چیز رو حل کنی. یه نفس آروم بکش و یادت باشه که احساساتت مهمن و سزاوار شنیده شدنن. اگر خواستی حرف بزنی، من با حوصله گوش می‌دم؛ اگر هم کمی زمان خواستی، به زمانت احترام می‌ذارم."
    },
    future: {
      title: "نامه‌ای برای روزهای آینده",
      text: "برای ما که هنوز اول قصه‌ایم: امیدوارم وقتی روزی این نامه رو دوباره می‌خونیم، چیزهای زیادی یاد گرفته باشیم؛ از هم، از زندگی و از راهی که با احترام و مهربونی کنار هم ساخته‌ایم. امیدوارم خاطره‌هامون از این صفحه بیشتر شده باشن."
    }
  };

  const hiddenLetter = $("#hidden-letter");
  const hiddenLabel = $("#hidden-letter-label");
  const hiddenText = $("#hidden-letter-text");
  $$(".envelope").forEach((button) => {
    button.addEventListener("click", () => {
      const item = letterData[button.dataset.letter];
      if (!item || !hiddenLetter) return;
      hiddenLabel.textContent = item.title;
      hiddenText.textContent = item.text;
      hiddenLetter.hidden = false;
      hiddenLetter.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    });
  });
  $("#close-letter")?.addEventListener("click", () => {
    if (hiddenLetter) hiddenLetter.hidden = true;
  });

  // پایان غافلگیرکننده
  const revealButton = $("#reveal-finale");
  const revealPanel = $("#final-reveal");
  revealButton?.addEventListener("click", () => {
    if (!revealPanel) return;
    revealPanel.hidden = false;
    revealButton.textContent = "نامه باز شد ✧";
    revealButton.setAttribute("aria-expanded", "true");
    revealButton.disabled = true;
    revealPanel.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  });

  // جایگزین امن برای مرورگرهایی که dialog را پشتیبانی می‌کنند
  const dialog = $("#letter-dialog");
  $("#dialog-close")?.addEventListener("click", () => dialog?.close());


  // نمایش نرم کارت‌ها و بخش‌ها هنگام رسیدن به محدوده‌ی دید
  document.documentElement.classList.add("js-motion");
  const revealTargets = document.querySelectorAll(
    ".section-kicker, .section-title, .section-lead, .story-layout, .memory-card, .beloved-copy, .beloved-photo, .love-letter, .poem-card, .envelope, .promise-item, .dream-card, .future-photo, .final-envelope"
  );
  revealTargets.forEach((element) => element.classList.add("reveal-on-scroll"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }

  // جرقه‌های ریز روی دکمه‌ها؛ تعداد محدود و کوتاه‌مدت
  const sparkleButtons = document.querySelectorAll(".button-primary, .envelope, #music-toggle");
  sparkleButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = button.getBoundingClientRect();
      const host = button.offsetParent || button.parentElement;
      if (!host) return;
      const hostRect = host.getBoundingClientRect();
      for (let i = 0; i < 5; i += 1) {
        const sparkle = document.createElement("span");
        sparkle.className = "sparkle-burst";
        sparkle.style.left = `${rect.left - hostRect.left + rect.width * (0.25 + Math.random() * 0.5)}px`;
        sparkle.style.top = `${rect.top - hostRect.top + rect.height * (0.3 + Math.random() * 0.4)}px`;
        sparkle.style.setProperty("--dx", `${(Math.random() - 0.5) * 54}px`);
        sparkle.style.setProperty("--dy", `${-12 - Math.random() * 45}px`);
        host.appendChild(sparkle);
        sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
      }
    });
  });

})();
