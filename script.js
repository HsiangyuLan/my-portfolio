/**
 * Portfolio — Bilingual (EN/中文), Haptics, Smooth Scroll
 * Default language: English
 */

const LANG_KEY = 'portfolio-lang';
const DEFAULT_LANG = 'en';

function getStoredLang() {
  try {
    return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

function setStoredLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (_) {}
}

function applyLanguage(lang) {
  const isEn = lang === 'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    const value = el.getAttribute(isEn ? 'data-en' : 'data-zh');
    if (value != null) el.textContent = value;
  });
  document.documentElement.lang = isEn ? 'en' : 'zh-Hant';
  if (document.body) document.body.dataset.lang = lang;
  // 切換到中文時重啟打字機動畫，讓中文打字效果正常播放
  if (lang === 'zh') {
    const zhText = document.querySelector('.typewriter-text-zh');
    if (zhText) {
      zhText.style.animation = 'none';
      zhText.style.width = '0';
      zhText.offsetHeight; // force reflow
      zhText.style.animation = '';
      zhText.style.width = '';
    }
  }
}

function toggleLanguage() {
  const current = getStoredLang();
  const next = current === 'en' ? 'zh' : 'en';
  setStoredLang(next);
  applyLanguage(next);
}

function initLanguage() {
  const lang = getStoredLang();
  applyLanguage(lang);
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.addEventListener('click', () => { haptic(); toggleLanguage(); });
}

function haptic() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10);
  }
}

function initHaptics() {
  document.querySelectorAll('.btn, .skill-tag').forEach(el => {
    el.addEventListener('click', function () {
      haptic();
    }, { passive: true });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  initLanguage();
  initHaptics();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
