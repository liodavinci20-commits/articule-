/* =============================================================
   UTILS.JS — Utilitaires partagés
   Toast, confetti, bulles micro, étoiles, journal
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
    _toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
  }

  // ── ÉTOILES ───────────────────────────────────────────────
  function addStars(n) {
    const current = State.get('stars');
    State.set('stars', current + n);

    // Vérifier badges d'étoiles
    if (current < 50 && current + n >= 50)  earnBadge('stars_50');
    if (current < 100 && current + n >= 100) earnBadge('stars_100');

    updateProgressUI();
    showToast('+' + n + ' étoiles !', 'success');
  }

  function updateProgressUI() {
    const pct = State.computeProgress();
    State.set('progress', pct);
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const stars = document.getElementById('starsCount');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = pct;
    if (stars) stars.textContent = State.get('stars');
  }

  // ── BADGES ────────────────────────────────────────────────
  function earnBadge(key) {
    if (State.has('earnedBadges', key)) return;
    State.push('earnedBadges', key);
    const badge = BADGES_DATA.find(b => b.key === key);
    if (badge) {
      showToast('Badge débloque : ' + badge.name + ' !', 'badge');
      logJournal('fa-award', 'Badge obtenu : ' + badge.name);
      if (badge.stars > 0) {
        const s = State.get('stars');
        State.set('stars', s + badge.stars);
      }
    }
    // Rafraîchir l'onglet récompenses si ouvert
    if (document.getElementById('screen-recompenses').classList.contains('active')) {
      Recompenses.refresh();
    }
  }

  // ── JOURNAL ───────────────────────────────────────────────
  function logJournal(icon, text) {
    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    State.push('journal', { icon, text, time, date });
    // Limite à 50 entrées
    const journal = State.get('journal');
    if (journal.length > 50) {
      State.set('journal', journal.slice(-50));
    }
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
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      piece.style.width = (Math.random() * 8 + 6) + 'px';
      piece.style.height = (Math.random() * 8 + 10) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 3500);
    }
  }

  // ── BULLES (MICRO AMPLITUDE) ──────────────────────────────
  let _micCtx = null;
  let _micAnalyser = null;
  let _micStream = null;
  let _micRAF = null;
  let _bubblesActive = false;

  async function startBubbleMic() {
    if (_bubblesActive) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      _micStream = stream;
      _micCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = _micCtx.createMediaStreamSource(stream);
      _micAnalyser = _micCtx.createAnalyser();
      _micAnalyser.fftSize = 256;
      _micAnalyser.smoothingTimeConstant = 0.7;
      source.connect(_micAnalyser);

      const buffer = new Uint8Array(_micAnalyser.frequencyBinCount);
      _bubblesActive = true;

      function tick() {
        if (!_bubblesActive) return;
        _micAnalyser.getByteFrequencyData(buffer);
        // RMS simplifié
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
        const rms = Math.sqrt(sum / buffer.length);
        if (rms > 12) {
          _triggerBubbles(Math.min(1, rms / 60));
        }
        _micRAF = requestAnimationFrame(tick);
      }
      tick();
      return true;
    } catch(e) {
      console.warn('Accès micro refusé pour les bulles :', e);
      return false;
    }
  }

  function stopBubbleMic() {
    _bubblesActive = false;
    if (_micRAF) cancelAnimationFrame(_micRAF);
    if (_micStream) _micStream.getTracks().forEach(t => t.stop());
    if (_micCtx) _micCtx.close().catch(() => {});
    _micCtx = _micAnalyser = _micStream = _micRAF = null;
  }

  function _triggerBubbles(intensity) {
    const spans = document.querySelectorAll('.bg-bubbles span');
    if (!spans.length) return;
    const count = Math.round(intensity * 2) + 1;
    const all = Array.from(spans);
    // Mélange et prend 'count' bulles
    const picks = all.sort(() => Math.random() - 0.5).slice(0, count);
    picks.forEach(span => {
      span.classList.remove('bubble-rise');
      // Force reflow pour redémarrer l'animation
      void span.offsetWidth;
      span.classList.add('bubble-rise');
    });
  }

  // Déclencher manuellement (ex: succès de prononciation)
  function triggerBubblesManual(count = 4) {
    const spans = document.querySelectorAll('.bg-bubbles span');
    Array.from(spans)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .forEach((span, i) => {
        setTimeout(() => {
          span.classList.remove('bubble-rise');
          void span.offsetWidth;
          span.classList.add('bubble-rise');
        }, i * 80);
      });
  }

  // ── SPEECH SYNTHESIS (TTS) ────────────────────────────────
  function speak(text, onEnd) {
    if (!window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'fr-FR';
    utt.rate = 0.8;   // légèrement ralenti pour apprentissage
    utt.pitch = 1.0;
    utt.volume = 1.0;

    // Préférer une voix française si disponible
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr')) || null;
    if (frVoice) utt.voice = frVoice;

    if (onEnd) utt.onend = onEnd;
    window.speechSynthesis.speak(utt);
  }

  // ── SPEECH RECOGNITION ───────────────────────────────────
  // Retourne { recognized, success, quality }
  function recognize(expectedWords, timeoutMs, callback) {
    const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SRClass) {
      // Navigateur non compatible → succès auto (ne pénalise pas l'élève)
      callback({ recognized: '', success: true, quality: 0.5, noApi: true });
      return null;
    }

    const rec = new SRClass();
    rec.lang = 'fr-FR';
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    rec.continuous = false;

    let done = false;
    let timer = null;

    function finish(result) {
      if (done) return;
      done = true;
      if (timer) clearTimeout(timer);
      try { rec.abort(); } catch(e) {}
      callback(result);
    }

    rec.onresult = (e) => {
      const alts = Array.from(e.results[0]).map(r => r.transcript.toLowerCase().trim());
      const best = alts[0] || '';
      const quality = _scoreRecognition(best, alts, expectedWords);
      finish({ recognized: best, success: quality > 0.3, quality });
    };

    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') {
        finish({ recognized: '', success: false, quality: 0, error: e.error });
      } else {
        // Autre erreur → succès auto
        finish({ recognized: '', success: true, quality: 0.4, error: e.error });
      }
    };

    rec.onend = () => {
      finish({ recognized: '', success: false, quality: 0 });
    };

    timer = setTimeout(() => {
      finish({ recognized: '', success: false, quality: 0, error: 'timeout' });
    }, timeoutMs || 4000);

    rec.start();
    return rec;
  }

  function _scoreRecognition(best, alts, expectedWords) {
    const normalize = s => s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // sans accents
      .replace(/[^a-z\s]/g, '').trim();

    const normBest = normalize(best);
    const normExpected = expectedWords.map(normalize);

    // Match exact
    if (normExpected.some(w => normBest === w)) return 1.0;

    // Match partiel (mot attendu contenu dans recognized ou vice versa)
    if (normExpected.some(w => normBest.includes(w) || w.includes(normBest))) return 0.8;

    // Check alternatives
    const normAlts = alts.map(normalize);
    if (normExpected.some(w => normAlts.some(a => a.includes(w) || w.includes(a)))) return 0.7;

    // Son entendu (quelque chose) → essai partiel
    if (normBest.length > 0) return 0.4;

    return 0;
  }

  return {
    showToast,
    addStars,
    updateProgressUI,
    earnBadge,
    logJournal,
    fireConfetti,
    startBubbleMic,
    stopBubbleMic,
    triggerBubblesManual,
    speak,
    recognize
  };

})();
