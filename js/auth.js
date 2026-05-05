/* =============================================================
   AUTH.JS — Connexion / Inscription via Supabase Auth
============================================================= */

const Auth = {
  vLogin:       null,
  vRegister:    null,
  loginForm:    null,
  registerForm: null,
  alertBox:     null,

  init() {
    this.vLogin       = document.getElementById('viewLogin');
    this.vRegister    = document.getElementById('viewRegister');
    this.vAdmin       = document.getElementById('viewAdmin');
    this.loginForm    = document.getElementById('loginForm');
    this.registerForm = document.getElementById('registerForm');
    this.adminForm    = document.getElementById('adminLoginForm');
    this.alertBox     = document.getElementById('alertBox');

    if (this.loginForm)    this.loginForm.addEventListener('submit',    e => this.handleLogin(e));
    if (this.registerForm) this.registerForm.addEventListener('submit', e => this.handleRegister(e));
    if (this.adminForm)    this.adminForm.addEventListener('submit',    e => this.handleAdminLogin(e));
  },

  // ── Affichage d'erreur ────────────────────────────────────
  showError(msg) {
    if (!this.alertBox) return;
    this.alertBox.innerHTML   = '<i class="fa-solid fa-circle-exclamation"></i> ' + msg;
    this.alertBox.className   = 'login-alert';
    this.alertBox.style.display = 'flex';
    this.alertBox.style.animation = 'none';
    void this.alertBox.offsetWidth;
    this.alertBox.style.animation = 'shake 0.4s ease';
    clearTimeout(this._alertTimer);
    this._alertTimer = setTimeout(() => {
      if (this.alertBox) this.alertBox.style.display = 'none';
    }, 5000);
  },

  // ── Affichage de succès ───────────────────────────────────
  showSuccess(msg) {
    if (!this.alertBox) return;
    this.alertBox.innerHTML   = '<i class="fa-solid fa-circle-check"></i> ' + msg;
    this.alertBox.className   = 'login-alert login-alert--success';
    this.alertBox.style.display = 'flex';
    this.alertBox.style.animation = 'none';
    void this.alertBox.offsetWidth;
    this.alertBox.style.animation = 'fadeUp 0.35s ease';
  },

  showLogin() {
    this.vRegister.style.display = 'none';
    this.vAdmin.style.display    = 'none';
    this.vLogin.style.display    = 'block';
    if (this.alertBox) this.alertBox.style.display = 'none';
  },

  showRegister() {
    this.vLogin.style.display    = 'none';
    this.vAdmin.style.display    = 'none';
    this.vRegister.style.display = 'block';
    if (this.alertBox) this.alertBox.style.display = 'none';
  },

  showAdminLogin() {
    this.vLogin.style.display    = 'none';
    this.vRegister.style.display = 'none';
    this.vAdmin.style.display    = 'block';
    if (this.alertBox) this.alertBox.style.display = 'none';
  },

  _setLoading(on) {
    document.querySelectorAll('.btn-submit').forEach(b => {
      b.disabled      = on;
      b.style.opacity = on ? '0.65' : '1';
    });
  },

  // ── Connexion ─────────────────────────────────────────────
  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginUser').value.trim();
    const pass  = document.getElementById('loginPass').value;

    if (!email || !pass) return this.showError('Remplis tous les champs.');

    this._setLoading(true);
    const { error } = await DB.auth.signInWithPassword({ email, password: pass });
    this._setLoading(false);

    if (error) {
      this.showError('Email ou mot de passe incorrect.');
    } else {
      this.showSuccess('Connexion réussie !');
      sessionStorage.setItem('welcome_msg', 'connexion');
      setTimeout(() => { window.location.href = 'index.html'; }, 900);
    }
  },

  // ── Inscription ───────────────────────────────────────────
  async handleRegister(e) {
    e.preventDefault();
    const prenom = document.getElementById('regPrenom').value.trim();
    const email  = document.getElementById('regEmail').value.trim();
    const pass   = document.getElementById('regPass').value;
    const pass2  = document.getElementById('regPass2').value;

    if (prenom.length < 2)        return this.showError('Le prénom doit faire au moins 2 caractères.');
    if (!this._validEmail(email)) return this.showError('Adresse email invalide.');
    if (pass.length < 4)          return this.showError('Le mot de passe doit faire au moins 4 caractères.');
    if (pass !== pass2)           return this.showError('Les mots de passe ne correspondent pas.');

    this._setLoading(true);

    // 1. Créer le compte Supabase Auth
    const { data, error } = await DB.auth.signUp({ email, password: pass });

    if (error) {
      this._setLoading(false);
      if (error.message.toLowerCase().includes('already')) {
        return this.showError('Cette adresse email est déjà utilisée.');
      }
      return this.showError('Erreur : ' + error.message);
    }

    // 2. Insérer le profil avec le prénom
    if (data.user) {
      const { error: profErr } = await DB.from('profiles').insert({
        id:     data.user.id,
        prenom: prenom
      });
      if (profErr) console.warn('Profil non créé :', profErr.message);
    }

    this._setLoading(false);
    this.showSuccess('Compte créé avec succès !');
    sessionStorage.setItem('welcome_msg', 'inscription');
    setTimeout(() => { window.location.href = 'index.html'; }, 900);
  },

  // ── Connexion Admin ───────────────────────────────────────
  async handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminUser').value.trim();
    const pass  = document.getElementById('adminPass').value;

    if (!email || !pass) return this.showError('Remplis tous les champs.');

    this._setLoading(true);
    const { data, error } = await DB.auth.signInWithPassword({ email, password: pass });
    this._setLoading(false);

    if (error) {
      return this.showError('Email ou mot de passe incorrect.');
    }

    const uid = data?.user?.id;
    if (!uid) return this.showError('Erreur de connexion, réessaie.');

    const { data: adminRow } = await DB
      .from('admins')
      .select('user_id')
      .eq('user_id', uid)
      .single();

    if (!adminRow) {
      await DB.auth.signOut();
      return this.showError('Accès refusé. Ce compte n\'a pas les droits administrateur.');
    }

    this.showSuccess('Bienvenue, administrateur !');
    setTimeout(() => { window.location.href = 'admin.html'; }, 900);
  },

  // ── Mode invité (pas de compte) ───────────────────────────
  loginAsGuest() {
    localStorage.setItem('articule_active_user', 'guest');
    localStorage.removeItem('sonobulle_v2');
    window.location.href = 'index.html';
  },

  // ── Utilitaires ───────────────────────────────────────────
  togglePass(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) icon.className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  },

  checkPassMatch() {
    const p1  = document.getElementById('regPass');
    const p2  = document.getElementById('regPass2');
    const msg = document.getElementById('passMatchMsg');
    if (!p1 || !p2 || !msg) return;
    if (!p2.value) { msg.style.display = 'none'; return; }
    msg.style.display = 'flex';
    if (p1.value === p2.value) {
      msg.textContent = '✓ Les mots de passe correspondent';
      msg.className   = 'pass-match-msg ok';
    } else {
      msg.textContent = '✗ Les mots de passe ne correspondent pas';
      msg.className   = 'pass-match-msg bad';
    }
  },

  _validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
};

window.addEventListener('DOMContentLoaded', () => Auth.init());
