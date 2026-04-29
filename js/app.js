/* =============================================================
   APP.JS — Initialisation, navigation, session Supabase
============================================================= */

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

// ── ACTIONS GLOBALES (déconnexion, reset) ─────────────────
const App = {

  // ── RECONNAISSANCE VOCALE ─────────────────────────────────
  showApiKeyModal() {
    const m = document.getElementById('apiKeyModal');
    if (m) { m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); }
    const input = document.getElementById('apiKeyInput');
    if (input) input.value = Utils.getApiKey();
    setTimeout(() => { if (input) input.focus(); }, 100);
  },

  hideApiKeyModal() {
    const m = document.getElementById('apiKeyModal');
    if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); }
  },

  saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input ? input.value.trim() : '';
    if (!key) { Utils.showToast('Clé API vide.', 'info'); return; }
    Utils.setApiKey(key);
    App.hideApiKeyModal();
    const banner = document.getElementById('apiKeyBanner');
    if (banner) banner.style.display = 'none';
    Utils.showToast('Reconnaissance vocale activée !', 'success');
  },

  async logout() {
    const isGuest = localStorage.getItem('articule_active_user') === 'guest';
    if (!isGuest) {
      await DB.auth.signOut();
    }
    localStorage.removeItem('articule_active_user');
    window.location.href = 'login.html';
  },

  showResetConfirm() {
    const m = document.getElementById('resetConfirmModal');
    if (m) { m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); }
  },

  hideResetConfirm() {
    const m = document.getElementById('resetConfirmModal');
    if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); }
  },

  async confirmReset() {
    App.hideResetConfirm();
    State.reset();

    // Réinitialiser aussi dans Supabase
    try {
      const { data: { session } } = await DB.auth.getSession();
      if (session) {
        const uid = session.user.id;
        await DB.from('progress').update({
          stars: 0, breath_cycles: 0,
          completed_phonemes: [], syllables_viewed: [],
          words_viewed: [], earned_badges: [], quiz_history: [],
          updated_at: new Date().toISOString()
        }).eq('user_id', uid);
        await DB.from('journal').delete().eq('user_id', uid);
      }
    } catch(e) { console.warn('Reset DB :', e); }

    Sons.init();
    Labiale.init();
    Quiz.init();
    Respiration.init();
    Utils.updateProgressUI();
    Recompenses.refresh();
    Utils.showToast('Session réinitialisée.', 'info');
  }
};

// ── INITIALISATION ────────────────────────────────────────
window.addEventListener('load', async () => {

  // Masquer l'app pendant le chargement
  const wrapper = document.getElementById('mainAppWrapper');
  if (wrapper) wrapper.style.opacity = '0';

  const isGuest = localStorage.getItem('articule_active_user') === 'guest';
  const { data: { session } } = await DB.auth.getSession();

  // Rediriger si pas de session ET pas invité
  if (!session && !isGuest) {
    window.location.href = 'login.html';
    return;
  }

  // Marquer le mode invité dans State
  State.setGuestMode(isGuest || !session);

  if (session) {
    // Charger la progression depuis Supabase
    await State.loadFromSupabase();

    // Récupérer le prénom
    const { data: profile } = await DB
      .from('profiles')
      .select('prenom')
      .eq('id', session.user.id)
      .single();

    const prenom = profile?.prenom || session.user.email;

    const pill     = document.getElementById('userPill');
    const pillName = document.getElementById('userPillName');
    if (pill)     pill.style.display = 'flex';
    if (pillName) pillName.textContent = prenom;

    const greet = document.getElementById('appGreetingText');
    if (greet) greet.textContent = 'Bonjour ' + prenom + ', prêt(e) à jouer !';

    // Toast de bienvenue à la première connexion
    const welcomeFlag = sessionStorage.getItem('welcome_msg');
    if (welcomeFlag) {
      sessionStorage.removeItem('welcome_msg');
      const msg = welcomeFlag === 'inscription'
        ? 'Bienvenue ' + prenom + ' ! Ton compte est créé.'
        : 'Bienvenue, ' + prenom + ' !';
      setTimeout(() => Utils.showToast(msg, 'success'), 400);
    }

  } else {
    // Invité
    const pill     = document.getElementById('userPill');
    const pillName = document.getElementById('userPillName');
    if (pill)     pill.style.display = 'flex';
    if (pillName) pillName.textContent = 'Invité';

    const greet = document.getElementById('appGreetingText');
    if (greet) greet.textContent = "Bonjour, invité(e) ! Prêt(e) à jouer ?";
  }

  // Bannière si la reconnaissance vocale n'est pas configurée
  if (!Utils.getApiKey()) {
    const banner = document.getElementById('apiKeyBanner');
    if (banner) banner.style.display = 'flex';
  }

  // Initialiser les modules
  Sons.init();
  Respiration.init();
  Labiale.init();
  Quiz.init();
  Recompenses.init();
  Utils.updateProgressUI();

  _activateTab('sons');

  // Bouton déconnexion
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', App.logout);

  // Afficher l'app
  if (wrapper) {
    wrapper.style.transition = 'opacity 0.35s ease';
    wrapper.style.opacity    = '1';
  }
});

// ── NAVIGATION PAR ONGLETS ────────────────────────────────
function switchTab(tabId, btn) {
  document.querySelectorAll('.screen').forEach(s   => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b  => b.classList.remove('active'));
  const screen = document.getElementById('screen-' + tabId);
  if (screen) screen.classList.add('active');
  if (btn)    btn.classList.add('active');
  switch (tabId) {
    case 'recompenses': Recompenses.refresh(); break;
    case 'respiration': Respiration.init();    break;
  }
}

function _activateTab(tabId) {
  const btn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
  switchTab(tabId, btn);
}

// ── RACCOURCIS CLAVIER ────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const phoneme = document.getElementById('phonemeModal');
  if (phoneme && phoneme.classList.contains('open')) Sons.closePhonemePanel();
  const reset = document.getElementById('resetConfirmModal');
  if (reset && reset.classList.contains('open')) App.hideResetConfirm();
  const apiKey = document.getElementById('apiKeyModal');
  if (apiKey && apiKey.classList.contains('open')) App.hideApiKeyModal();
});

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('phonemeModal');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) Sons.closePhonemePanel(); });
  const resetOverlay = document.getElementById('resetConfirmModal');
  if (resetOverlay) resetOverlay.addEventListener('click', e => { if (e.target === resetOverlay) App.hideResetConfirm(); });
  const apiKeyOverlay = document.getElementById('apiKeyModal');
  if (apiKeyOverlay) apiKeyOverlay.addEventListener('click', e => { if (e.target === apiKeyOverlay) App.hideApiKeyModal(); });
});
