/* =============================================================
   QUIZ.JS — Module quiz avec navigation avant/arrière
============================================================= */

const Quiz = (() => {

  let _index = 0;
  let _score = 0;
  let _history = [];   // [{index, selected, correct}]
  let _answered = false;

  // ── INIT ─────────────────────────────────────────────────
  function init() {
    _index   = 0;
    _score   = 0;
    _history = [];
    _answered = false;
    _renderQuestion();
  }

  // ── RENDU ─────────────────────────────────────────────────
  function _renderQuestion() {
    if (_index >= QUIZ_DATA.length) {
      _renderEnd();
      return;
    }

    const q = QUIZ_DATA[_index];
    const pastEntry = _history.find(h => h.index === _index);
    _answered = !!pastEntry;

    // Diagramme (si disponible)
    const imgEl = document.getElementById('qImg');
    if (imgEl) {
      if (q.img) {
        imgEl.innerHTML = Sons.getMouthSVG(q.img);
        imgEl.style.display = 'block';
      } else {
        imgEl.innerHTML = '';
        imgEl.style.display = 'none';
      }
    }

    document.getElementById('qNum').textContent   = _index + 1;
    document.getElementById('qTotal').textContent = QUIZ_DATA.length;
    document.getElementById('qScore').textContent = _score;
    document.getElementById('qText').textContent  = q.q;

    // Navigation
    document.getElementById('prevBtn').disabled = (_index === 0);

    // Options
    const optsEl = document.getElementById('qOptions');
    optsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.setAttribute('aria-label', opt);
      btn.textContent = opt;

      if (_answered) {
        // Afficher résultats en lecture seule
        if (i === q.correct) btn.classList.add('quiz-option--correct');
        if (pastEntry && i === pastEntry.selected && i !== q.correct) btn.classList.add('quiz-option--wrong');
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => _answer(i));
      }
      optsEl.appendChild(btn);
    });

    // Feedback
    const fb = document.getElementById('qFeedback');
    if (_answered && pastEntry) {
      fb.textContent = pastEntry.correct ? q.explanation : 'La bonne reponse est en vert ci-dessus.';
      fb.className = 'quiz-feedback quiz-feedback--' + (pastEntry.correct ? 'good' : 'bad') + ' show';
    } else {
      fb.className = 'quiz-feedback';
      fb.textContent = '';
    }

    // Bouton suivant
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.className = 'btn-primary' + (_answered ? '' : ' btn--hidden');
    nextBtn.textContent = _index === QUIZ_DATA.length - 1 ? 'Voir les resultats' : 'Question suivante';
  }

  // ── RÉPONDRE ─────────────────────────────────────────────
  function _answer(selected) {
    if (_answered) return;
    _answered = true;

    const q = QUIZ_DATA[_index];
    const correct = (selected === q.correct);

    if (correct) {
      _score++;
      Utils.addStars(20);
      Utils.fireConfetti();
    }

    // Mémoriser
    _history.push({ index: _index, selected, correct });

    // Colorer les options
    const btns = document.querySelectorAll('.quiz-option');
    btns[q.correct].classList.add('quiz-option--correct');
    if (!correct) btns[selected].classList.add('quiz-option--wrong');
    btns.forEach(b => b.disabled = true);

    // Feedback
    const fb = document.getElementById('qFeedback');
    fb.textContent = correct ? q.explanation : 'La bonne reponse est en vert ci-dessus.';
    fb.className = 'quiz-feedback quiz-feedback--' + (correct ? 'good' : 'bad') + ' show';

    document.getElementById('qScore').textContent = _score;

    // Bouton suivant
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.className = 'btn-primary';
    nextBtn.textContent = _index === QUIZ_DATA.length - 1 ? 'Voir les resultats' : 'Question suivante';
  }

  // ── NAVIGATION ───────────────────────────────────────────
  function next() {
    if (_index < QUIZ_DATA.length - 1) {
      _index++;
      _renderQuestion();
    } else if (_answered) {
      _renderEnd();
    }
  }

  function prev() {
    if (_index > 0) {
      _index--;
      _renderQuestion();
    }
  }

  // ── FIN DU QUIZ ───────────────────────────────────────────
  function _renderEnd() {
    const pct = Math.round((_score / QUIZ_DATA.length) * 100);
    const msg = pct === 100 ? 'Parfait ! Tu es un champion !'
      : pct >= 75 ? 'Tres bien ! Continue comme ca !'
      : pct >= 50 ? 'Bon travail ! Tu peux t\'ameliorer !'
      : 'Continue a t\'entrainer, tu vas y arriver !';

    if (_score === QUIZ_DATA.length) Utils.earnBadge('quiz_perfect');
    Utils.earnBadge('quiz_done');
    Utils.logJournal('fa-trophy', 'Quiz termine : ' + _score + '/' + QUIZ_DATA.length);
    Utils.fireConfetti();

    const container = document.getElementById('quizContainer');
    container.innerHTML = `
      <div class="quiz-end">
        <div class="quiz-end__icon">
          <i class="fa-solid fa-trophy" aria-hidden="true"></i>
        </div>
        <h2 class="quiz-end__title">Quiz termine !</h2>
        <p class="quiz-end__score">
          <strong>${_score}</strong> / ${QUIZ_DATA.length} bonnes reponses
        </p>
        <p class="quiz-end__msg">${msg}</p>
        <div class="quiz-end__bar">
          <div class="quiz-end__bar-fill" style="width:${pct}%"></div>
        </div>
        <button class="btn-primary" onclick="Quiz.restart()" style="margin-top:24px;">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Recommencer
        </button>
      </div>
    `;
  }

  function restart() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = `
      <div class="quiz-score-bar">
        <span>Question <span id="qNum">1</span> / <span id="qTotal">${QUIZ_DATA.length}</span></span>
        <span>Score : <span id="qScore">0</span> <i class="fa-solid fa-check" aria-hidden="true"></i></span>
      </div>
      <div id="qImg" class="quiz-question-img" aria-hidden="true"></div>
      <p class="quiz-question-text" id="qText"></p>
      <div class="quiz-options" id="qOptions" role="group" aria-label="Choix de reponse"></div>
      <div class="quiz-feedback" id="qFeedback" aria-live="polite"></div>
      <div class="quiz-nav">
        <button class="btn-secondary" id="prevBtn" onclick="Quiz.prev()" disabled aria-label="Question precedente">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Precedente
        </button>
        <button class="btn-primary btn--hidden" id="nextBtn" onclick="Quiz.next()">
          Question suivante <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    `;
    init();
  }

  return { init, next, prev, restart };

})();
