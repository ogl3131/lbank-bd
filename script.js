// LBank KOC & MCN Hub - Interactive JavaScript
// Multi-Language Localization System & Directory Tab Navigation

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initCalculator();
});

// --- Tab Switching Logic ---
function switchTab(tabId) {
  // Update Tab Buttons in Sidebar
  for (let i = 1; i <= 4; i++) {
    const btn = document.getElementById(`tab-btn-${i}`);
    const panel = document.getElementById(`tab-panel-${i}`);
    
    if (btn) {
      if (i === tabId) {
        btn.classList.add('active');
        btn.classList.remove('text-white/70', 'hover:bg-white/8', 'hover:text-white');
      } else {
        btn.classList.remove('active');
        btn.classList.add('text-white/70', 'hover:bg-white/8', 'hover:text-white');
      }
    }

    if (panel) {
      if (i === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    }
  }

  // If clicked from top header/nav or on small screens, smoothly bring directory into view
  const hubSection = document.getElementById('hub');
  if (hubSection && window.scrollY > hubSection.offsetTop + 200 || window.innerWidth < 1024) {
    hubSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Make switchTab accessible globally
window.switchTab = switchTab;

// --- Multi-Language Localization System ---
function initLanguage() {
  const supportedLangs = ['en', 'tr', 'hi', 'ur', 'th', 'id'];

  // 1. Check URL Parameter: ?lang=en / ?lang=tr / ?lang=hi etc.
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');

  // 2. Check localStorage
  const storedLang = localStorage.getItem('lbank_koc_lang');

  if (paramLang && supportedLangs.includes(paramLang.toLowerCase())) {
    currentLang = paramLang.toLowerCase();
  } else if (storedLang && supportedLangs.includes(storedLang)) {
    currentLang = storedLang;
  } else {
    // Default starting language is English
    currentLang = 'en';
  }

  setupLangDropdown();
  setLanguage(currentLang);
}

function setLanguage(lang) {
  if (typeof TRANSLATIONS === 'undefined' || !TRANSLATIONS[lang]) {
    lang = 'en';
  }

  currentLang = lang;
  localStorage.setItem('lbank_koc_lang', lang);
  document.documentElement.lang = lang;

  // Urdu RTL Support
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

  // Update Elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // Update Elements with data-i18n-html
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  // Update Dropdown Button Label
  const currentLangFlag = document.getElementById('current-lang-flag');
  const currentLangName = document.getElementById('current-lang-name');
  if (currentLangFlag) currentLangFlag.textContent = dict.lang_flag || '🌐';
  if (currentLangName) currentLangName.textContent = dict.lang_name || lang.toUpperCase();

  // Highlight Selected Option
  document.querySelectorAll('.lang-option').forEach(opt => {
    const optLang = opt.getAttribute('data-lang');
    if (optLang === lang) {
      opt.classList.add('bg-[#ffd400]/20', 'text-[#ffd400]', 'font-bold');
      opt.classList.remove('text-white');
    } else {
      opt.classList.remove('bg-[#ffd400]/20', 'text-[#ffd400]', 'font-bold');
      opt.classList.add('text-white');
    }
  });
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

// --- Volume Earnings Simulator ---
function initCalculator() {
  const volumeRange = document.getElementById('volume-range');
  const volumeVal = document.getElementById('volume-val');
  const totalEarnings = document.getElementById('total-earnings');

  function calculate() {
    if (!volumeRange) return;
    const volume = parseInt(volumeRange.value, 10);

    if (volumeVal) {
      volumeVal.textContent = `$${volume.toLocaleString('en-US')}`;
    }

    // Standard 60% Rebate: ~$240 - $300 per 1M volume
    const volumeInM = volume / 1000000;
    const minEarn = Math.round(volumeInM * 240);
    const maxEarn = Math.round(volumeInM * 300);

    if (totalEarnings) {
      totalEarnings.textContent = `$${minEarn.toLocaleString('en-US')} - $${maxEarn.toLocaleString('en-US')}`;
    }
  }

  if (volumeRange) {
    volumeRange.addEventListener('input', calculate);
    calculate();
  }
}
