// BAS-SAAS - Users Management
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.requireAuth()) return;

  const user = auth.getCurrentUser();
  loadUserInfo(user);

  // Generate extended user data if not exists
  if (!localStorage.getItem('bas_users_extended')) {
    generateExtendedUsers();
  }

  loadUserStats();
  loadUsersTable();

  // Event listeners
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.logout();
    window.location.href = 'index.html';
  });

  document.getElementById('searchUsers').addEventListener('input', filterUsers);
  document.getElementById('planFilter').addEventListener('change', filterUsers);
  document.getElementById('statusFilter').addEventListener('change', filterUsers);
  document.getElementById('addUserBtn').addEventListener('click', () => alert('Función en desarrollo'));
  document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
  document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
  document.getElementById('editUserForm').addEventListener('submit', handleEditUser);
});

function generateExtendedUsers() {
  const users = JSON.parse(localStorage.getItem('bas_users'));
  const extended = users.map(u => ({
    ...u,
    lastAccess: randomDate(new Date(2024, 0, 1), new Date()),
    status: Math.random() > 0.2 ? 'active' : 'inactive',
    usage: Math.floor(Math.random() * 100)
  }));

  // Add more demo users
  const demoUsers = [
    { name: 'Sarah Johnson', email: 'sarah@startup.io', plan: 'pro', role: 'user' },
    { name: 'Mike Chen', email: 'mike@tech.com', plan: 'enterprise', role: 'user' },
    { name: 'Emma Wilson', email: 'emma@design.co', plan: 'starter', role: 'user' },
    { name: 'John Doe', email: 'john@company.com', plan: 'free', role: 'user' },
    { name: 'Lisa Anderson', email: 'lisa@agency.net', plan: 'pro', role: 'user' },
    { name: 'David Kim', email: 'david@dev.io', plan: 'starter', role: 'user' },
    { name: 'Anna Brown', email: 'anna@marketing.com', plan: 'enterprise', role: 'user' },
    { name: 'Tom Harris', email: 'tom@shop.com', plan: 'free', role: 'user' }
  ];

  demoUsers.forEach((u, i) => {
    extended.push({
      id: extended.length + 1,
      ...u,
      password: 'demo123',
      createdAt: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
      lastAccess: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      usage: Math.floor(Math.random() * 100)
    });
  });

  localStorage.setItem('bas_users_extended', JSON.stringify(extended));
  localStorage.setItem('bas_users', JSON.stringify(extended));
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function loadUserInfo(user) {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

function loadUserStats() {
  const users = JSON.parse(localStorage.getItem('bas_users_extended'));
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const today = new Date(now.setHours(0, 0, 0, 0));

  const totalUsers = users.length;
  const activeToday = users.filter(u => new Date(u.lastAccess) >= today).length;
  const new30d = users.filter(u => new Date(u.createdAt) >= thirtyDaysAgo).length;
  const paidUsers = users.filter(u => u.plan !== 'free').length;
  const conversionRate = ((paidUsers / totalUsers) * 100).toFixed(1);

  document.getElementById('totalUsers').textContent = totalUsers;
  document.getElementById('activeToday').textContent = activeToday;
  document.getElementById('new30d').textContent = new30d;
  document.getElementById('conversionRate').textContent = conversionRate + '%';
}

function loadUsersTable() {
  const users = JSON.parse(localStorage.getItem('bas_users_extended'));
  renderUsersTable(users);
}

function renderUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = users.map(user => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="user-avatar-small">${user.name.charAt(0).toUpperCase()}</div>
          <strong>${user.name}</strong>
        </div>
      </td>
      <td>${user.email}</td>
      <td><span class="plan-badge plan-${user.plan}">${user.plan}</span></td>
      <td>${formatDate(user.createdAt)}</td>
      <td>${formatRelativeTime(user.lastAccess)}</td>
      <td><span class="status-badge status-${user.status}">${user.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon" onclick="editUser(${user.id})" title="Editar">✏️</button>
          <button class="btn-icon" onclick="deleteUser(${user.id})" title="Eliminar">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterUsers() {
  const search = document.getElementById('searchUsers').value.toLowerCase();
  const planFilter = document.getElementById('planFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;

  let users = JSON.parse(localStorage.getItem('bas_users_extended'));

  if (search) {
    users = users.filter(u => 
      u.name.toLowerCase().includes(search) || 
      u.email.toLowerCase().includes(search)
    );
  }

  if (planFilter !== 'all') {
    users = users.filter(u => u.plan === planFilter);
  }

  if (statusFilter !== 'all') {
    users = users.filter(u => u.status === statusFilter);
  }

  renderUsersTable(users);
}

function editUser(userId) {
  const users = JSON.parse(localStorage.getItem('bas_users_extended'));
  const user = users.find(u => u.id === userId);
  
  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUserName').value = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserPlan').value = user.plan;
  document.getElementById('editUserRole').value = user.role;
  
  document.getElementById('editUserModal').classList.add('active');
}

function closeEditModal() {
  document.getElementById('editUserModal').classList.remove('active');
}

function handleEditUser(e) {
  e.preventDefault();
  
  const userId = parseInt(document.getElementById('editUserId').value);
  const name = document.getElementById('editUserName').value;
  const email = document.getElementById('editUserEmail').value;
  const plan = document.getElementById('editUserPlan').value;
  const role = document.getElementById('editUserRole').value;

  let users = JSON.parse(localStorage.getItem('bas_users_extended'));
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], name, email, plan, role };
    localStorage.setItem('bas_users_extended', JSON.stringify(users));
    localStorage.setItem('bas_users', JSON.stringify(users));
    
    loadUsersTable();
    closeEditModal();
    showNotification('Usuario actualizado correctamente', 'success');
  }
}

function deleteUser(userId) {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
  
  let users = JSON.parse(localStorage.getItem('bas_users_extended'));
  users = users.filter(u => u.id !== userId);
  
  localStorage.setItem('bas_users_extended', JSON.stringify(users));
  localStorage.setItem('bas_users', JSON.stringify(users));
  
  loadUsersTable();
  loadUserStats();
  showNotification('Usuario eliminado', 'success');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  return formatDate(dateString);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Make functions global for inline onclick
window.editUser = editUser;
window.deleteUser = deleteUser;
