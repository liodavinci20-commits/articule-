/* =============================================================
   STATE.JS — Gestion de l'état et persistance localStorage
============================================================= */

const STORAGE_KEY = 'sonobulle_v2';

const State = (() => {

  // État initial
  const _defaults = {
    stars: 0,
    progress: 0,
    completedPhonemes: [],   // ids des phonèmes pratiqués
    breathCycles: 0,
    quizIndex: 0,
    quizScore: 0,
    quizHistory: [],         // [{index, selected, correct}]
    earnedBadges: [],
    journal: [],
    syllablesViewed: [],     // ids des syllabes vues
    wordsViewed: []          // ids des mots vus
  };

  let _data = {};

  // ── Charger depuis localStorage ───────────────────────────
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _data = raw ? { ..._defaults, ...JSON.parse(raw) } : { ..._defaults };
    } catch(e) {
      _data = { ..._defaults };
    }
  }

  // ── Sauvegarder dans localStorage ────────────────────────
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
    } catch(e) {
      console.warn('Impossible de sauvegarder l\'état :', e);
    }
  }

  // ── Réinitialiser ─────────────────────────────────────────
  function reset() {
    _data = { ..._defaults };
    save();
  }

  // ── Getters / Setters ─────────────────────────────────────
  function get(key) {
    return _data[key];
  }

  function set(key, value) {
    _data[key] = value;
    save();
  }

  function push(key, value) {
    if (!Array.isArray(_data[key])) _data[key] = [];
    _data[key].push(value);
    save();
  }

  function has(key, value) {
    return Array.isArray(_data[key]) && _data[key].includes(value);
  }

  // ── Calcul du progrès global ──────────────────────────────
  function computeProgress() {
    const totalPhonemes = ALL_PHONEMES.length;
    const totalSyllables = SYLLABES_GROUPS.reduce((n, g) => n + g.items.length, 0);
    const totalWords = MOTS.length;

    const donePhonemes = _data.completedPhonemes.length;
    const doneSyllables = _data.syllablesViewed.length;
    const doneWords = _data.wordsViewed.length;
    const doneBreath = Math.min(_data.breathCycles, 5);
    const doneQuiz = _data.quizHistory.length > 0 ? 1 : 0;

    const total = totalPhonemes + totalSyllables + totalWords + 5 + 1;
    const done  = donePhonemes + doneSyllables + doneWords + doneBreath + doneQuiz;

    return Math.round((done / total) * 100);
  }

  // Initialiser dès le chargement du script
  load();

  return { get, set, push, has, save, load, reset, computeProgress };

})();
