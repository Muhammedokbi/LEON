function showPanel() {
  const panel = document.getElementById('distrosPanel');
  panel.style.display = 'block';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.classList.add('visible');
      panelVisible = true;
      const filtered = filterDistros(currentSearch);
      renderGrid(filtered);
    });
  });
}

function filterDistros(query) {
  return distros.filter(d =>
    d.name.toLowerCase().includes(query) ||
    d[currentLang].tags.some(t => t.toLowerCase().includes(query)) ||
    d[currentLang].tagline.toLowerCase().includes(query) ||
    d[currentLang].badge.toLowerCase().includes(query)
  );
}

function renderGrid(data) {
  const grid = document.getElementById('distroGrid');
  const noRes = document.getElementById('noResults');
  const numEl = document.getElementById('resultNum');
  numEl.textContent = data.length;

  if(data.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  grid.innerHTML = data.map((d, i) => `
    <article class="distro-card" style="animation-delay:${i*0.07}s" data-id="${d.id}" tabindex="0" role="button" aria-label="${d.name} detaylarını gör">
      <div class="card-badge" style="color:${d.badgeColor};border-color:${d.badgeColor};background:${d.colorDim}">
        <span style="width:6px;height:6px;border-radius:50%;background:${d.badgeColor};display:inline-block"></span>
        ${d[currentLang].badge}
      </div>
      <div class="card-icon-center">${d.icon}</div>
      <h3 class="card-name">${d.name}</h3>
      <p class="card-tagline">${d[currentLang].tagline}</p>
      <div class="card-tags">${d[currentLang].tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="card-footer">
        <span class="card-year">${i18n[currentLang].modal_founder}: ${d.year}</span>
        <div class="card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.distro-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
    card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') openModal(card.dataset.id) });
  });
}

window.switchDE = function(deId) {
  const de = desktopEnvs[deId];
  if (!de) return;
  
  const imgEl = document.getElementById('dePreviewImg');
  const descEl = document.getElementById('dePreviewDesc');
  
  imgEl.src = de.image;
  descEl.textContent = de[currentLang].desc;

  document.querySelectorAll('.de-card').forEach(c => c.classList.remove('active'));
  document.querySelector(`.de-card[data-de="${deId}"]`).classList.add('active');
};

function openModal(id) {
  const d = distros.find(x => x.id === id);
  if(!d) return;

  const langObj = d[currentLang];
  const dict = i18n[currentLang];

  document.getElementById('modalHero').innerHTML = `
    ${d.logo ? `<img src="${d.logo}" class="modal-distro-logo" alt="${d.name} Logo">` : `<div class="modal-distro-logo" style="font-size: 5rem; text-align: center; line-height: 140px;">${d.icon}</div>`}
    <div class="modal-badge-row" style="margin-top: 1.5rem;">
      <span class="card-badge" style="color:${d.badgeColor};border-color:${d.badgeColor};background:${d.colorDim}">
        <span style="width:6px;height:6px;border-radius:50%;background:${d.badgeColor};display:inline-block;margin-right:4px"></span>
        ${langObj.badge}
      </span>
      <span class="card-badge" style="color:var(--text3);border-color:var(--border2);background:var(--surface)">
        ${currentLang === 'tr' ? d.year + ' ' + dict.modal_founded : dict.modal_founded + ' ' + d.year}
      </span>
    </div>
    <h2 class="modal-name">${d.name}</h2>
    <p class="modal-tagline">${langObj.tagline}</p>
  `;

  let deSelectorHtml = '';
  if (d.desktops && d.desktops.length > 0) {
    const defaultDeId = d.desktops[0];
    deSelectorHtml = `
      <div class="modal-section de-selector-section">
        <div class="section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          ${dict.modal_select_de}
        </div>
        <div class="de-cards">
          ${d.desktops.map(deId => {
            const env = desktopEnvs[deId] || { name: deId.toUpperCase(), image: 'assets/xfce_ui_1780217271074.png', tr: {desc: 'Özelleştirilmiş masaüstü ortamı.'}, en: {desc: 'Customized desktop environment.'} };
            if (!desktopEnvs[deId]) desktopEnvs[deId] = env; // inject generic fallback to prevent future errors
            return `<button class="de-card" data-de="${deId}" onclick="switchDE('${deId}')">${env.name}</button>`;
          }).join('')}
        </div>
        <div class="de-preview">
          <img id="dePreviewImg" class="de-preview-img" src="" alt="Desktop Environment">
          <p id="dePreviewDesc" class="de-preview-desc"></p>
        </div>
      </div>
    `;
    setTimeout(() => { switchDE(defaultDeId); }, 50);
  }

  let stepsHtml = '';
  if (langObj.steps && langObj.steps.length > 0) {
    stepsHtml = `
      <div class="modal-section">
        <div class="section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${dict.modal_install}
        </div>
        <div class="install-steps">
          ${langObj.steps.map((step, idx) => `
            <div class="install-step-card">
              <div class="step-header">
                <span class="step-number">${idx + 1}</span>
                <span class="step-icon">${step.icon}</span>
                <span class="step-title">${step.title}</span>
              </div>
              <div class="step-body">${step.text}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let prosConsHtml = '';
  if (langObj.pros && langObj.cons) {
    prosConsHtml = `
      <div class="modal-section pros-cons-grid">
        <div class="pros-column">
          <div class="section-label"><span style="color:#4caf50;margin-right:6px">●</span>${dict.pros}</div>
          <ul class="pros-list">
            ${langObj.pros.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        <div class="cons-column">
          <div class="section-label"><span style="color:#f44336;margin-right:6px">●</span>${dict.cons}</div>
          <ul class="cons-list">
            ${langObj.cons.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  let terminalHtml = '';
  if (langObj.terminalCommands && langObj.terminalCommands.length > 0) {
    terminalHtml = `
      <div class="modal-section">
        <div class="section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          ${dict.terminal_commands}
        </div>
        <div class="terminal-blocks">
          ${langObj.terminalCommands.map(tc => `
            <div class="terminal-block">
              <div class="terminal-header">bash</div>
              <div class="terminal-code">${tc.cmd}</div>
              <div class="terminal-desc">${tc.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let whyChooseHtml = '';
  if (langObj.whyChoose) {
    whyChooseHtml = `
      <div class="modal-section why-choose-card">
        <div class="section-label" style="color:var(--accent)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ${dict.why_choose}
        </div>
        <p class="section-content" style="font-weight:500; font-size:0.95rem">${langObj.whyChoose}</p>
      </div>
    `;
  }

  document.getElementById('modalBody').innerHTML = `
    <div class="modal-meta-grid">
      <div class="meta-item"><div class="meta-label">${dict.modal_founder}</div><div class="meta-value">${langObj.founder}</div></div>
      <div class="meta-item"><div class="meta-label">${dict.modal_base}</div><div class="meta-value">${langObj.base}</div></div>
      <div class="meta-item"><div class="meta-label">${dict.modal_pkg}</div><div class="meta-value">${langObj.pkgMgr}</div></div>
      <div class="meta-item"><div class="meta-label">${dict.modal_desktop}</div><div class="meta-value">${langObj.desktop}</div></div>
    </div>

    ${whyChooseHtml}
    ${prosConsHtml}
    ${deSelectorHtml}
    ${terminalHtml}
    ${stepsHtml}

    <div class="modal-section">
      <div class="section-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        ${dict.modal_history}
      </div>
      <p class="section-content">${langObj.history}</p>
    </div>

    <div class="modal-section">
      <div class="section-label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        ${dict.modal_usecases}
      </div>
      <div class="use-case-list">
        ${langObj.useCases.map(u=>`<div class="use-case-item">${u}</div>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.classList.add('modal-open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.classList.remove('modal-open');
}
