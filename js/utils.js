/* =============================================================
   UTILS.JS — Utilitaires partagés
   Toast, confetti, étoiles, journal, TTS, reconnaissance vocale
============================================================= */

const Utils = (() => {

  // ── TOAST ─────────────────────────────────────────────────
  let _toastTimer = null;

  function showToast(msg, type = 'info') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show toast--' + type;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
  }

  // ── ÉTOILES ───────────────────────────────────────────────
  function addStars(n) {
    const current = State.get('stars');
    State.set('stars', current + n);

    if (current < 50  && current + n >= 50)  earnBadge('stars_50');
    if (current < 100 && current + n >= 100) earnBadge('stars_100');

    updateProgressUI();
    showToast('+' + n + ' étoiles !', 'success');
  }

  function updateProgressUI() {
    const pct = State.computeProgress();
    State.set('progress', pct);
    const fill  = document.getElementById('progressFill');
    const text  = document.getElementById('progressText');
    const stars = document.getElementById('starsCount');
    if (fill)  fill.style.width = pct + '%';
    if (text)  text.textContent = pct;
    if (stars) stars.textContent = State.get('stars');
  }

  // ── BADGES ────────────────────────────────────────────────
  function earnBadge(key) {
    if (State.has('earnedBadges', key)) return;
    State.push('earnedBadges', key);
    const badge = BADGES_DATA.find(b => b.key === key);
    if (badge) {
      showToast('Badge débloqué : ' + badge.name + ' !', 'badge');
      logJournal('fa-award', 'Badge obtenu : ' + badge.name);
      if (badge.stars > 0) {
        const s = State.get('stars');
        State.set('stars', s + badge.stars);
      }
    }
    if (document.getElementById('screen-recompenses').classList.contains('active')) {
      Recompenses.refresh();
    }
  }

  // ── JOURNAL ───────────────────────────────────────────────
  function logJournal(icon, text) {
    const now  = new Date();
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    State.push('journal', { icon, text, time, date });
    const journal = State.get('journal');
    if (journal.length > 50) State.set('journal', journal.slice(-50));
  }

  // ── CONFETTI ──────────────────────────────────────────────
  function fireConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    const colors = ['#B85C38', '#5C8A6B', '#4A7BA8', '#6B4E8A', '#C49A3A', '#A84A4A'];
    for (let i = 0; i < 28; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (Math.random() * 1.5 + 1.2) + 's';
      piece.style.animationDelay    = (Math.random() * 0.6) + 's';
      piece.style.width  = (Math.random() * 8 + 6)  + 'px';
      piece.style.height = (Math.random() * 8 + 10) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 3500);
    }
  }

  // ── CLÉ D'ACTIVATION ─────────────────────────────────────
  function getApiKey() {
    return localStorage.getItem('deepgram_api_key') || '';
  }

  function setApiKey(key) {
    localStorage.setItem('deepgram_api_key', (key || '').trim());
  }

  // ── SPEECH SYNTHESIS (TTS) ────────────────────────────────
  function speak(text, onEnd) {
    if (window.responsiveVoice && responsiveVoice.voiceSupport()) {
      responsiveVoice.cancel();
      responsiveVoice.speak(text, 'French Female', {
        rate: 0.8, pitch: 1.0, volume: 1.0,
        onend: onEnd || undefined
      });
      return;
    }
    if (!window.speechSynthesis) { if (onEnd) onEnd(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang   = 'fr-FR';
    utt.rate   = 0.8;
    utt.pitch  = 1.0;
    utt.volume = 1.0;
    const voices  = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang === 'fr-FR' && v.localService)
                 || voices.find(v => v.lang.startsWith('fr') && v.localService)
                 || voices.find(v => v.lang.startsWith('fr'))
                 || null;
    if (frVoice) utt.voice = frVoice;
    if (onEnd) utt.onend = onEnd;
    window.speechSynthesis.speak(utt);
  }

  // ── RECONNAISSANCE VOCALE ────────────────────────────────
  // Détecte le meilleur format audio supporté par le navigateur
  function _getBestMimeType() {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];
    return types.find(t => {
      try { return MediaRecorder.isTypeSupported(t); } catch(e) { return false; }
    }) || 'audio/webm';
  }

  // Retourne un handle { abort() } synchroniquement.
  // L'enregistrement démarre dès que getUserMedia répond.
  // onInterim(text) est appelé avec le compte à rebours puis '__sending__'.
  function recognize(expectedWords, timeoutMs, callback, onInterim) {
    const apiKey = getApiKey();

    if (!apiKey) {
      setTimeout(() => callback({ recognized: '', success: false, quality: 0, noKey: true }), 0);
      return { abort() {} };
    }

    const handle = { _recorder: null, _stream: null, _timers: [] };
    const maxMs  = timeoutMs || 7000;
    const chunks = [];
    const mime   = _getBestMimeType();
    const ctType = mime.split(';')[0];  // sans paramètre codec pour le Content-Type

    handle.abort = function() {
      this._timers.forEach(id => { clearTimeout(id); clearInterval(id); });
      this._timers = [];
      if (this._recorder && this._recorder.state === 'recording') {
        this._recorder.stop();
      } else if (this._stream) {
        this._stream.getTracks().forEach(t => t.stop());
      }
    };

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        handle._stream = stream;

        let recorder;
        try {
          recorder = new MediaRecorder(stream, { mimeType: mime });
        } catch(e) {
          recorder = new MediaRecorder(stream);
        }
        handle._recorder = recorder;

        recorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
          handle._timers.forEach(id => { clearTimeout(id); clearInterval(id); });
          handle._timers = [];
          stream.getTracks().forEach(t => t.stop());

          if (onInterim) onInterim('__sending__');

          const audioBlob = new Blob(chunks, { type: ctType });

          if (audioBlob.size < 500) {
            callback({ recognized: '', success: false, quality: 0, error: 'too_short' });
            return;
          }

          try {
            const res = await fetch(
              'https://api.deepgram.com/v1/listen?language=fr&model=nova-2&punctuate=false',
              {
                method: 'POST',
                headers: {
                  'Authorization': 'Token ' + apiKey,
                  'Content-Type': ctType
                },
                body: audioBlob
              }
            );

            if (!res.ok) {
              callback({
                recognized: '', success: false, quality: 0,
                error: res.status === 401 ? 'bad_key' : 'api_error'
              });
              return;
            }

            const data = await res.json();
            const transcript = (
              data.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''
            ).trim();

            const quality = _scoreRecognition(transcript, [transcript], expectedWords);
            callback({ recognized: transcript, success: quality > 0.3, quality });

          } catch(e) {
            callback({ recognized: '', success: false, quality: 0, error: 'network' });
          }
        };

        recorder.start(250);

        // Compte à rebours affiché dans la zone transcript
        let remaining = Math.round(maxMs / 1000);
        if (onInterim) onInterim(remaining + 's');
        const tick = setInterval(() => {
          remaining--;
          if (remaining > 0 && onInterim) onInterim(remaining + 's');
        }, 1000);
        handle._timers.push(tick);

        // Arrêt automatique après maxMs
        const autoStop = setTimeout(() => {
          if (recorder.state === 'recording') recorder.stop();
        }, maxMs);
        handle._timers.push(autoStop);
      })
      .catch(() => {
        callback({ recognized: '', success: false, quality: 0, error: 'mic_denied' });
      });

    return handle;
  }

  // ── SCORING DE RECONNAISSANCE ─────────────────────────────

  function _levenshtein(a, b) {
    if (a === b)      return 0;
    if (!a.length)    return b.length;
    if (!b.length)    return a.length;
    const row = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = row[j];
        row[j] = a[i-1] === b[j-1] ? prev : 1 + Math.min(prev, row[j], row[j-1]);
        prev = tmp;
      }
    }
    return row[b.length];
  }

  function _scoreRecognition(best, alts, expectedWords) {
    const normalize = s => s.toLowerCase()
      .normalize('NFD')
      .replace(/\p{Mn}/gu, '')
      .replace(/[^a-z\s]/g, '')
      .trim();

    const normBest     = normalize(best);
    const normExpected = expectedWords.map(normalize);
    const normAlts     = alts.map(normalize);
    const allT         = [normBest, ...normAlts].filter(Boolean);

    if (normExpected.some(w => allT.some(t => t === w))) return 1.0;
    if (normExpected.some(w => allT.some(t => t.includes(w)))) return 0.85;
    if (normExpected.some(w =>
      w.length <= 3 && allT.some(t => t.length > 0 && w.includes(t))
    )) return 0.75;
    for (const w of normExpected) {
      if (w.length <= 6) {
        const maxDist = w.length <= 3 ? 1 : 2;
        if (allT.some(t => _levenshtein(t, w) <= maxDist)) return 0.65;
      }
    }
    return 0.15;
  }

  return {
    showToast,
    addStars,
    updateProgressUI,
    earnBadge,
    logJournal,
    fireConfetti,
    getApiKey,
    setApiKey,
    speak,
    recognize
  };

})();
