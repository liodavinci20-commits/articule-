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

  // ── BULLES (MICRO AMPLITUDE) ──────────────────────────────
  let _micCtx      = null;
  let _micAnalyser = null;
  let _micStream   = null;
  let _micRAF      = null;
  let _bubblesActive = false;

  async function startBubbleMic() {
    if (_bubblesActive) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: true,
          channelCount: 1
        },
        video: false
      });
      _micStream   = stream;
      _micCtx      = new (window.AudioContext || window.webkitAudioContext)();
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
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
        const rms = Math.sqrt(sum / buffer.length);
        if (rms > 5) _triggerBubbles(Math.min(1, rms / 40));
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
    if (_micRAF)    cancelAnimationFrame(_micRAF);
    if (_micStream) _micStream.getTracks().forEach(t => t.stop());
    if (_micCtx)    _micCtx.close().catch(() => {});
    _micCtx = _micAnalyser = _micStream = _micRAF = null;
  }

  // ── VISUALISEUR D'ONDE (canvas temps réel) ────────────────
  let _waveRAF    = null;
  let _waveCanvas = null;

  function startWaveform(canvas) {
    stopWaveform();
    if (!canvas) return;
    _waveCanvas = canvas;

    const ctx  = canvas.getContext('2d');
    let lastW  = 0;
    let lastH  = 0;

    function draw() {
      _waveRAF = requestAnimationFrame(draw);

      // Relire les dimensions à chaque frame : gère le resize et le layout différé
      const dpr = window.devicePixelRatio || 1;
      const W   = canvas.offsetWidth  || 0;
      const H   = canvas.offsetHeight || 0;

      if (!W || !H) return; // canvas pas encore visible dans le DOM

      // Redimensionner le buffer si nécessaire (reset du contexte canvas)
      if (W !== lastW || H !== lastH) {
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);
        lastW = W;
        lastH = H;
      }

      ctx.clearRect(0, 0, W, H);

      // Fond légèrement teinté
      ctx.fillStyle = 'rgba(184, 92, 56, 0.06)';
      ctx.fillRect(0, 0, W, H);

      // Ligne centrale en pointillés (référence silence)
      ctx.strokeStyle = 'rgba(184, 92, 56, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0,   H / 2);
      ctx.lineTo(W,   H / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (!_micAnalyser) return;

      // Données de forme d'onde (domaine temporel)
      const data = new Uint8Array(_micAnalyser.fftSize);
      _micAnalyser.getByteTimeDomainData(data);

      // Calcul de l'amplitude RMS pour colorer l'onde
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms       = Math.sqrt(sum / data.length);
      const intensity = Math.min(1, rms * 7);

      // Couleur : terracotta calme → or vif quand fort
      const r = Math.round(184 + (196 - 184) * intensity);
      const g = Math.round(92  + (154 - 92)  * intensity);
      const b = Math.round(56  + (58  - 56)  * intensity);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.55 + intensity * 0.45})`;
      ctx.lineWidth   = 2 + intensity * 3;
      ctx.lineJoin    = 'round';
      ctx.lineCap     = 'round';

      // Tracé de l'onde
      ctx.beginPath();
      const step = W / data.length;
      for (let i = 0; i < data.length; i++) {
        const y = (data[i] / 128.0) * (H / 2);
        if (i === 0) ctx.moveTo(0, y);
        else         ctx.lineTo(i * step, y);
      }
      ctx.stroke();
    }

    draw();
  }

  function stopWaveform() {
    if (_waveRAF) { cancelAnimationFrame(_waveRAF); _waveRAF = null; }
    if (_waveCanvas) {
      const ctx = _waveCanvas.getContext('2d');
      ctx.clearRect(0, 0, _waveCanvas.width, _waveCanvas.height);
      _waveCanvas = null;
    }
  }

  function _triggerBubbles(intensity) {
    const spans = document.querySelectorAll('.bg-bubbles span');
    if (!spans.length) return;
    const count = Math.round(intensity * 2) + 1;
    Array.from(spans)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .forEach(span => {
        span.classList.remove('bubble-rise');
        void span.offsetWidth;
        span.classList.add('bubble-rise');
      });
  }

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

  // ── SPEECH RECOGNITION ───────────────────────────────────
  // Retourne { recognized, success, quality, error? }
  // onInterim(text) : appelé en temps réel à chaque fragment capturé
  function recognize(expectedWords, timeoutMs, callback, onInterim) {
    const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SRClass) {
      callback({ recognized: '', success: true, quality: 0.5, noApi: true });
      return null;
    }

    const rec = new SRClass();
    rec.lang            = 'fr-FR';
    rec.interimResults  = true;  // résultats en temps réel pour l'affichage et la sensibilité
    rec.maxAlternatives = 8;
    rec.continuous      = false;

    // Focaliser la reconnaissance sur les mots attendus (améliore la précision)
    try {
      const GList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
      if (GList) {
        const grammar = '#JSGF V1.0; grammar mots; public <mot> = ' + expectedWords.join(' | ') + ' ;';
        const list = new GList();
        list.addFromString(grammar, 1);
        rec.grammars = list;
      }
    } catch(e) {}

    let done  = false;
    let timer = null;

    function finish(result) {
      if (done) return;
      done = true;
      if (timer) clearTimeout(timer);
      try { rec.abort(); } catch(e) {}
      callback(result);
    }

    rec.onresult = (e) => {
      let interimText = '';
      let finalText   = '';
      const finalAlts = [];

      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          finalText += res[0].transcript;
          for (let j = 0; j < res.length; j++) {
            finalAlts.push(res[j].transcript.toLowerCase().trim());
          }
        } else {
          interimText += res[0].transcript;
        }
      }

      // Retour visuel en temps réel
      const liveText = (interimText || finalText).trim();
      if (onInterim && liveText) onInterim(liveText);

      // Traiter uniquement le résultat final
      if (finalText) {
        const best = finalText.toLowerCase().trim();
        if (!finalAlts.length) finalAlts.push(best);
        const quality = _scoreRecognition(best, finalAlts, expectedWords);
        finish({ recognized: finalText.trim(), success: quality > 0.3, quality });
      }
    };

    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') {
        finish({ recognized: '', success: false, quality: 0, error: e.error });
      } else {
        finish({ recognized: '', success: true, quality: 0.4, error: e.error });
      }
    };

    rec.onend = () => finish({ recognized: '', success: false, quality: 0 });

    timer = setTimeout(
      () => finish({ recognized: '', success: false, quality: 0, error: 'timeout' }),
      timeoutMs || 7000
    );

    rec.start();
    return rec;
  }

  // ── SCORING DE RECONNAISSANCE ─────────────────────────────

  // Distance de Levenshtein : nombre minimal de modifications (insertion,
  // suppression, substitution) pour passer d'une chaîne à l'autre.
  // Permet d'accepter les sons phonétiquement proches : "ba"/"va", "chat"/"sha"…
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
    // Normalise : minuscules, sans accents, sans ponctuation
    const normalize = s => s.toLowerCase()
      .normalize('NFD')
      .replace(/\p{Mn}/gu, '')
      .replace(/[^a-z\s]/g, '')
      .trim();

    const normBest     = normalize(best);
    const normExpected = expectedWords.map(normalize);
    const normAlts     = alts.map(normalize);

    // Toutes les transcriptions candidates (meilleure + toutes les alternatives)
    const allT = [normBest, ...normAlts].filter(Boolean);

    // Niveau 1 — correspondance exacte sur n'importe quelle alternative
    if (normExpected.some(w => allT.some(t => t === w))) return 1.0;

    // Niveau 2 — la transcription contient le mot attendu
    //   ex : attendu "ba", entendu "bah" ou "basse" → accepté
    if (normExpected.some(w => allT.some(t => t.includes(w)))) return 0.85;

    // Niveau 3 — pour les sons très courts (≤ 3 chars) : le mot attendu
    //   contient la transcription. ex : attendu "ba", entendu "b" → accepté
    if (normExpected.some(w =>
      w.length <= 3 && allT.some(t => t.length > 0 && w.includes(t))
    )) return 0.75;

    // Niveau 4 — distance de Levenshtein : tolérance phonétique
    //   ex : "ba"/"va" → dist 1 ✓ | "chat"/"sha" → dist 2 ✓
    //   Appliqué uniquement aux mots courts (≤ 6 chars) pour éviter les faux positifs
    for (const w of normExpected) {
      if (w.length <= 6) {
        const maxDist = w.length <= 3 ? 1 : 2;
        if (allT.some(t => _levenshtein(t, w) <= maxDist)) return 0.65;
      }
    }

    // Aucune correspondance
    return 0.15;
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
    recognize,
    startWaveform,
    stopWaveform
  };

})();
