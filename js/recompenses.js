/* =============================================================
   RECOMPENSES.JS — Module récompenses, badges, journal
============================================================= */

const Recompenses = (() => {

  function init() {
    refresh();
  }

  function refresh() {
    _buildStarsSection();
    _buildBadges();
    _buildJournal();
  }

  // ── ÉTOILES ───────────────────────────────────────────────
  function _buildStarsSection() {
    const total = State.get('stars');
    const el = document.getElementById('totalStarsDisplay');
    if (el) el.textContent = total;

    const pct = Math.min(100, (total / 100) * 100);
    const fill = document.getElementById('starsProgressFill');
    if (fill) fill.style.width = pct + '%';

    const nextEl = document.getElementById('starsNextGift');
    if (nextEl) {
      if (total >= 100) {
        nextEl.textContent = 'Felicitations ! Tu as obtenu le badge Super Etoile !';
      } else {
        nextEl.textContent = (100 - total) + ' etoiles avant le prochain badge !';
      }
    }
  }

  // ── BADGES ────────────────────────────────────────────────
  function _buildBadges() {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    BADGES_DATA.forEach(b => {
      const earned = State.has('earnedBadges', b.key);
      const card = document.createElement('div');
      card.className = 'badge-card' + (earned ? ' badge-card--earned' : ' badge-card--locked');
      card.setAttribute('aria-label', b.name + (earned ? ' - Debloque' : ' - Verrouille : ' + b.desc));

      card.innerHTML = `
        <div class="badge-card__icon">
          <i class="fa-solid ${b.icon}" aria-hidden="true"></i>
        </div>
        <div class="badge-card__name">${b.name}</div>
        <div class="badge-card__desc">
          ${earned
            ? '<i class="fa-solid fa-lock-open" aria-hidden="true"></i> Debloque !'
            : '<i class="fa-solid fa-lock" aria-hidden="true"></i> ' + b.desc}
        </div>
      `;

      grid.appendChild(card);
    });
  }

  // ── JOURNAL ───────────────────────────────────────────────
  function _buildJournal() {
    const log = document.getElementById('journalLog');
    if (!log) return;

    const journal = State.get('journal');
    if (!journal || journal.length === 0) {
      log.innerHTML = `
        <div class="journal-empty">
          <i class="fa-solid fa-seedling" aria-hidden="true"></i>
          <p>Commence les exercices pour remplir ton journal !</p>
        </div>`;
      return;
    }

    const entries = journal.slice().reverse().slice(0, 10);
    log.innerHTML = entries.map(entry => `
      <div class="journal-entry">
        <div class="journal-entry__icon">
          <i class="fa-solid ${entry.icon}" aria-hidden="true"></i>
        </div>
        <div class="journal-entry__body">
          <p class="journal-entry__text">${entry.text}</p>
          <p class="journal-entry__time">${entry.date} a ${entry.time}</p>
        </div>
      </div>
    `).join('');
  }

  // Réinitialiser la progression (bouton caché pour debug)
  function reset() {
    if (confirm('Effacer toute la progression ?')) {
      State.reset();
      Utils.updateProgressUI();
      refresh();
      Utils.showToast('Progression effacee', 'info');
    }
  }

  return { init, refresh, reset };

})();
