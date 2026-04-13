/* =============================================================
   APP.JS — Point d'entrée, navigation, initialisation
============================================================= */

// Attendre que toutes les voix TTS soient chargées
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

window.addEventListener('load', () => {
  // Initialiser tous les modules
  Sons.init();
  Respiration.init();
  Labiale.init();
  Quiz.init();
  Recompenses.init();
  Utils.updateProgressUI();

  // Avertissement navigateur
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    const banner = document.getElementById('browserBanner');
    if (banner) banner.style.display = 'flex';
  }

  // Onglet actif par défaut
  _activateTab('sons');

  // Vérification de la session
  const activeUser = localStorage.getItem('articule_active_user');
  
  if (!activeUser) {
    window.location.href = 'login.html';
    return;
  }
  
  // Personnalisation de l'accueil
  const appGreetingText = document.getElementById('appGreetingText');
  if (appGreetingText) {
    if (activeUser === 'guest') {
      appGreetingText.textContent = `Bonjour, invité(e) ! Prêt(e) à jouer ?`;
    } else {
      appGreetingText.textContent = `Bonjour ${activeUser}, prêt(e) à jouer ?`;
    }
  }

  // Déconnexion
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('articule_active_user');
      window.location.href = 'login.html';
    });
  }
});

// ── NAVIGATION PAR ONGLETS ────────────────────────────────
function switchTab(tabId, btn) {
  // Cacher tous les écrans
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Désactiver tous les boutons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Activer l'écran et le bouton cibles
  const screen = document.getElementById('screen-' + tabId);
  if (screen) screen.classList.add('active');
  if (btn) btn.classList.add('active');

  // Actions spécifiques à chaque onglet
  switch (tabId) {
    case 'recompenses':
      Recompenses.refresh();
      break;
    case 'respiration':
      Respiration.init();
      break;
  }
}

function _activateTab(tabId) {
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  switchTab(tabId, btn);
}

// ── RACCOURCIS CLAVIER ────────────────────────────────────
document.addEventListener('keydown', (e) => {
  // Fermer la modale avec Escape
  if (e.key === 'Escape') {
    const modal = document.getElementById('phonemeModal');
    if (modal && modal.classList.contains('open')) {
      Sons.closePhonemePanel();
    }
  }
});

// ── FERMETURE MODALE AU CLIC SUR L'OVERLAY ───────────────
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('phonemeModal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) Sons.closePhonemePanel();
    });
  }
});
