/**
 * Yayasan Pendidikan Islam Al Mukhlisin
 * External JavaScript for index.html
 * File: src/js/main.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainMenu = document.getElementById('mainMenu');

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mainMenu.classList.toggle('is-open');
    });

    // Menutup menu jika klik di luar area menu
    document.addEventListener('click', (e) => {
      if (!mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mainMenu.classList.remove('is-open');
      }
    });
  }

  // Smooth scroll untuk link jangkar (in-page anchor)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          if (mainMenu) {
            mainMenu.classList.remove('is-open');
          }
        }
      }
    });
  });
});

/* ==========================================================================
   INTERAKSI SECTION 2 - 7 (NEWS, AGENDA, TESTIMONI, PPDB, KONTAK, FOOTER)
   File: src/js/main.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const WA_NUMBER = '6281280174607';

  /* ------------------------------------------------------------------
     1. Counter Angka Statistik (20+, 500+, 30, 3)
     ------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');

  const runCounter = (el) => {
    el.dataset.counted = '1';
    const target = parseInt(el.dataset.count || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    let start = null;

    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (statNumbers.length && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach((num) => statObserver.observe(num));

    // Jaring pengaman: angka yang sudah terlewati (loncat anchor) tetap dihitung
    const countPassed = () => {
      statNumbers.forEach((num) => {
        if (num.dataset.counted) return;
        if (num.getBoundingClientRect().top < 0) {
          num.dataset.counted = '1';
          runCounter(num);
        }
      });
    };

    window.addEventListener('scroll', countPassed, { passive: true });
    countPassed();
  } else {
    statNumbers.forEach(runCounter);
  }

  /* ------------------------------------------------------------------
     2. Filter Berita per Jenjang
     ------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      newsCards.forEach((card) => {
        const isMatch = filter === 'all' || card.dataset.jenjang === filter;
        card.classList.toggle('is-hidden', !isMatch);
      });
    });
  });

  /* ------------------------------------------------------------------
     3. Lightbox Galeri Fasilitas
     ------------------------------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const openLightbox = (src, caption) => {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = caption || '';
    if (lbCaption) lbCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      openLightbox(item.dataset.src || (image ? image.src : ''), item.dataset.caption || '');
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------
     4. Formulir Kontak -> Kirim ke WhatsApp
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = {
        nama: contactForm.querySelector('[name="nama"]'),
        wa: contactForm.querySelector('[name="wa"]'),
        jenjang: contactForm.querySelector('[name="jenjang"]'),
        pesan: contactForm.querySelector('[name="pesan"]')
      };

      let isValid = true;
      Object.keys(fields).forEach((key) => {
        const field = fields[key];
        const filled = field && field.value.trim() !== '';
        field.classList.toggle('is-invalid', !filled);
        if (!filled) isValid = false;
      });

      if (!isValid) {
        formStatus.textContent = 'Mohon lengkapi seluruh isian terlebih dahulu.';
        formStatus.className = 'form-status is-error';
        return;
      }

      const message =
        "Assalamu'alaikum Admin Al Mukhlisin,\n\n" +
        'Nama orang tua / wali: ' + fields.nama.value.trim() + '\n' +
        'Nomor WhatsApp: ' + fields.wa.value.trim() + '\n' +
        'Jenjang yang diminati: ' + fields.jenjang.value + '\n' +
        'Pesan: ' + fields.pesan.value.trim();

      formStatus.textContent = 'Membuka WhatsApp...';
      formStatus.className = 'form-status is-ok';

      window.open(
        'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message),
        '_blank'
      );
    });

    contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('is-invalid'));
      field.addEventListener('change', () => field.classList.remove('is-invalid'));
    });
  }

  /* ------------------------------------------------------------------
     5. Animasi Reveal saat Scroll
     ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.section-head, .quick-item, .about-media, .about-content > *, .stat-item, ' +
    '.jenjang-card, .advantage-card, .gallery-item, .news-card, .agenda-card, ' +
    '.testimoni-card, .step-item, .contact-item, .contact-form, .map-wrapper, ' +
    '.footer-grid > div'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach((el) => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));

    // Jaring pengaman: elemen yang sudah terlewati (mis. setelah loncat anchor)
    // tetap dimunculkan agar tidak ada area kosong yang tersembunyi.
    const revealPassed = () => {
      revealTargets.forEach((el) => {
        if (el.classList.contains('is-visible')) return;
        if (el.getBoundingClientRect().top < 0) el.classList.add('is-visible');
      });
    };

    window.addEventListener('scroll', revealPassed, { passive: true });
    revealPassed();
  } else {
    revealTargets.forEach((el) => el.classList.add('reveal', 'is-visible'));
  }

  /* ------------------------------------------------------------------
     6. Tombol Mengambang: WhatsApp & Kembali ke Atas
     ------------------------------------------------------------------ */
  const waFloat = document.getElementById('waFloat');
  const toTop = document.getElementById('toTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (toTop) toTop.classList.toggle('is-show', scrollY > 500);
    if (waFloat) waFloat.classList.toggle('is-hidden', scrollY > 380);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     7. Tutup Lightbox dengan tombol Escape
     ------------------------------------------------------------------ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});

  /* ------------------------------------------------------------------
     8. Animasi Selamat Datang (kunjungan pertama)
     ------------------------------------------------------------------ */
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const welcomeEnter = document.getElementById('welcomeEnter');
  const WELCOME_KEY = 'almukhlisinWelcomeSeen';
  const WELCOME_DURATION = 5000;

  const closeWelcome = () => {
    if (!welcomeOverlay || welcomeOverlay.classList.contains('is-closing')) return;
    welcomeOverlay.classList.add('is-closing');
    document.body.style.overflow = '';
    sessionStorage.setItem(WELCOME_KEY, '1');
    setTimeout(() => {
      welcomeOverlay.classList.remove('is-open', 'is-closing');
    }, 650);
  };

  const startWelcome = () => {
    if (!welcomeOverlay) return;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(WELCOME_KEY) === '1';
    } catch (e) {
      alreadySeen = false;
    }
    if (alreadySeen) return;

    welcomeOverlay.classList.add('is-open');
    welcomeOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (welcomeEnter) {
      welcomeEnter.addEventListener('click', closeWelcome);
    }
    welcomeOverlay.addEventListener('click', (e) => {
      if (e.target === welcomeOverlay || e.target.classList.contains('welcome-inner')) closeWelcome();
    });

    setTimeout(closeWelcome, WELCOME_DURATION);
  };

  startWelcome();

  /* ------------------------------------------------------------------
     9. Transisi halus saat membuka halaman PPDB
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href*="page2/pendaftaran.html"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || link.target === '_blank') return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(() => {
        window.location.href = link.href;
      }, 340);
    });
  });