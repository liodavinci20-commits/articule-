/* =============================================================
   STATE.JS — État local + synchronisation Supabase
============================================================= */

const STORAGE_KEY = 'sonobulle_v2';

const State = (() => {

  const _defaults = {
    stars:             0,
    progress:          0,
    completedPhonemes: [],
    breathCycles:      0,
    quizIndex:         0,
    quizScore:         0,
    quizHistory:       [],
    earnedBadges:      [],
    journal:           [],
    syllablesViewed:   [],
    wordsViewed:       []
  };

  let _data      = {};
  let _isGuest   = false;
  let _syncTimer = null;

  // ── localStorage (cache local) ────────────────────────────
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _data = raw ? { ..._defaults, ...JSON.parse(raw) } : { ..._defaults };
    } catch(e) {
      _data = { ..._defaults };
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); } catch(e) {}
  }

  function reset() {
    _data = { ..._defaults };
    save();
  }

  // ── Mode invité ───────────────────────────────────────────
  function setGuestMode(val) {
    _isGuest = !!val;
  }

  // ── Mapping Supabase ↔ état local ─────────────────────────
  function _fromDB(row) {
    return {
      stars:             row.stars              || 0,
      breathCycles:      row.breath_cycles       || 0,
      completedPhonemes: row.completed_phonemes  || [],
      syllablesViewed:   row.syllables_viewed    || [],
      wordsViewed:       row.words_viewed        || [],
      earnedBadges:      row.earned_badges       || [],
      quizHistory:       row.quiz_history         || []
    };
  }

  function _toDBRow() {
    return {
      stars:              _data.stars,
      breath_cycles:      _data.breathCycles,
      completed_phonemes: _data.completedPhonemes,
      syllables_viewed:   _data.syllablesViewed,
      words_viewed:       _data.wordsViewed,
      earned_badges:      _data.earnedBadges,
      quiz_history:       _data.quizHistory,
      updated_at:         new Date().toISOString()
    };
  }

  // ── Sync différé (1,5s après la dernière modif) ───────────
  function _scheduleSync() {
    if (_isGuest) return;
    clearTimeout(_syncTimer);
    _syncTimer = setTimeout(_syncToSupabase, 1500);
  }

  async function _syncToSupabase() {
    if (_isGuest) return;
    try {
      const { data: { session } } = await DB.auth.getSession();
      if (!session) return;
      await DB.from('progress')
        .update(_toDBRow())
        .eq('user_id', session.user.id);
    } catch(e) {
      console.warn('Sync Supabase :', e);
    }
  }

  // ── Insertion journal ─────────────────────────────────────
  async function _pushJournalEntry(entry) {
    if (_isGuest) return;
    try {
      const { data: { session } } = await DB.auth.getSession();
      if (!session) return;
      await DB.from('journal').insert({
        user_id: session.user.id,
        icon:    entry.icon,
        text:    entry.text
      });
    } catch(e) {
      console.warn('Journal Supabase :', e);
    }
  }

  // ── Chargement depuis Supabase ────────────────────────────
  async function loadFromSupabase() {
    try {
      const { data: { session } } = await DB.auth.getSession();
      if (!session) return false;

      const uid = session.user.id;

      // Progression
      const { data: prog } = await DB
        .from('progress')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (prog) {
        _data = { ..._defaults, ..._fromDB(prog) };
      }

      // Journal (50 dernières entrées)
      const { data: entries } = await DB
        .from('journal')
        .select('icon, text, created_at')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(50);

      if (entries) {
        _data.journal = entries.reverse().map(e => ({
          icon: e.icon,
          text: e.text,
          time: new Date(e.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(e.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
        }));
      }

      save();
      return true;
    } catch(e) {
      console.warn('Chargement Supabase :', e);
      return false;
    }
  }

  // ── Getters / Setters ─────────────────────────────────────
  function get(key) { return _data[key]; }

  function set(key, value) {
    _data[key] = value;
    save();
    _scheduleSync();
  }

  function push(key, value) {
    if (!Array.isArray(_data[key])) _data[key] = [];
    _data[key].push(value);
    save();
    if (key === 'journal') {
      _pushJournalEntry(value);
    } else {
      _scheduleSync();
    }
  }

  function has(key, value) {
    return Array.isArray(_data[key]) && _data[key].includes(value);
  }

  function computeProgress() {
    const totalPhonemes  = ALL_PHONEMES.length;
    const totalSyllables = SYLLABES_GROUPS.reduce((n, g) => n + g.items.length, 0);
    const totalWords     = MOTS.length;

    const done  = _data.completedPhonemes.length
                + _data.syllablesViewed.length
                + _data.wordsViewed.length
                + Math.min(_data.breathCycles, 5)
                + (_data.quizHistory.length > 0 ? 1 : 0);

    const total = totalPhonemes + totalSyllables + totalWords + 5 + 1;
    return Math.round((done / total) * 100);
  }

  load();

  return {
    get, set, push, has, save, load, reset, computeProgress,
    loadFromSupabase, setGuestMode
  };

})();
