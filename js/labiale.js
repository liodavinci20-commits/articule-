/* =============================================================
   LABIALE.JS — Module lecture labiale : syllabes + mots
============================================================= */

const Labiale = (() => {

  let _activeItem = null;   // syllabe ou mot actif
  let _recSession = null;

  // ── CONSTRUCTION ─────────────────────────────────────────
  function init() {
    _buildSyllabes();
    _buildMots();
  }

  function _buildSyllabes() {
    const container = document.getElementById('syllabesContainer');
    if (!container) return;
    container.innerHTML = '';

    SYLLABES_GROUPS.forEach(group => {
      const section = document.createElement('div');
      section.className = 'labiale-group';

      const header = document.createElement('div');
      header.className = 'labiale-group-header';
      header.innerHTML = `<span class="labiale-group-base">${group.base}</span>`;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'labiale-grid';

      group.items.forEach(item => {
        grid.appendChild(_createLabialeCard(item, 'syl'));
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  function _buildMots() {
    const container = document.getElementById('motsContainer');
    if (!container) return;
    container.innerHTML = '';

    // Grouper par catégorie
    const categories = {};
    MOTS.forEach(mot => {
      if (!categories[mot.category]) categories[mot.category] = [];
      categories[mot.category].push(mot);
    });

    Object.entries(categories).forEach(([cat, items]) => {
      const section = document.createElement('div');
      section.className = 'labiale-group';

      const header = document.createElement('div');
      header.className = 'labiale-group-header';
      header.innerHTML = `<span class="labiale-group-base">${cat}</span>`;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'labiale-grid';

      items.forEach(item => {
        grid.appendChild(_createLabialeCard(item, 'mot'));
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  function _createLabialeCard(item, type) {
    const viewedSet = type === 'syl' ? 'syllablesViewed' : 'wordsViewed';
    const done = State.has(viewedSet, item.id);

    const card = document.createElement('div');
    card.className = 'labiale-card' + (done ? ' labiale-card--done' : '');
    card.id = 'lcard-' + item.id;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', item.text);
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="labiale-card__text">${item.text}</div>
      <div class="labiale-card__actions">
        <button class="labiale-card__play" title="Écouter" aria-label="Écouter ${item.text}">
          <i class="fa-solid fa-volume-high" aria-hidden="true"></i>
        </button>
      </div>
      ${done ? '<i class="fa-solid fa-circle-check labiale-card__check" aria-hidden="true"></i>' : ''}
    `;

    const playBtn = card.querySelector('.labiale-card__play');
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      _playAndRecord(item, type, card);
    });

    card.addEventListener('click', () => _playAndRecord(item, type, card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _playAndRecord(item, type, card); }
    });

    return card;
  }

  // ── LECTURE + ENREGISTREMENT ─────────────────────────────
  function _playAndRecord(item, type, card) {
    _activeItem = { item, type, card };

    // Jouer le son
    Utils.speak(item.text, () => {
      // Après la lecture, démarrer l'enregistrement
      _startRecording(item, type, card);
    });

    // Feedback visuel immédiat sur la carte
    card.classList.add('labiale-card--playing');
    setTimeout(() => card.classList.remove('labiale-card--playing'), 1500);
  }

  function _startRecording(item, type, card) {
    // Indicateur visuel sur la carte
    card.classList.add('labiale-card--listening');

    // Démarrer le monitoring des bulles
    Utils.startBubbleMic();

    _recSession = Utils.recognize(
      item.testWords,
      4000,
      (result) => _handleResult(result, item, type, card)
    );
  }

  function _handleResult(result, item, type, card) {
    _recSession = null;
    card.classList.remove('labiale-card--listening');

    const viewedSet = type === 'syl' ? 'syllablesViewed' : 'wordsViewed';
    const alreadyDone = State.has(viewedSet, item.id);

    if (result.noApi) {
      // Pas d'API → marquer comme vu quand même
      _markDone(item, type, card, viewedSet);
      Utils.showToast('Reconnaissance non disponible (Chrome requis)', 'info');
      return;
    }

    if (result.success && result.quality >= 0.3) {
      // Succès
      _showCardFeedback(card, true);
      Utils.triggerBubblesManual(4);

      if (!alreadyDone) {
        _markDone(item, type, card, viewedSet);
        Utils.addStars(5);
        Utils.logJournal('fa-eye', 'Prononce : ' + item.text);
        _checkBadges(type);
      }
    } else {
      // Échec
      _showCardFeedback(card, false);
    }
  }

  function _markDone(item, type, card, viewedSet) {
    State.push(viewedSet, item.id);
    card.classList.add('labiale-card--done');
    if (!card.querySelector('.labiale-card__check')) {
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-circle-check labiale-card__check';
      icon.setAttribute('aria-hidden', 'true');
      card.appendChild(icon);
    }
  }

  function _showCardFeedback(card, success) {
    // Ajoute un badge temporaire sur la carte
    const existing = card.querySelector('.labiale-card__feedback');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.className = 'labiale-card__feedback labiale-card__feedback--' + (success ? 'success' : 'error');
    badge.innerHTML = success
      ? '<i class="fa-solid fa-check" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';

    card.appendChild(badge);
    setTimeout(() => badge.remove(), 2000);
  }

  function _checkBadges(type) {
    const sylDone = State.get('syllablesViewed').length;
    const motDone = State.get('wordsViewed').length;
    if (sylDone >= 15) Utils.earnBadge('lips_syllables');
    if (motDone >= 15) Utils.earnBadge('lips_words');
  }

  return { init };

})();
