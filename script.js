// LBank BD & KOC Portal Interactive Scripts
// Multi-Language Localization System & %60 Rebate Volume Simulator
// Default Primary Language: English (en)

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initCalculator();
});

// --- Multi-Language System ---
function initLanguage() {
  const supportedLangs = ['en', 'tr', 'hi', 'ur', 'th', 'id'];

  // 1. Check URL Parameter: ?lang=en / ?lang=hi / ?lang=ur / ?lang=tr etc.
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');

  // 2. Check localStorage (if visitor explicitly clicked a language before)
  const storedLang = localStorage.getItem('lbank_koc_lang');

  if (paramLang && supportedLangs.includes(paramLang.toLowerCase())) {
    currentLang = paramLang.toLowerCase();
  } else if (storedLang && supportedLangs.includes(storedLang)) {
    currentLang = storedLang;
  } else {
    // Default starting language is always English!
    currentLang = 'en';
  }

  // Bind dropdown events
  setupLangDropdown();

  // Apply initial language
  setLanguage(currentLang);
}

function setLanguage(lang) {
  if (typeof TRANSLATIONS === 'undefined' || !TRANSLATIONS[lang]) {
    lang = 'en';
  }

  currentLang = lang;
  localStorage.setItem('lbank_koc_lang', lang);
  document.documentElement.lang = lang;

  // Urdu RTL & typography enhancement
  if (lang === 'ur') {
    document.body.classList.add('lang-ur');
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.body.classList.remove('lang-ur');
    document.documentElement.setAttribute('dir', 'ltr');
  }

  const dict = TRANSLATIONS[lang];

  // Update Page Title
  if (dict.page_title) {
    document.title = dict.page_title;
  }

  // Update plain text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // Update HTML elements
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  // Update Language Selector button display
  const currentLangFlag = document.getElementById('current-lang-flag');
  const currentLangName = document.getElementById('current-lang-name');
  if (currentLangFlag) currentLangFlag.textContent = dict.lang_flag || '🌐';
  if (currentLangName) currentLangName.textContent = dict.lang_name || lang.toUpperCase();

  // Highlight active language item in dropdown
  document.querySelectorAll('.lang-option').forEach(opt => {
    const optLang = opt.getAttribute('data-lang');
    if (optLang === lang) {
      opt.classList.add('bg-lbank-yellow/15', 'text-lbank-yellow', 'font-bold');
      opt.classList.remove('text-slate-300');
    } else {
      opt.classList.remove('bg-lbank-yellow/15', 'text-lbank-yellow', 'font-bold');
      opt.classList.add('text-slate-300');
    }
  });

  // Refresh calculator dynamic values in current language
  if (typeof window.recalculateSimulator === 'function') {
    window.recalculateSimulator();
  }
}

function setupLangDropdown() {
  const btn = document.getElementById('lang-dropdown-btn');
  const menu = document.getElementById('lang-dropdown-menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = opt.getAttribute('data-lang');
      if (selected) {
        setLanguage(selected);
        menu.classList.add('hidden');
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
}

// --- Volume-Only Simulator Logic ---
function initCalculator() {
  const volumeRange = document.getElementById('volume-range');
  const volumeVal = document.getElementById('volume-val');
  const totalEarnings = document.getElementById('total-earnings');
  const commissionShare = document.getElementById('commission-share');
  const statVolume = document.getElementById('stat-volume');
  const subsequentEarn = document.getElementById('subsequent-earn');

  window.recalculateSimulator = function() {
    if (!volumeRange) return;

    const volume = parseInt(volumeRange.value, 10);

    // Update Slider Label
    if (volumeVal) volumeVal.textContent = `$${volume.toLocaleString('en-US')}`;

    // Calculation based on standard 60% Rebate:
    // 1M volume brings $240 - $300 USDT net commission
    const volumeInM = volume / 1000000;
    const minEarn = Math.round(volumeInM * 240);
    const maxEarn = Math.round(volumeInM * 300);

    // Update Result Card
    if (totalEarnings) {
      totalEarnings.textContent = `$${minEarn.toLocaleString('en-US')} - $${maxEarn.toLocaleString('en-US')}`;
    }

    if (statVolume) {
      statVolume.textContent = `$${volume.toLocaleString('en-US')} USD`;
    }

    if (commissionShare) {
      commissionShare.textContent = `$${minEarn.toLocaleString('en-US')} - $${maxEarn.toLocaleString('en-US')} USDT`;
    }

    if (subsequentEarn) {
      const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[currentLang]) 
        ? TRANSLATIONS[currentLang] 
        : null;

      if (dict) {
        if (volumeInM === 1) {
          subsequentEarn.textContent = dict.s3_mult_1m || '$240 - $300 on every 1M';
        } else if (typeof dict.s3_mult_nm === 'function') {
          subsequentEarn.textContent = dict.s3_mult_nm(volumeInM, minEarn.toLocaleString('en-US'), maxEarn.toLocaleString('en-US'));
        } else {
          subsequentEarn.textContent = `${volumeInM}M: $${minEarn.toLocaleString('en-US')} - $${maxEarn.toLocaleString('en-US')}`;
        }
      } else {
        subsequentEarn.textContent = volumeInM === 1 
          ? '$240 - $300 on every 1M' 
          : `${volumeInM}M: $${minEarn} - $${maxEarn}`;
      }
    }
  };

  if (volumeRange) {
    volumeRange.addEventListener('input', window.recalculateSimulator);
  }

  // Initial calculation
  window.recalculateSimulator();
}
