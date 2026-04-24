/* =============================================================
   LABIALE.JS — Module lecture labiale : syllabes + mots
============================================================= */

const Labiale = (() => {

  let _activeItem = null;   // { item, type, card } de l'enregistrement en cours
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
      group.items.forEach(item => grid.appendChild(_createLabialeCard(item, 'syl')));

      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  function _buildMots() {
    const container = document.getElementById('motsContainer');
    if (!container) return;
    container.innerHTML = '';

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
      items.forEach(item => grid.appendChild(_createLabialeCard(item, 'mot')));

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
        <button class="labiale-card__mic" title="Je répète !" aria-label="Répéter ${item.text}">
          <i class="fa-solid fa-microphone" aria-hidden="true"></i>
        </button>
      </div>
      ${done ? '<i class="fa-solid fa-circle-check labiale-card__check" aria-hidden="true"></i>' : ''}
    `;

    const playBtn = card.querySelector('.labiale-card__play');
    const micBtn  = card.querySelector('.labiale-card__mic');

    // Bouton volume → écoute uniquement, sans enregistrement
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      _playItem(item, card);
    });

    // Bouton micro → l'enfant est prêt, on enregistre
    micBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      _startRecording(item, type, card);
    });

    // Clic sur la carte → écoute (comme le bouton volume)
    card.addEventListener('click', () => _playItem(item, card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _playItem(item, card); }
    });

    return card;
  }

  // ── LECTURE (TTS uniquement) ─────────────────────────────
  function _playItem(item, card) {
    card.classList.add('labiale-card--playing');
    Utils.speak(item.text, () => card.classList.remove('labiale-card--playing'));
    // Fallback de nettoyage visuel si onEnd ne se déclenche pas
    setTimeout(() => card.classList.remove('labiale-card--playing'), 2000);
  }

  // ── ENREGISTREMENT (déclenché par le bouton micro) ────────
  function _startRecording(item, type, card) {
    // Si une écoute est déjà en cours sur une autre carte, l'annuler proprement
    if (_activeItem && _activeItem.card !== card) {
      _activeItem.card.classList.remove('labiale-card--listening');
      _setMicState(_activeItem.card, false);
    }
    if (_recSession) {
      try { _recSession.abort(); } catch(e) {}
      _recSession = null;
    }

    _activeItem = { item, type, card };
    card.classList.add('labiale-card--listening');
    _setMicState(card, true);

    Utils.startBubbleMic();

    _recSession = Utils.recognize(
      item.testWords,
      4000,
      (result) => _handleResult(result, item, type, card)
    );
  }

  // ── RÉSULTAT DE LA RECONNAISSANCE ────────────────────────
  function _handleResult(result, item, type, card) {
    _recSession = null;
    _activeItem = null;
    card.classList.remove('labiale-card--listening');
    _setMicState(card, false);

    const viewedSet = type === 'syl' ? 'syllablesViewed' : 'wordsViewed';
    const alreadyDone = State.has(viewedSet, item.id);

    // Pas d'API Speech Recognition disponible (navigateur non compatible)
    if (result.noApi) {
      _showCardFeedback(card, true);
      _markDone(item, type, card, viewedSet);
      Utils.showToast('Reconnaissance non disponible — utilise Chrome ou Edge', 'info');
      return;
    }

    if (result.success && result.quality >= 0.3) {
      // ── SUCCÈS ──
      _showCardFeedback(card, true);
      Utils.triggerBubblesManual(4);
      Utils.fireConfetti();
      Utils.showToast('Bravo ! Tu as bien dit "' + item.text + '" !', 'success');

      if (!alreadyDone) {
        _markDone(item, type, card, viewedSet);
        Utils.addStars(5);
        Utils.logJournal('fa-microphone', 'Bien prononcé : ' + item.text);
        _checkBadges(type);
      }
    } else {
      // ── ÉCHEC ──
      _showCardFeedback(card, false);

      let msg;
      if (result.error === 'no-speech' || result.error === 'timeout') {
        msg = 'Je t\'entends pas... parle plus fort !';
      } else if (result.recognized) {
        msg = 'J\'ai entendu "' + result.recognized + '"... réessaie "' + item.text + '" !';
      } else {
        msg = 'Pas tout à fait... réessaie "' + item.text + '" !';
      }
      Utils.showToast(msg, 'error');

      // Bouton de secours visible 10s — utile si l'enfant a bien prononcé
      // mais que l'API n'a pas reconnu correctement
      _showManualMarkBtn(card, item, type);
    }
  }

  // ── HELPERS ───────────────────────────────────────────────

  // Change l'icône du bouton micro selon l'état (écoute ou repos)
  function _setMicState(card, listening) {
    const micBtn = card.querySelector('.labiale-card__mic');
    if (!micBtn) return;
    if (listening) {
      micBtn.innerHTML = '<i class="fa-solid fa-circle-dot fa-beat" aria-hidden="true"></i>';
      micBtn.setAttribute('aria-label', 'Enregistrement en cours...');
    } else {
      micBtn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i>';
      micBtn.setAttribute('aria-label', 'Répéter ' + (card.querySelector('.labiale-card__text')?.textContent || ''));
    }
  }

  // Overlay succès/erreur temporaire sur la carte
  function _showCardFeedback(card, success) {
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

  function _markDone(item, type, card, viewedSet) {
    State.push(viewedSet, item.id);
    card.classList.add('labiale-card--done');
    if (!card.querySelector('.labiale-card__check')) {
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-circle-check labiale-card__check';
      icon.setAttribute('aria-hidden', 'true');
      card.appendChild(icon);
    }
    Utils.updateProgressUI();
  }

  // Bouton "Marquer comme réussi" — s'affiche 10s après un échec de reconnaissance.
  // Permet à l'orthophoniste ou à l'enfant de valider manuellement une bonne prononciation.
  function _showManualMarkBtn(card, item, type) {
    const existing = card.querySelector('.labiale-card__manual');
    if (existing) existing.remove();

    const btn = document.createElement('button');
    btn.className = 'labiale-card__manual';
    btn.title = 'Marquer comme réussi quand même';
    btn.setAttribute('aria-label', 'Marquer comme réussi');
    btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';

    let autoRemove = setTimeout(() => btn.remove(), 10000);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(autoRemove);
      btn.remove();
      const viewedSet = type === 'syl' ? 'syllablesViewed' : 'wordsViewed';
      if (!State.has(viewedSet, item.id)) {
        _markDone(item, type, card, viewedSet);
        Utils.addStars(5);
        Utils.logJournal('fa-microphone', 'Prononcé (manuel) : ' + item.text);
        _checkBadges(type);
        Utils.triggerBubblesManual(3);
      }
      Utils.showToast('Bien noté ! "' + item.text + '" validé.', 'success');
    });

    card.querySelector('.labiale-card__actions').appendChild(btn);
  }

  function _checkBadges(type) {
    if (State.get('syllablesViewed').length >= 15) Utils.earnBadge('lips_syllables');
    if (State.get('wordsViewed').length >= 15)     Utils.earnBadge('lips_words');
  }

  return { init };

})();
