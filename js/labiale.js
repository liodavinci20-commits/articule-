/* =============================================================
   LABIALE.JS — Module lecture labiale : syllabes + mots
============================================================= */

const Labiale = (() => {

  let _activeItem  = null;
  let _recSession  = null;

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

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      _playItem(item, card);
    });

    micBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (_recSession && _activeItem && _activeItem.card === card) {
        _stopManually();
      } else {
        _startRecording(item, type, card, micBtn);
      }
    });

    card.addEventListener('click', () => _playItem(item, card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _playItem(item, card); }
    });

    return card;
  }

  // ── LECTURE (TTS) ─────────────────────────────────────────
  function _playItem(item, card) {
    card.classList.add('labiale-card--playing');
    Utils.playLabiale(item.id, item.text, () => card.classList.remove('labiale-card--playing'));
    setTimeout(() => card.classList.remove('labiale-card--playing'), 3000);
  }

  // ── COMPARAISON TEXTE → CIBLE ─────────────────────────────
  function _matchLabiale(transcript, item) {
    if (!transcript || !item) return false;
    const norm = s => (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Mn}/gu, '')
      .replace(/[^a-z]/g, '')
      .trim();

    const t      = norm(transcript);
    const target = norm(item.text);

    if (!t) return false;
    if (target && t.startsWith(target)) return true;

    return item.testWords.some(w => {
      const nw = norm(w);
      return nw && (t === nw || t.startsWith(nw) || t.includes(nw));
    });
  }

  // ── ENREGISTREMENT ────────────────────────────────────────
  function _startRecording(item, type, card, micBtn) {
    if (_activeItem && _activeItem.card !== card) {
      _resetCard(_activeItem.card, _activeItem.micBtn);
    }
    if (_recSession) {
      try { _recSession.abort(); } catch(e) {}
      _recSession = null;
    }

    _activeItem = { item, type, card, micBtn };

    card.classList.add('labiale-card--listening');
    if (micBtn) {
      micBtn.classList.add('labiale-card__mic--stop');
      micBtn.innerHTML = '<i class="fa-solid fa-stop" aria-hidden="true"></i>';
      micBtn.setAttribute('aria-label', 'Arrêter l\'enregistrement');
    }

    _showRecordingZone(item, 'listening');

    _recSession = Utils.recognize(
      item.testWords,
      7000,
      (result) => _handleResult(result, item, type, card, micBtn),
      (interim) => _onInterim(interim)
    );
  }

  function _stopManually() {
    if (!_recSession) return;
    if (_activeItem && _activeItem.micBtn) {
      _activeItem.micBtn.disabled = true;
    }
    _recSession.abort();
  }

  // Affichage du compte à rebours ou de l'état d'envoi
  function _onInterim(text) {
    const textEl = document.getElementById('labialeTranscriptText');
    const label  = document.getElementById('labialeTranscriptLabel');
    const zone   = document.getElementById('labialeTranscriptZone');
    if (!textEl) return;
    if (text === '__sending__') {
      textEl.textContent = 'Analyse...';
      if (label) label.textContent = 'Analyse en cours...';
      if (zone)  zone.className    = 'transcript-zone transcript-zone--listening';
    } else if (text) {
      textEl.textContent = 'Enregistrement ' + text;
      if (label) label.textContent = 'J\'enregistre...';
      if (zone)  zone.className    = 'transcript-zone transcript-zone--listening';
    }
  }

  // ── RÉSULTAT ──────────────────────────────────────────────
  function _handleResult(result, item, type, card, micBtn) {
    _recSession = null;
    _activeItem = null;

    _resetCard(card, micBtn);

    const viewedSet   = type === 'syl' ? 'syllablesViewed' : 'wordsViewed';
    const alreadyDone = State.has(viewedSet, item.id);

    const fb     = document.getElementById('labialeFeedback');
    const zone   = document.getElementById('labialeTranscriptZone');
    const textEl = document.getElementById('labialeTranscriptText');
    const label  = document.getElementById('labialeTranscriptLabel');

    // Clé API absente
    if (result.noKey) {
      if (zone)   zone.className    = 'transcript-zone transcript-zone--idle';
      if (textEl) textEl.textContent = '—';
      if (label)  label.textContent  = 'Ce que tu as dit';
      if (fb) {
        fb.className = 'phoneme-feedback phoneme-feedback--info';
        fb.innerHTML = '<i class="fa-solid fa-key"></i> Reconnaissance vocale non configurée — va dans "Mon Compte".';
      }
      _showCardFeedback(card, true);
      if (!alreadyDone) _markDone(item, type, card, viewedSet);
      return;
    }

    // Erreurs diverses
    if (result.error) {
      const msgs = {
        bad_key:    'Clé d\'activation invalide.',
        mic_denied: 'Accès au micro refusé.',
        network:    'Erreur réseau.',
        too_short:  'Enregistrement trop court.',
        api_error:  'Erreur serveur — réessaie.'
      };
      if (zone)   zone.className    = 'transcript-zone transcript-zone--error';
      if (textEl) textEl.textContent = '—';
      if (label)  label.textContent  = 'Erreur';
      if (fb) {
        fb.className = 'phoneme-feedback phoneme-feedback--error';
        fb.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + (msgs[result.error] || msgs.api_error);
      }
      _showCardFeedback(card, false);
      _showManualMarkBtn(card, item, type);
      return;
    }

    const heard = (result.recognized || '').trim();

    if (label)  label.textContent  = 'Tu as dit';
    if (textEl) textEl.textContent  = heard || '?';

    if (!heard) {
      if (zone) zone.className = 'transcript-zone transcript-zone--error';
      if (fb) {
        fb.className = 'phoneme-feedback phoneme-feedback--error';
        fb.innerHTML = '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Rien entendu — parle plus fort et proche du micro !';
      }
      _showCardFeedback(card, false);
      _showManualMarkBtn(card, item, type);
      return;
    }

    const success = _matchLabiale(heard, item);

    if (success) {
      if (zone) zone.className = 'transcript-zone transcript-zone--success';
      if (fb) {
        fb.className = 'phoneme-feedback phoneme-feedback--success';
        fb.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Bravo ! C\'est bien "' + item.text + '" !';
      }
      _showCardFeedback(card, true);
      Utils.fireConfetti();
      if (!alreadyDone) {
        _markDone(item, type, card, viewedSet);
        Utils.addStars(5);
        Utils.logJournal('fa-microphone', 'Bien prononcé : ' + item.text);
        _checkBadges(type);
      }
    } else {
      if (zone) zone.className = 'transcript-zone transcript-zone--error';
      if (fb) {
        fb.className = 'phoneme-feedback phoneme-feedback--error';
        fb.innerHTML = '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Pas tout à fait... réessaie "' + item.text + '" !';
      }
      _showCardFeedback(card, false);
      _showManualMarkBtn(card, item, type);
    }
  }

  // ── ZONE D'ENREGISTREMENT ─────────────────────────────────
  function _showRecordingZone(item, state) {
    const zone     = document.getElementById('labialeRecordingZone');
    const tzZone   = document.getElementById('labialeTranscriptZone');
    const textEl   = document.getElementById('labialeTranscriptText');
    const label    = document.getElementById('labialeTranscriptLabel');
    const fb       = document.getElementById('labialeFeedback');
    const targetEl = document.getElementById('labialeTargetWord');

    if (!zone) return;
    zone.style.display = 'block';
    if (targetEl) targetEl.textContent = item.text;
    if (tzZone)   tzZone.className     = 'transcript-zone transcript-zone--' + state;
    if (textEl)   textEl.textContent   = state === 'listening' ? '...' : '—';
    if (label)    label.textContent    = 'J\'enregistre...';
    if (fb)       { fb.className = 'phoneme-feedback'; fb.innerHTML = ''; }
  }

  // ── HELPERS ───────────────────────────────────────────────
  function _resetCard(card, micBtn) {
    card.classList.remove('labiale-card--listening');
    if (micBtn) {
      micBtn.disabled = false;
      micBtn.classList.remove('labiale-card__mic--stop');
      micBtn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i>';
      const text = card.querySelector('.labiale-card__text')?.textContent || '';
      micBtn.setAttribute('aria-label', 'Répéter ' + text);
    }
  }

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

  function _showManualMarkBtn(card, item, type) {
    const existing = card.querySelector('.labiale-card__manual');
    if (existing) existing.remove();

    const btn = document.createElement('button');
    btn.className = 'labiale-card__manual';
    btn.title = 'Marquer comme réussi quand même';
    btn.setAttribute('aria-label', 'Marquer comme réussi');
    btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';

    const autoRemove = setTimeout(() => btn.remove(), 10000);

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
      }
      const zone = document.getElementById('labialeTranscriptZone');
      const fb   = document.getElementById('labialeFeedback');
      if (zone) zone.className = 'transcript-zone transcript-zone--success';
      if (fb) {
        fb.className = 'phoneme-feedback phoneme-feedback--success';
        fb.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Bien noté ! "' + item.text + '" validé.';
      }
    });

    card.querySelector('.labiale-card__actions').appendChild(btn);
  }

  function _checkBadges(type) {
    if (State.get('syllablesViewed').length >= 15) Utils.earnBadge('lips_syllables');
    if (State.get('wordsViewed').length    >= 15)  Utils.earnBadge('lips_words');
  }

  return { init };

})();
