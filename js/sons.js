/* =============================================================
   SONS.JS — Module Sons : phonèmes, diagrammes, LSF, correction
============================================================= */

const Sons = (() => {

  // ── CHEMINS IMAGES — dossier images/ (PNG) ───────────────
  const _B = 'dossier%20images/';
  const _C = _B + 'les%20consonnes/';

  const PHONEME_IMG = {
    'v-a':  _B + 'voyelles/a.png',
    'v-e':  _B + 'voyelles/e.png',
    'v-i':  _B + 'voyelles/i.png',
    'v-o':  _B + 'voyelles/o.png',
    'v-u':  _B + 'voyelles/u.png',
    'c-p':  _C + 'bilabiales/p.png',
    'c-b':  _C + 'bilabiales/b.png',
    'c-m':  _C + 'bilabiales/m.png',
    'c-t':  _C + 'dentales/t.png',
    'c-d':  _C + 'dentales/d.png',
    'c-n':  _C + 'dentales/n.png',
    'c-k':  _C + 'v%C3%A9laires/k.png',
    'c-g':  _C + 'v%C3%A9laires/G.png',
    'c-f':  _C + 'fricatives/f.png',
    'c-v':  _C + 'fricatives/v.png',
    'c-s':  _C + 'fricatives/s.png',
    'c-z':  _C + 'fricatives/z.png',
    'c-ch': _C + 'fricatives/ch.png',
    'c-j':  _C + 'fricatives/j.png',
    'c-l':  _C + 'liquide/l.png',
    'c-r':  _C + 'liquide/r.png',
    'c-mn': _C + 'bilabiales/m.png',
    'c-nn': _C + 'dentales/n.png',
  };

  const QUIZ_IMG = {
    'wide-open':     _B + 'voyelles/a.png',
    'half-open':     _B + 'voyelles/e.png',
    'spread-tight':  _B + 'voyelles/i.png',
    'rounded-open':  _B + 'voyelles/o.png',
    'rounded-tight': _B + 'voyelles/u.png',
    'closed':        _C + 'bilabiales/p.png',
    'dental':        _C + 'dentales/t.png',
    'velar':         _C + 'v%C3%A9laires/k.png',
    'labiodental':   _C + 'fricatives/f.png',
    'alveolar':      _C + 'fricatives/s.png',
    'postalveolar':  _C + 'fricatives/ch.png',
    'lateral':       _C + 'liquide/l.png',
    'rhotic':        _C + 'liquide/r.png',
  };

  const _SPREAD_SVG = `
    <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 68 C60 52 160 52 200 68" stroke="#3A3530" stroke-width="3"/>
      <path d="M20 68 C60 72 160 72 200 68" stroke="#3A3530" stroke-width="2"/>
      <path d="M20 82 C60 92 160 92 200 82" stroke="#3A3530" stroke-width="3"/>
      <path d="M20 82 C60 78 160 78 200 82" stroke="#3A3530" stroke-width="2"/>
      <path d="M20 68 L20 82" stroke="#3A3530" stroke-width="2"/>
      <path d="M200 68 L200 82" stroke="#3A3530" stroke-width="2"/>
      <rect x="38" y="72" width="144" height="10" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
      <line x1="58"  y1="72" x2="58"  y2="82" stroke="#CCC" stroke-width="1"/>
      <line x1="76"  y1="72" x2="76"  y2="82" stroke="#CCC" stroke-width="1"/>
      <line x1="94"  y1="72" x2="94"  y2="82" stroke="#CCC" stroke-width="1"/>
      <line x1="112" y1="72" x2="112" y2="82" stroke="#CCC" stroke-width="1"/>
      <line x1="130" y1="72" x2="130" y2="82" stroke="#CCC" stroke-width="1"/>
      <line x1="148" y1="72" x2="148" y2="82" stroke="#CCC" stroke-width="1"/>
      <line x1="166" y1="72" x2="166" y2="82" stroke="#CCC" stroke-width="1"/>
      <path d="M12 75 L4 75" stroke="#B85C38" stroke-width="1.5"/>
      <path d="M208 75 L216 75" stroke="#B85C38" stroke-width="1.5"/>
      <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Lèvres étirées en sourire — /é/</text>
    </svg>`;

  const LSF_IMG = {
    'A': 'image/voyelles/A.jpeg',
    'B': 'image/bilabiales/B.jpeg',
    'C': 'image/velaires/C.jpeg',
    'D': 'image/dentales/D.jpeg',
    'E': 'image/voyelles/E.jpeg',
    'F': 'image/fricatives/F.jpeg',
    'G': 'image/velaires/G.jpeg',
    'I': 'image/voyelles/I.jpeg',
    'J': 'image/fricatives/J.jpeg',
    'K': 'image/velaires/K.jpeg',
    'L': 'image/liquide/L.jpeg',
    'M': 'image/bilabiales/M.jpeg',
    'N': 'image/dentales/N.jpeg',
    'O': 'image/voyelles/O.jpeg',
    'P': 'image/bilabiales/P.jpeg',
    'R': 'image/liquide/R.jpeg',
    'S': 'image/fricatives/S.jpeg',
    'T': 'image/dentales/T.jpeg',
    'U': 'image/voyelles/U.jpeg',
    'V': 'image/fricatives/V.jpeg',
    'Z': 'image/fricatives/Z.png',
  };

  // ── ACCESSEURS ────────────────────────────────────────────
  function getMouthSVG(pos) {
    if (pos === 'spread') return _SPREAD_SVG;
    const src = QUIZ_IMG[pos];
    if (src) return `<img src="${src}" alt="Position de bouche" class="mouth-img">`;
    return _SPREAD_SVG;
  }

  function getMouthImg(phoneme) {
    if (phoneme.id === 'v-ei') return _SPREAD_SVG;
    const src = PHONEME_IMG[phoneme.id];
    if (src) return `<img src="${src}" alt="Position de bouche pour le son ${phoneme.symbol}" class="mouth-img">`;
    return getMouthSVG(phoneme.mouthPos);
  }

  function getLSFSVG(letter) {
    const src = LSF_IMG[letter] || LSF_IMG['A'];
    return `<img src="${src}" alt="Son ${letter}" class="lsf-img">`;
  }

  // ── ÉTAT LOCAL ────────────────────────────────────────────
  let _currentPanel = null;
  let _recSession   = null;

  // ── CONSTRUCTION DES GRILLES ─────────────────────────────
  function init() {
    _buildVoyellesGrid();
    _buildConsonnesGroups();
  }

  function _buildVoyellesGrid() {
    const grid = document.getElementById('voyellesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    VOYELLES.forEach(v => grid.appendChild(_createPhonemeCard(v)));
  }

  function _buildConsonnesGroups() {
    const container = document.getElementById('consonnesContainer');
    if (!container) return;
    container.innerHTML = '';
    CONSONNES_GROUPS.forEach(group => {
      const section = document.createElement('div');
      section.className = 'phoneme-group';
      const header = document.createElement('div');
      header.className = 'phoneme-group-header';
      header.innerHTML = `
        <span class="phoneme-group-label">${group.label}</span>
        <span class="phoneme-group-desc">${group.desc}</span>
      `;
      const grid = document.createElement('div');
      grid.className = 'phoneme-grid';
      group.phonemes.forEach(p => grid.appendChild(_createPhonemeCard(p)));
      section.appendChild(header);
      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  function _createPhonemeCard(phoneme) {
    const done = State.has('completedPhonemes', phoneme.id);
    const card = document.createElement('div');
    card.className = 'phoneme-card' + (done ? ' phoneme-card--done' : '');
    card.id = 'pcard-' + phoneme.id;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Son ' + phoneme.symbol + ', exemple : ' + phoneme.example);
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="phoneme-card__symbol">${phoneme.symbol}</div>
      <div class="phoneme-card__example">${phoneme.example}</div>
      ${done ? '<i class="fa-solid fa-circle-check phoneme-card__check" aria-hidden="true"></i>' : ''}
    `;
    card.addEventListener('click', () => openPhonemePanel(phoneme));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPhonemePanel(phoneme); }
    });
    return card;
  }

  // ── PANNEAU D'EXERCICE ────────────────────────────────────
  function openPhonemePanel(phoneme) {
    _currentPanel = phoneme;
    if (State.get('completedPhonemes').length === 0 && !State.has('earnedBadges', 'first_sound')) {
      Utils.earnBadge('first_sound');
    }
    Utils.playPhoneme(phoneme.id, phoneme.symbol);
    document.getElementById('panelSymbol').textContent  = phoneme.symbol;
    document.getElementById('panelExample').textContent = phoneme.example;
    document.getElementById('panelHint').textContent    = phoneme.hint;
    document.getElementById('panelMouth').innerHTML     = getMouthImg(phoneme);
    document.getElementById('panelLSF').innerHTML       = getLSFSVG(phoneme.lsfLetter);
    document.getElementById('panelLSFLabel').textContent = phoneme.symbol;
    _resetPanelFeedback();
    _startLSFBlink();
    const overlay = document.getElementById('phonemeModal');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closePhonemePanel() {
    _currentPanel = null;
    _stopLSFBlink();
    _stopRecording();
    const overlay = document.getElementById('phonemeModal');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function _resetPanelFeedback() {
    const fb = document.getElementById('panelFeedback');
    if (fb) { fb.className = 'phoneme-feedback'; fb.innerHTML = ''; }
    const btn = document.getElementById('panelRepeatBtn');
    if (btn) {
      btn.disabled  = false;
      btn.className = 'btn-primary';
      btn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Je répète !';
    }
    document.getElementById('panelMarkDoneBtn').style.display = 'none';
    const zone   = document.getElementById('transcriptZone');
    const textEl = document.getElementById('transcriptText');
    const label  = document.getElementById('transcriptLabel');
    if (zone)   zone.className    = 'transcript-zone transcript-zone--idle';
    if (textEl) textEl.textContent = '—';
    if (label)  label.textContent  = 'Ce que tu as dit';
  }

  function replaySound() {
    if (!_currentPanel) return;
    Utils.playPhoneme(_currentPanel.id, _currentPanel.symbol);
    _startLSFBlink();
  }

  function toggleRepeat() {
    if (_recSession) _stopManually();
    else             startRepeat();
  }

  function startRepeat() {
    if (!_currentPanel || _recSession) return;

    if (localStorage.getItem('articule_active_user') === 'guest') {
      localStorage.removeItem('articule_active_user');
      Sons.closePhonemePanel();
      window.location.href = 'login.html';
      return;
    }

    const btn = document.getElementById('panelRepeatBtn');
    btn.disabled  = false;
    btn.className = 'btn-primary btn-stop';
    btn.innerHTML = '<i class="fa-solid fa-stop" aria-hidden="true"></i> Arrêter';

    const zone   = document.getElementById('transcriptZone');
    const textEl = document.getElementById('transcriptText');
    const label  = document.getElementById('transcriptLabel');
    if (zone)   zone.className    = 'transcript-zone transcript-zone--listening';
    if (textEl) textEl.textContent = '...';
    if (label)  label.textContent  = 'J\'enregistre...';

    const fb = document.getElementById('panelFeedback');
    fb.className = 'phoneme-feedback phoneme-feedback--listening';
    fb.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Parle maintenant !';

    _recSession = Utils.recognize(
      _currentPanel.testWords,
      7000,
      (result) => _handleRecognitionResult(result),
      (interim) => _onInterim(interim)
    );
  }

  // ── COMPARAISON TEXTE → LETTRE CIBLE ──────────────────────
  function _matchPhoneme(transcript, phoneme) {
    if (!transcript || !phoneme) return false;
    const norm = s => (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Mn}/gu, '')
      .replace(/[^a-z]/g, '')
      .trim();

    const t   = norm(transcript);
    const sym = norm(phoneme.symbol);

    if (!t) return false;
    if (sym && t.startsWith(sym)) return true;

    return phoneme.testWords.some(w => {
      const nw = norm(w);
      return nw && (t === nw || t.startsWith(nw) || t.includes(nw));
    });
  }

  // Mise à jour affichage pendant l'enregistrement (compte à rebours ou envoi)
  function _onInterim(text) {
    const textEl = document.getElementById('transcriptText');
    const label  = document.getElementById('transcriptLabel');
    if (!textEl) return;
    if (text === '__sending__') {
      textEl.textContent = 'Analyse...';
      if (label) label.textContent = 'Analyse en cours...';
    } else if (text) {
      textEl.textContent = 'Enregistrement ' + text;
      if (label) label.textContent = 'J\'enregistre...';
    }
  }

  function _stopManually() {
    if (!_recSession) return;
    const btn = document.getElementById('panelRepeatBtn');
    if (btn) btn.disabled = true;
    _recSession.abort();
  }

  function _stopRecording() {
    if (_recSession) { try { _recSession.abort(); } catch(e) {} _recSession = null; }
  }

  function _handleRecognitionResult(result) {
    _recSession = null;

    const btn = document.getElementById('panelRepeatBtn');
    btn.disabled  = false;
    btn.className = 'btn-primary';
    btn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Je répète !';

    const fb     = document.getElementById('panelFeedback');
    const zone   = document.getElementById('transcriptZone');
    const textEl = document.getElementById('transcriptText');
    const label  = document.getElementById('transcriptLabel');

    // Clé API absente
    if (result.noKey) {
      if (zone)   zone.className    = 'transcript-zone transcript-zone--idle';
      if (textEl) textEl.textContent = '—';
      if (label)  label.textContent  = 'Ce que tu as dit';
      fb.className = 'phoneme-feedback phoneme-feedback--info';
      fb.innerHTML = '<i class="fa-solid fa-key"></i> Reconnaissance vocale non configurée — va dans "Mon Compte".';
      document.getElementById('panelMarkDoneBtn').style.display = 'inline-flex';
      return;
    }

    // Erreurs diverses
    if (result.error) {
      const msgs = {
        bad_key:    '<i class="fa-solid fa-key"></i> Clé d\'activation invalide.',
        mic_denied: '<i class="fa-solid fa-microphone-slash"></i> Accès au micro refusé.',
        network:    '<i class="fa-solid fa-wifi"></i> Erreur réseau — vérifie ta connexion.',
        too_short:  '<i class="fa-solid fa-circle-info"></i> Enregistrement trop court — réessaie.',
        api_error:  '<i class="fa-solid fa-circle-exclamation"></i> Erreur serveur — réessaie.'
      };
      if (zone)   zone.className    = 'transcript-zone transcript-zone--error';
      if (textEl) textEl.textContent = '—';
      if (label)  label.textContent  = 'Erreur';
      fb.className = 'phoneme-feedback phoneme-feedback--error';
      fb.innerHTML = msgs[result.error] || msgs.api_error;
      document.getElementById('panelMarkDoneBtn').style.display = 'inline-flex';
      return;
    }

    const heard = (result.recognized || '').trim();

    if (label)  label.textContent  = 'Tu as dit';
    if (textEl) textEl.textContent  = heard || '?';

    if (!heard) {
      if (zone) zone.className = 'transcript-zone transcript-zone--error';
      fb.className = 'phoneme-feedback phoneme-feedback--error';
      fb.innerHTML = '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Rien entendu — parle clairement et proche du micro !';
      btn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Réessayer';
      document.getElementById('panelMarkDoneBtn').style.display = 'inline-flex';
      return;
    }

    const success = _matchPhoneme(heard, _currentPanel);

    if (success) {
      if (zone) zone.className = 'transcript-zone transcript-zone--success';
      fb.className = 'phoneme-feedback phoneme-feedback--success';
      fb.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Bravo ! C\'est bien le son !';
      Utils.fireConfetti();
      _markCurrentDone();
    } else {
      if (zone) zone.className = 'transcript-zone transcript-zone--error';
      fb.className = 'phoneme-feedback phoneme-feedback--error';
      fb.innerHTML = '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Pas tout à fait... réessaie !';
      btn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Réessayer';
      document.getElementById('panelMarkDoneBtn').style.display = 'inline-flex';
    }
  }

  function _markCurrentDone() {
    if (!_currentPanel) return;
    const id = _currentPanel.id;
    if (!State.has('completedPhonemes', id)) {
      State.push('completedPhonemes', id);
      Utils.addStars(10);
      Utils.logJournal('fa-comment', 'Son prononcé : ' + _currentPanel.symbol + ' (' + _currentPanel.example + ')');
      const card = document.getElementById('pcard-' + id);
      if (card) {
        card.classList.add('phoneme-card--done');
        if (!card.querySelector('.phoneme-card__check')) {
          const icon = document.createElement('i');
          icon.className = 'fa-solid fa-circle-check phoneme-card__check';
          card.appendChild(icon);
        }
      }
      _checkBadges();
    }
    document.getElementById('panelMarkDoneBtn').style.display = 'none';
  }

  function markDoneManually() { _markCurrentDone(); }

  function _checkBadges() {
    const done   = State.get('completedPhonemes');
    const vowels = VOYELLES.map(v => v.id);
    if (vowels.every(id => done.includes(id))) Utils.earnBadge('all_vowels');
    const bilIds = CONSONNES_GROUPS.find(g => g.groupId === 'bilabiales').phonemes.map(p => p.id);
    if (bilIds.every(id => done.includes(id))) Utils.earnBadge('all_bilabiales');
  }

  // ── ANIMATION CLIGNOTANTE (côté droit) ───────────────────
  let _lsfBlinkTimer = null;

  function _startLSFBlink() {
    _stopLSFBlink();
    const el = document.getElementById('panelLSF');
    if (!el) return;
    let visible = true;
    el.style.opacity = '1';
    _lsfBlinkTimer = setInterval(() => {
      visible = !visible;
      el.style.opacity = visible ? '1' : '0.2';
    }, 500);
    setTimeout(_stopLSFBlink, 4000);
  }

  function _stopLSFBlink() {
    if (_lsfBlinkTimer) { clearInterval(_lsfBlinkTimer); _lsfBlinkTimer = null; }
    const el = document.getElementById('panelLSF');
    if (el) el.style.opacity = '1';
  }

  // ── API PUBLIQUE ──────────────────────────────────────────
  return {
    init, openPhonemePanel, closePhonemePanel,
    replaySound, startRepeat, toggleRepeat, markDoneManually,
    getMouthSVG, getMouthImg, getLSFSVG
  };

})();
