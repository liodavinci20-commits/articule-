/* =============================================================
   RESPIRATION.JS — Module respiration + musique Web Audio
============================================================= */

const Respiration = (() => {

  // ── ÉTAT ─────────────────────────────────────────────────
  let _phase = 'idle';  // idle | inhale | hold | exhale
  let _cycles = 0;
  let _timer = null;
  let _countInterval = null;

  // ── WEB AUDIO (musique douce) ─────────────────────────────
  let _audioCtx = null;
  let _musicNodes = null;
  let _musicPlaying = false;

  function _createMusic() {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Reverb synthétique via ConvolverNode
    const convolver = _audioCtx.createConvolver();
    const reverbBuf = _createReverbBuffer(_audioCtx, 2.5);
    convolver.buffer = reverbBuf;

    // Gain master
    const masterGain = _audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, _audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.18, _audioCtx.currentTime + 2);

    // Drone 1 : La3 (220 Hz) — sinusoïde douce
    const osc1 = _audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, _audioCtx.currentTime);

    // Drone 2 : légèrement désaccordé (binaural leger)
    const osc2 = _audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(222.5, _audioCtx.currentTime); // +2.5 Hz = battement 2.5Hz

    // Harmony : Mi3 (165 Hz) très doux
    const osc3 = _audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(165, _audioCtx.currentTime);

    // Gains individuels
    const g1 = _audioCtx.createGain();
    const g2 = _audioCtx.createGain();
    const g3 = _audioCtx.createGain();
    g1.gain.setValueAtTime(0.5, _audioCtx.currentTime);
    g2.gain.setValueAtTime(0.5, _audioCtx.currentTime);
    g3.gain.setValueAtTime(0.3, _audioCtx.currentTime);

    // Connexions
    osc1.connect(g1); g1.connect(convolver);
    osc2.connect(g2); g2.connect(convolver);
    osc3.connect(g3); g3.connect(masterGain);
    convolver.connect(masterGain);
    masterGain.connect(_audioCtx.destination);

    osc1.start();
    osc2.start();
    osc3.start();

    return { osc1, osc2, osc3, masterGain };
  }

  // Crée un buffer de reverb synthétique (impulse response simple)
  function _createReverbBuffer(ctx, duration) {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buf = ctx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    return buf;
  }

  function startMusic() {
    if (_musicPlaying) return;
    try {
      _musicNodes = _createMusic();
      _musicPlaying = true;
      const btn = document.getElementById('musicToggleBtn');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-volume-high" aria-hidden="true"></i> Musique ON';
        btn.classList.add('btn--active');
      }
    } catch(e) {
      console.warn('Web Audio API non supportée :', e);
    }
  }

  function stopMusic() {
    if (!_musicPlaying || !_audioCtx || !_musicNodes) return;
    const { osc1, osc2, osc3, masterGain } = _musicNodes;
    // Fade out
    masterGain.gain.linearRampToValueAtTime(0, _audioCtx.currentTime + 1);
    setTimeout(() => {
      try {
        osc1.stop(); osc2.stop(); osc3.stop();
        _audioCtx.close();
      } catch(e) {}
      _musicNodes = null;
      _audioCtx = null;
      _musicPlaying = false;
    }, 1100);

    const btn = document.getElementById('musicToggleBtn');
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i> Musique OFF';
      btn.classList.remove('btn--active');
    }
  }

  function toggleMusic() {
    _musicPlaying ? stopMusic() : startMusic();
  }

  // Ajuste le volume selon la phase (inspire = monte, expire = descend)
  function _syncMusicToPhase(phase) {
    if (!_musicNodes || !_audioCtx) return;
    const { masterGain } = _musicNodes;
    const now = _audioCtx.currentTime;
    if (phase === 'inhale') {
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.linearRampToValueAtTime(0.22, now + 4);
    } else if (phase === 'exhale') {
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.linearRampToValueAtTime(0.12, now + 4);
    }
  }

  // ── EXERCICE DE RESPIRATION ───────────────────────────────
  const PHASES = [
    { key: 'inhale', label: 'INSPIREZ',    emoji: 'fa-arrow-up',    duration: 4000, circleClass: 'breath-circle--inhale' },
    { key: 'hold',   label: 'TENEZ',       emoji: 'fa-pause',       duration: 2000, circleClass: 'breath-circle--hold'   },
    { key: 'exhale', label: 'EXPIREZ',     emoji: 'fa-arrow-down',  duration: 4000, circleClass: 'breath-circle--exhale' }
  ];

  function init() {
    _cycles = State.get('breathCycles') || 0;
    _phase = 'idle';
    _updateCycleDisplay();
  }

  function start() {
    if (_phase !== 'idle') return;
    _runPhase(0, _cycles);
  }

  function _runPhase(phaseIndex, cycles) {
    if (cycles >= 5) {
      _onComplete();
      return;
    }

    if (phaseIndex >= PHASES.length) {
      phaseIndex = 0;
      cycles++;
      State.set('breathCycles', cycles);
      _cycles = cycles;
      _updateCycleDisplay();
    }

    const p = PHASES[phaseIndex];
    _phase = p.key;

    // UI
    _updatePhaseUI(p, cycles);
    _syncMusicToPhase(p.key);

    // Compte à rebours
    let secs = p.duration / 1000;
    _setCountdown(secs);
    _countInterval = setInterval(() => {
      secs--;
      if (secs > 0) _setCountdown(secs);
    }, 1000);

    _timer = setTimeout(() => {
      clearInterval(_countInterval);
      _runPhase(phaseIndex + 1, cycles);
    }, p.duration);
  }

  function _updatePhaseUI(phase, cycles) {
    const circle = document.getElementById('breathCircle');
    const label = document.getElementById('breathLabel');
    const icon = document.getElementById('breathIcon');

    if (circle) {
      circle.className = 'breath-circle ' + phase.circleClass;
    }
    if (label) label.textContent = phase.label;
    if (icon) {
      icon.className = 'fa-solid ' + phase.emoji;
    }

    // Pills
    PHASES.forEach((p, i) => {
      const pill = document.getElementById('step-' + p.key);
      if (pill) pill.classList.toggle('active', p.key === phase.key);
    });
  }

  function _setCountdown(secs) {
    const el = document.getElementById('breathCount');
    if (el) el.textContent = secs;
  }

  function _updateCycleDisplay() {
    const el = document.getElementById('breathCycles');
    if (el) el.textContent = _cycles;
  }

  function _onComplete() {
    _phase = 'idle';
    clearTimeout(_timer);
    clearInterval(_countInterval);

    const circle = document.getElementById('breathCircle');
    const label = document.getElementById('breathLabel');
    const count = document.getElementById('breathCount');
    const icon = document.getElementById('breathIcon');

    if (circle) circle.className = 'breath-circle breath-circle--done';
    if (label) label.textContent = 'Excellent ! Exercice terminé !';
    if (count) count.textContent = '';
    if (icon) icon.className = 'fa-solid fa-circle-check';

    Utils.addStars(15);
    Utils.earnBadge('breathing_done');
    Utils.logJournal('fa-wind', '5 cycles de respiration complets !');
    Utils.fireConfetti();

    // Réinitialiser pour une prochaine session
    setTimeout(() => {
      State.set('breathCycles', 0);
      _cycles = 0;
      _phase = 'idle';
      _updateCycleDisplay();
      if (circle) circle.className = 'breath-circle';
      if (label) label.textContent = 'Clique pour commencer !';
      if (icon) icon.className = 'fa-solid fa-play';
      PHASES.forEach(p => {
        const pill = document.getElementById('step-' + p.key);
        if (pill) pill.classList.remove('active');
      });
    }, 4000);
  }

  function stop() {
    clearTimeout(_timer);
    clearInterval(_countInterval);
    _phase = 'idle';
    stopMusic();
  }

  return { init, start, stop, toggleMusic };

})();
