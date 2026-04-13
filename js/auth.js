/* =============================================================
   AUTH.JS — Logique de connexion et d'inscription
============================================================= */

const Auth = {
  // Elements DOM
  vLogin: null,
  vRegister: null,
  loginForm: null,
  registerForm: null,
  alertBox: null,

  init() {
    this.vLogin = document.getElementById('viewLogin');
    this.vRegister = document.getElementById('viewRegister');
    this.loginForm = document.getElementById('loginForm');
    this.registerForm = document.getElementById('registerForm');
    this.alertBox = document.getElementById('alertBox');

    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    
    if (this.registerForm) {
      this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Initialize mock DB
    if (!localStorage.getItem('articule_users_db')) {
      localStorage.setItem('articule_users_db', JSON.stringify([]));
    }
  },

  showError(msg) {
    this.alertBox.style.display = 'block';
    this.alertBox.textContent = msg;
    setTimeout(() => this.alertBox.style.display = 'none', 3000);
  },

  showLogin() {
    this.vRegister.style.display = 'none';
    this.vLogin.style.display = 'block';
  },

  showRegister() {
    this.vLogin.style.display = 'none';
    this.vRegister.style.display = 'block';
  },

  handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;

    const db = JSON.parse(localStorage.getItem('articule_users_db') || '[]');
    const found = db.find(u => u.username.toLowerCase() === user.toLowerCase() && u.password === pass);

    if (found) {
      localStorage.setItem('articule_active_user', found.username);
      window.location.href = 'index.html';
    } else {
      this.showError('Identifiants incorrects');
    }
  },

  handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;

    if (user.length < 3) {
      return this.showError('Le nom doit faire au moins 3 caractères');
    }

    const db = JSON.parse(localStorage.getItem('articule_users_db') || '[]');
    
    // Check if user exists
    if (db.some(u => u.username.toLowerCase() === user.toLowerCase())) {
      return this.showError('Ce nom est déjà utilisé');
    }

    db.push({ username: user, password: pass });
    localStorage.setItem('articule_users_db', JSON.stringify(db));
    
    // Auto-login after register
    localStorage.setItem('articule_active_user', user);
    window.location.href = 'index.html';
  },

  loginAsGuest() {
    localStorage.setItem('articule_active_user', 'guest');
    window.location.href = 'index.html';
  }
};

window.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
