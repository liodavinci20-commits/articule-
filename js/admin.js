/* =============================================================
   ADMIN.JS — Tableau de bord administrateur
============================================================= */

window.addEventListener('load', async () => {
  const wrapper = document.getElementById('adminWrapper');
  if (wrapper) wrapper.style.opacity = '0';

  // 1. Vérifier la session
  const { data: { session } } = await DB.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  // 2. Vérifier que c'est bien un admin
  const { data: adminRow } = await DB
    .from('admins')
    .select('user_id')
    .eq('user_id', session.user.id)
    .single();

  if (!adminRow) {
    window.location.href = 'index.html';
    return;
  }

  // 3. Afficher l'email de l'admin connecté
  const adminEmailEl = document.getElementById('adminEmail');
  if (adminEmailEl) adminEmailEl.textContent = session.user.email;

  // 4. Charger les données (loadAdmins() est appelé à l'intérieur)
  await loadDashboard();

  if (wrapper) {
    wrapper.style.transition = 'opacity 0.3s ease';
    wrapper.style.opacity = '1';
  }
});

// ── CHARGEMENT PRINCIPAL ───────────────────────────────────
let _currentAdminIds = [];

async function loadDashboard() {
  showTableLoading(true);

  // Récupérer la liste des admins pour savoir qui l'est déjà
  const { data: admins } = await DB.rpc('get_all_admins');
  _currentAdminIds = (admins || []).map(a => a.user_id);

  const { data: users, error } = await DB.rpc('get_users_with_progress');

  if (error) {
    showError('Impossible de charger les données : ' + error.message);
    showTableLoading(false);
    return;
  }

  renderStats(users || []);
  renderTable(users || []);
  showTableLoading(false);
  await loadAdmins();
}

// ── STATS EN HAUT ──────────────────────────────────────────
function renderStats(users) {
  const totalEl   = document.getElementById('statTotal');
  const starsEl   = document.getElementById('statStars');
  const badgesEl  = document.getElementById('statBadges');

  const total      = users.length;
  const totalStars = users.reduce((s, u) => s + (u.stars || 0), 0);
  const totalBadges = users.reduce((s, u) => s + (u.earned_badges_count || 0), 0);

  if (totalEl)  totalEl.textContent  = total;
  if (starsEl)  starsEl.textContent  = totalStars;
  if (badgesEl) badgesEl.textContent = totalBadges;
}

// ── TABLEAU UTILISATEURS ───────────────────────────────────
function renderTable(users) {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" class="admin-table__empty">
        <i class="fa-solid fa-users-slash"></i> Aucun utilisateur inscrit pour l'instant.
      </td></tr>`;
    return;
  }

  users.forEach(u => {
    const totalItems   = 22 + 75 + 21; // phonèmes + syllabes + mots (approx)
    const done         = (u.completed_phonemes_count || 0)
                       + (u.syllables_viewed_count   || 0)
                       + (u.words_viewed_count       || 0);
    const pct          = Math.min(100, Math.round((done / totalItems) * 100));

    const dateStr = u.created_at
      ? new Date(u.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '—';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="admin-table__name">
        <i class="fa-solid fa-circle-user" aria-hidden="true"></i>
        ${escHtml(u.prenom || '—')}
      </td>
      <td class="admin-table__email">${escHtml(u.email || '—')}</td>
      <td class="admin-table__date">${dateStr}</td>
      <td class="admin-table__stars">
        <i class="fa-solid fa-star" style="color:var(--gold)"></i>
        ${u.stars || 0}
      </td>
      <td class="admin-table__badges">
        <i class="fa-solid fa-award" style="color:var(--plum)"></i>
        ${u.earned_badges_count || 0}
      </td>
      <td class="admin-table__progress">
        <div class="admin-progress-bar">
          <div class="admin-progress-fill" style="width:${pct}%"></div>
        </div>
        <span class="admin-progress-pct">${pct} %</span>
      </td>
      <td class="admin-table__actions">
        ${!_currentAdminIds.includes(u.user_id) ? `
        <button class="admin-btn-grant" onclick="grantAdmin('${u.user_id}', '${escHtml(u.prenom || u.email)}')"
                title="Nommer administrateur">
          <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
        </button>` : `
        <span class="admin-badge-admin" title="Déjà administrateur">
          <i class="fa-solid fa-shield-halved"></i> Admin
        </span>`}
        <button class="admin-btn-delete" onclick="confirmDelete('${u.user_id}', '${escHtml(u.prenom || u.email)}')"
                aria-label="Supprimer ${escHtml(u.prenom || '')}">
          <i class="fa-solid fa-trash" aria-hidden="true"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ── SUPPRESSION ────────────────────────────────────────────
function confirmDelete(userId, name) {
  const modal  = document.getElementById('deleteModal');
  const nameEl = document.getElementById('deleteTargetName');
  if (!modal) return;
  if (nameEl) nameEl.textContent = name;
  modal.dataset.targetId = userId;
  modal.classList.add('open');
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  if (modal) { modal.classList.remove('open'); delete modal.dataset.targetId; }
}

async function executeDelete() {
  const modal    = document.getElementById('deleteModal');
  const userId   = modal?.dataset.targetId;
  if (!userId) return;

  const btn = document.getElementById('confirmDeleteBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Suppression...'; }

  const { error } = await DB.rpc('delete_user_by_admin', { target_id: userId });

  if (btn) {
    btn.disabled    = false;
    btn.textContent = 'Supprimer';
  }

  closeDeleteModal();

  if (error) {
    showError('Erreur lors de la suppression : ' + error.message);
  } else {
    showToastAdmin('Utilisateur supprimé.', 'success');
    await loadDashboard();
  }
}

// ── GESTION DES ADMINS ────────────────────────────────────
async function loadAdmins() {
  const { data: admins, error } = await DB.rpc('get_all_admins');
  if (error || !admins) return;

  const { data: { session } } = await DB.auth.getSession();
  const myId = session?.user?.id;

  const container = document.getElementById('adminsList');
  if (!container) return;
  container.innerHTML = '';

  if (admins.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">Aucun administrateur trouvé.</p>';
    return;
  }

  admins.forEach(a => {
    const isMe = a.user_id === myId;
    const div  = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
      <div class="admin-item__info">
        <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
        ${escHtml(a.email)}
        ${isMe ? '<span class="admin-item__you">Vous</span>' : ''}
      </div>
      ${!isMe ? `<button class="admin-item__revoke" onclick="revokeAdmin('${a.user_id}', '${escHtml(a.email)}')">
        <i class="fa-solid fa-user-minus"></i> Retirer
      </button>` : ''}
    `;
    container.appendChild(div);
  });
}

async function grantAdmin(userId, name) {
  const { error } = await DB.rpc('grant_admin', { target_id: userId });
  if (error) {
    showError('Erreur : ' + error.message);
  } else {
    showToastAdmin(name + ' est maintenant administrateur.', 'success');
    await loadDashboard();
  }
}

async function revokeAdmin(userId, email) {
  const { error } = await DB.rpc('revoke_admin', { target_id: userId });
  if (error) {
    showError('Erreur : ' + error.message);
  } else {
    showToastAdmin('Droits admin retirés à ' + email + '.', 'success');
    await loadDashboard();
  }
}

// ── DÉCONNEXION ADMIN ──────────────────────────────────────
async function adminLogout() {
  await DB.auth.signOut();
  window.location.href = 'login.html';
}

// ── HELPERS ────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showTableLoading(on) {
  const spinner = document.getElementById('tableSpinner');
  const table   = document.getElementById('usersTable');
  if (spinner) spinner.style.display = on ? 'flex' : 'none';
  if (table)   table.style.display   = on ? 'none' : 'table';
}

function showError(msg) {
  const el = document.getElementById('adminError');
  if (!el) return;
  el.textContent  = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function showToastAdmin(msg, type) {
  const el = document.getElementById('adminToast');
  if (!el) return;
  el.textContent = msg;
  el.className   = 'admin-toast show admin-toast--' + type;
  setTimeout(() => el.classList.remove('show'), 3500);
}

// Fermer la modale en cliquant l'overlay
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('deleteModal');
  if (modal) modal.addEventListener('click', e => {
    if (e.target === modal) closeDeleteModal();
  });
});
