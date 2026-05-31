// LANGUAGE TOGGLE
document.getElementById('langBtn').addEventListener('click', () => {
  currentLang = currentLang === 'tr' ? 'en' : 'tr';
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Update Lang Button Text (Shows the opposite of current, to switch)
  document.getElementById('langBtn').textContent = currentLang === 'tr' ? 'EN' : 'TR';
  
  // Update static UI elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(i18n[currentLang][key]) {
      el.innerHTML = i18n[currentLang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if(i18n[currentLang][key]) {
      el.placeholder = i18n[currentLang][key];
    }
  });

  // Re-render components if needed
  if(panelVisible) {
    const filtered = filterDistros(currentSearch);
    renderGrid(filtered);
  }
});

// THEME
const themeBtn = document.getElementById('themeBtn');
const sun = document.getElementById('sunIcon');
const moon = document.getElementById('moonIcon');

// Detect saved or OS preference on load
(function initTheme() {
  const saved = localStorage.getItem('leon-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  const current = document.documentElement.getAttribute('data-theme');
  sun.style.display = current === 'dark' ? 'block' : 'none';
  moon.style.display = current === 'dark' ? 'none' : 'block';
})();

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('leon-theme', next);
  sun.style.display = next === 'dark' ? 'block' : 'none';
  moon.style.display = next === 'dark' ? 'none' : 'block';
});

// MAIN BUTTON
document.getElementById('mainBtn').addEventListener('click', function(){
  this.classList.add('clicked');
  setTimeout(() => {
    document.getElementById('hero').classList.add('hide');
    showPanel();
  }, 400);
});

// BACK BUTTON
document.getElementById('backBtn').addEventListener('click', () => {
  const panel = document.getElementById('distrosPanel');
  panel.classList.remove('visible');
  setTimeout(() => {
    panel.style.display = 'none';
    const hero = document.getElementById('hero');
    hero.classList.remove('hide');
    const btn = document.getElementById('mainBtn');
    btn.classList.remove('clicked');
    btn.style.opacity = '';
    panelVisible = false;
  }, 400);
});

// SEARCH
document.getElementById('searchInput').addEventListener('input', function() {
  currentSearch = this.value.toLowerCase().trim();
  
  if(!panelVisible && currentSearch.length > 0) {
    document.getElementById('mainBtn').classList.add('clicked');
    document.getElementById('hero').classList.add('hide');
    const panel = document.getElementById('distrosPanel');
    panel.style.display = 'block';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.classList.add('visible');
        panelVisible = true;
      });
    });
  }

  const filtered = filterDistros(currentSearch);
  if(panelVisible || currentSearch.length > 0) {
    renderGrid(filtered);
  }
});

// MODAL LISTENERS
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if(e.target === document.getElementById('modalOverlay')) closeModal();
});

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeModal();
});

// INITIALIZE APP
(async function initApp() {
  const mainBtn = document.getElementById('mainBtn');
  const initialText = mainBtn.innerHTML;
  mainBtn.innerHTML = i18n[currentLang].loading;
  mainBtn.disabled = true;

  const success = await fetchDistros();
  
  if (success) {
    mainBtn.innerHTML = initialText;
    mainBtn.disabled = false;
    initFloatNums();
  } else {
    mainBtn.innerHTML = i18n[currentLang].error;
    mainBtn.style.color = "var(--accent)";
  }
})();
