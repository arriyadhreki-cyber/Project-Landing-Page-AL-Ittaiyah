/**
 * Video background section PPDB
 * File: src/js/ppdb-video.js
 *
 * - Video dimuat saat area video hampir terlihat, diputar saat area video terlihat,
 *   dan dijeda saat ditinggalkan. (HP/tablet: hanya blok judul PPDB; layar lebar: seluruh section.)
 * - Suara naik perlahan saat section terlihat dan turun perlahan saat ditinggalkan.
 * - Browser memblokir suara otomatis sebelum pengunjung menyentuh halaman,
 *   jadi suara aktif setelah sentuhan/klik pertama atau lewat tombol suara.
 */
(function () {
  'use strict';

  var section = document.getElementById('ppdb');
  if (!section) return;

  var wrap = section.querySelector('.ppdb-video-bg');
  var video = section.querySelector('.ppdb-video');
  var btn = document.getElementById('ppdbSoundBtn');
  if (!wrap || !video) return;

  var VOL_MAX = 0.7;     // volume puncak (0 - 1)
  var FADE_IN = 1400;    // ms suara naik
  var FADE_OUT = 1000;   // ms suara turun

  var conn = navigator.connection || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function disableAll() {
    wrap.style.display = 'none';
    if (btn) btn.hidden = true;
    try { video.pause(); } catch (e) {}
  }

  if (reduceMotion || conn.saveData) { disableAll(); return; }

  var loaded = false;
  var inView = false;
  var unlocked = false;   // sudah ada interaksi pengunjung -> suara boleh aktif
  var userMuted = false;  // pengunjung mematikan suara lewat tombol
  var cur = 0;            // volume saat ini
  var rafId = null;
  var lastT = 0;
  var ctx = null;
  var gain = null;
  var useWebAudio = false;

  /* ---------- Volume ---------- */
  function volumeSettable() {
    try {
      var old = video.volume;
      video.volume = 0.5;
      var ok = Math.abs(video.volume - 0.5) < 0.01;
      video.volume = old;
      return ok;
    } catch (e) { return false; }
  }

  function setVol(v) {
    v = Math.max(0, Math.min(1, v));
    if (useWebAudio && gain) gain.gain.value = v;
    else { try { video.volume = v; } catch (e) {} }
  }

  /* ---------- Muat & error ---------- */
  function load() {
    if (loaded) return;
    loaded = true;
    var src = video.getAttribute('data-src');
    if (!src) return;
    video.src = src;
    video.load();
  }

  video.addEventListener('playing', function () { video.classList.add('is-ready'); });
  video.addEventListener('error', function () { disableAll(); });

  function tryPlay() {
    if (!loaded) load();
    if (!video.paused) return;
    var p = video.play();
    if (p && p.catch) {
      p.catch(function () {
        // Jika diblokir saat tidak muted, kembali ke muted
        if (!video.muted) {
          video.muted = true;
          unlocked = false;
          cur = 0;
          setBtn();
          var p2 = video.play();
          if (p2 && p2.catch) p2.catch(function () {});
        }
      });
    }
  }

  /* ---------- Fade suara ---------- */
  function target() {
    return (inView && unlocked && !userMuted) ? VOL_MAX : 0;
  }

  function step(t) {
    var dt = lastT ? (t - lastT) : 16;
    lastT = t;
    var tgt = target();
    var speed = VOL_MAX / (tgt > cur ? FADE_IN : FADE_OUT) * dt;
    if (cur < tgt) cur = Math.min(tgt, cur + speed);
    else if (cur > tgt) cur = Math.max(tgt, cur - speed);
    if (unlocked) setVol(cur);

    if (cur !== tgt) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
      lastT = 0;
      if (!inView) video.pause();
    }
  }

  function update() {
    if (inView) tryPlay();
    if (!inView && cur === 0) video.pause();
    if (rafId === null && (cur !== target())) {
      lastT = 0;
      rafId = requestAnimationFrame(step);
    }
  }

  /* ---------- Buka kunci suara (setelah interaksi) ---------- */
  function unlock() {
    if (unlocked) return true;

    if (!volumeSettable()) {
      // iOS: volume video tidak bisa diatur lewat kode -> pakai Web Audio
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC();
        gain = ctx.createGain();
        gain.gain.value = 0;
        ctx.createMediaElementSource(video).connect(gain);
        gain.connect(ctx.destination);
        if (ctx.state === 'suspended') ctx.resume();
        useWebAudio = true;
      } catch (e) {
        return false; // tidak bisa atur volume -> tetap tanpa suara
      }
    }

    unlocked = true;
    cur = 0;
    setVol(0);
    video.muted = false;
    if (inView) tryPlay();
    return true;
  }

  function setBtn() {
    if (!btn) return;
    var on = unlocked && !userMuted;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Matikan suara video' : 'Nyalakan suara video');
    var label = btn.querySelector('.ppdb-sound-label');
    if (label) label.textContent = on ? 'Suara nyala' : 'Suara mati';
  }

  var gestureEvents = ['pointerup', 'click', 'keydown'];
  function onGesture(ev) {
    // Klik pada tombol suara ditangani oleh handler tombol itu sendiri
    if (btn && ev && ev.target && btn.contains(ev.target)) return;
    if (unlock()) {
      gestureEvents.forEach(function (ev) { document.removeEventListener(ev, onGesture, true); });
      setBtn();
      update();
    }
  }
  gestureEvents.forEach(function (ev) { document.addEventListener(ev, onGesture, true); });

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!unlocked) {
        if (unlock()) userMuted = false;
      } else {
        userMuted = !userMuted;
      }
      setBtn();
      update();
    });
  }

  // Jika browser sudah mencatat interaksi sebelumnya, langsung aktifkan
  if (navigator.userActivation && navigator.userActivation.hasBeenActive) {
    if (unlock()) {
      gestureEvents.forEach(function (ev) { document.removeEventListener(ev, onGesture, true); });
    }
  }
  setBtn();

  /* ---------- Trigger saat scroll ---------- */
  if (!('IntersectionObserver' in window)) { disableAll(); return; }

  // Muat video saat section sudah dekat (belum terlihat)
  var preloadIO = new IntersectionObserver(function (entries) {
    if (entries[entries.length - 1].isIntersecting) { load(); preloadIO.disconnect(); }
  }, { rootMargin: '600px 0px' });
  preloadIO.observe(wrap);

  // Putar saat section dominan terlihat
  var thresholds = [];
  for (var i = 0; i <= 20; i++) thresholds.push(i / 20);

  var viewIO = new IntersectionObserver(function (entries) {
    var e = entries[entries.length - 1];
    var need = Math.min(e.boundingClientRect.height * 0.35, window.innerHeight * 0.35);
    inView = e.isIntersecting && e.intersectionRect.height >= need;
    update();
  }, { threshold: thresholds });
  viewIO.observe(wrap);

  // Tab disembunyikan -> jeda & senyapkan
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      video.pause();
      cur = 0;
      if (unlocked) setVol(0);
    } else {
      update();
    }
  });
})();
