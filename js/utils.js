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

  // ── AUDIO PHONÈMES (fichiers MP3) ────────────────────────
  // Phonèmes couverts par un fichier audio — les autres tombent sur speak()
  const _PHONEME_AUDIO = {
    'v-a':  'sons%20ok/voyelles/a.mp3',
    'v-ei': 'sons%20ok/voyelles/%C3%A9.mp3',
    'v-i':  'sons%20ok/voyelles/i.mp3',
    'v-o':  'sons%20ok/voyelles/o.mp3',
    'v-u':  'sons%20ok/voyelles/u.mp3',
    'c-b':  'sons%20ok/consonnes/b.mp3',
    'c-ch': 'sons%20ok/consonnes/ch.mp3',
    'c-d':  'sons%20ok/consonnes/d.mp3',
    'c-f':  'sons%20ok/consonnes/f.mp3',
    'c-g':  'sons%20ok/consonnes/g.mp3',
    'c-j':  'sons%20ok/consonnes/j.mp3',
    'c-k':  'sons%20ok/consonnes/k.mp3',
    'c-l':  'sons%20ok/consonnes/l.mp3',
    'c-m':  'sons%20ok/consonnes/m.mp3',
    'c-mn': 'sons%20ok/consonnes/m.mp3',
    'c-n':  'sons%20ok/consonnes/n.mp3',
    'c-nn': 'sons%20ok/consonnes/n.mp3',
    'c-p':  'sons%20ok/consonnes/p.mp3',
    'c-r':  'sons%20ok/consonnes/r.mp3',
    'c-s':  'sons%20ok/consonnes/s.mp3',
    'c-t':  'sons%20ok/consonnes/t.mp3',
    'c-v':  'sons%20ok/consonnes/v.mp3',
    'c-z':  'sons%20ok/consonnes/z.mp3',
  };

  // ── AUDIO SYLLABES ET MOTS ────────────────────────────────
  const _BASE_SYL = 'syllabe%20et%20mots/syllabes/';
  const _BASE_MOT = 'syllabe%20et%20mots/mots/';

  const _LABIALE_AUDIO = {
    // B
    'syl-ba': _BASE_SYL+'ba.mp3',  'syl-be': _BASE_SYL+'bè.mp3',
    'syl-bi': _BASE_SYL+'bi.mp3',  'syl-bo': _BASE_SYL+'bo.mp3',  'syl-bu': _BASE_SYL+'bu.mp3',
    // P
    'syl-pa': _BASE_SYL+'pa.mp3',  'syl-pe': _BASE_SYL+'pè.mp3',
    'syl-pi': _BASE_SYL+'pi.mp3',  'syl-po': _BASE_SYL+'po.mp3',  'syl-pu': _BASE_SYL+'pu.mp3',
    // M
    'syl-ma': _BASE_SYL+'ma.mp3',  'syl-me': _BASE_SYL+'mè.mp3',
    'syl-mi': _BASE_SYL+'mi.mp3',  'syl-mo': _BASE_SYL+'mo.mp3',  'syl-mu': _BASE_SYL+'mu.mp3',
    // T
    'syl-ta': _BASE_SYL+'ta.mp3',  'syl-te': _BASE_SYL+'tè.mp3',
    'syl-ti': _BASE_SYL+'ti.mp3',  'syl-to': _BASE_SYL+'to.mp3',  'syl-tu': _BASE_SYL+'tu.mp3',
    // D
    'syl-da': _BASE_SYL+'da.mp3',  'syl-de': _BASE_SYL+'dè.mp3',
    'syl-di': _BASE_SYL+'di.mp3',  'syl-do': _BASE_SYL+'do.mp3',  'syl-du': _BASE_SYL+'du.mp3',
    // N
    'syl-na': _BASE_SYL+'na.mp3',  'syl-ne': _BASE_SYL+'nè.mp3',
    'syl-ni': _BASE_SYL+'ni.mp3',  'syl-no': _BASE_SYL+'no.mp3',  'syl-nu': _BASE_SYL+'nu.mp3',
    // K
    'syl-ka': _BASE_SYL+'ka.mp3',  'syl-ke': _BASE_SYL+'kè.mp3',
    'syl-ki': _BASE_SYL+'ki.mp3',  'syl-ko': _BASE_SYL+'ko.mp3',  'syl-ku': _BASE_SYL+'ku.mp3',
    // G
    'syl-ga': _BASE_SYL+'ga.mp3',  'syl-ge': _BASE_SYL+'gè.mp3',
    'syl-gi': _BASE_SYL+'gi.mp3',  'syl-go': _BASE_SYL+'go.mp3',  'syl-gu': _BASE_SYL+'gu.mp3',
    // F
    'syl-fa': _BASE_SYL+'fa.mp3',  'syl-fe': _BASE_SYL+'fè.mp3',
    'syl-fi': _BASE_SYL+'fi.mp3',  'syl-fo': _BASE_SYL+'fo.mp3',  'syl-fu': _BASE_SYL+'fu.mp3',
    // V
    'syl-va': _BASE_SYL+'va.mp3',  'syl-ve': _BASE_SYL+'vè.mp3',
    'syl-vi': _BASE_SYL+'vi.mp3',  'syl-vo': _BASE_SYL+'vo.mp3',  'syl-vu': _BASE_SYL+'vu.mp3',
    // S
    'syl-sa': _BASE_SYL+'sa.mp3',  'syl-se': _BASE_SYL+'sè.mp3',
    'syl-si': _BASE_SYL+'si.mp3',  'syl-so': _BASE_SYL+'so.mp3',  'syl-su': _BASE_SYL+'su.mp3',
    // Z
    'syl-za': _BASE_SYL+'za.mp3',  'syl-ze': _BASE_SYL+'zè.mp3',
    'syl-zi': _BASE_SYL+'zi.mp3',  'syl-zo': _BASE_SYL+'zo.mp3',  'syl-zu': _BASE_SYL+'zu.mp3',
    // CH
    'syl-cha': _BASE_SYL+'cha.mp3', 'syl-che': _BASE_SYL+'chè.mp3',
    'syl-chi': _BASE_SYL+'chi.mp3', 'syl-cho': _BASE_SYL+'cho.mp3', 'syl-chu': _BASE_SYL+'chu.mp3',
    // J
    'syl-ja': _BASE_SYL+'ja.mp3',  'syl-je': _BASE_SYL+'jè.mp3',
    'syl-ji': _BASE_SYL+'ji.mp3',  'syl-jo': _BASE_SYL+'jo.mp3',  'syl-ju': _BASE_SYL+'ju.mp3',
    // L
    'syl-la': _BASE_SYL+'la.mp3',  'syl-le': _BASE_SYL+'lè.mp3',
    'syl-li': _BASE_SYL+'li.mp3',  'syl-lo': _BASE_SYL+'lo.mp3',  'syl-lu': _BASE_SYL+'lu.mp3',
    // R
    'syl-ra': _BASE_SYL+'ra.mp3',  'syl-re': _BASE_SYL+'rè.mp3',
    'syl-ri': _BASE_SYL+'ri.mp3',  'syl-ro': _BASE_SYL+'ro.mp3',  'syl-ru': _BASE_SYL+'ru.mp3',
    // MOTS (papa, maman, manou, pain absents → TTS automatique)
    'mot-baba':    _BASE_MOT+'baba.mp3',
    'mot-dada':    _BASE_MOT+'dada.mp3',
    'mot-dudu':    _BASE_MOT+'dudu.mp3',
    'mot-fafa':    _BASE_MOT+'fafa.mp3',
    'mot-pipi':    _BASE_MOT+'pipi.mp3',
    'mot-nani':    _BASE_MOT+'nani.mp3',
    'mot-tata':    _BASE_MOT+'tata.mp3',
    'mot-dolo':    _BASE_MOT+'dolo.mp3',
    'mot-toto':    _BASE_MOT+'toto.mp3',
    'mot-tape':    _BASE_MOT+'tape.mp3',
    'mot-je':      _BASE_MOT+'je.mp3',
    'mot-bonne':   _BASE_MOT+'bonne.mp3',
    'mot-choux':   _BASE_MOT+'choux.mp3',
    'mot-bonjour': _BASE_MOT+'bonjour.mp3',
    'mot-merci':   _BASE_MOT+'merci.mp3',
    'mot-eau':     _BASE_MOT+'eau.mp3',
    'mot-chat':    _BASE_MOT+'chat.mp3',
    'mot-oui':     _BASE_MOT+'oui.mp3',
    'mot-non':     _BASE_MOT+'non.mp3',
    'mot-aide':    _BASE_MOT+'aide.mp3',
    'mot-ami':     _BASE_MOT+'ami.mp3',
  };

  let _currentAudio = null;

  // Joue le fichier MP3 du phonème si disponible, sinon TTS
  function playPhoneme(phonemeId, symbolFallback, onEnd) {
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio = null;
    }
    const src = _PHONEME_AUDIO[phonemeId];
    if (!src) {
      speak(symbolFallback, onEnd);
      return;
    }
    const audio = new Audio(src);
    _currentAudio = audio;
    audio.onended = () => { _currentAudio = null; if (onEnd) onEnd(); };
    audio.onerror = () => { _currentAudio = null; speak(symbolFallback, onEnd); };
    audio.play().catch(() => { _currentAudio = null; speak(symbolFallback, onEnd); });
  }

  // Joue le fichier MP3 de la syllabe/mot si disponible, sinon TTS
  function playLabiale(itemId, textFallback, onEnd) {
    if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }
    const src = _LABIALE_AUDIO[itemId];
    if (!src) { speak(textFallback, onEnd); return; }
    const audio = new Audio(src);
    _currentAudio = audio;
    audio.onended = () => { _currentAudio = null; if (onEnd) onEnd(); };
    audio.onerror = () => { _currentAudio = null; speak(textFallback, onEnd); };
    audio.play().catch(() => { _currentAudio = null; speak(textFallback, onEnd); });
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

    navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation:  false,
          noiseSuppression:  false,
          autoGainControl:   true,
          channelCount:      1
        },
        video: false
      })
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

          if (audioBlob.size < 100) {
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
    playPhoneme,
    playLabiale,
    getApiKey,
    setApiKey,
    speak,
    recognize
  };

})();
