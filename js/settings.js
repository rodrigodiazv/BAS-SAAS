// BAS-SAAS - Settings Management
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.requireAuth()) return;

  const user = auth.getCurrentUser();
  loadUserInfo(user);
  loadProfileSettings(user);
  loadNotificationSettings();

  // Event listeners
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.logout();
    window.location.href = 'index.html';
  });

  document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
  document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);
  document.getElementById('saveNotifications').addEventListener('click', handleNotificationsSave);
  document.getElementById('exportDataBtn').addEventListener('click', handleExportData);
  document.getElementById('deleteAccountBtn').addEventListener('click', handleDeleteAccount);
});

function loadUserInfo(user) {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

function loadProfileSettings(user) {
  document.getElementById('profileName').value = user.name;
  document.getElementById('profileEmail').value = user.email;
}

function loadNotificationSettings() {
  const settings = JSON.parse(localStorage.getItem('bas_notification_settings')) || {
    emailNotifications: true,
    marketingEmails: false,
    weeklyReports: true
  };

  document.getElementById('emailNotifications').checked = settings.emailNotifications;
  document.getElementById('marketingEmails').checked = settings.marketingEmails;
  document.getElementById('weeklyReports').checked = settings.weeklyReports;
}

function handleProfileUpdate(e) {
  e.preventDefault();
  
  const name = document.getElementById('profileName').value;
  const email = document.getElementById('profileEmail').value;

  // Update user in storage
  let users = JSON.parse(localStorage.getItem('bas_users'));
  const userIndex = users.findIndex(u => u.id === auth.getCurrentUser().id);
  
  if (userIndex !== -1) {
    users[userIndex].name = name;
    users[userIndex].email = email;
    localStorage.setItem('bas_users', JSON.stringify(users));
    
    // Update session
    const sessionUser = { ...users[userIndex] };
    delete sessionUser.password;
    localStorage.setItem('bas_session', JSON.stringify(sessionUser));
    
    showNotification('Perfil actualizado correctamente', 'success');
    
    // Reload page to reflect changes
    setTimeout(() => window.location.reload(), 1500);
  }
}

function handlePasswordChange(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validate current password
  const users = JSON.parse(localStorage.getItem('bas_users'));
  const user = users.find(u => u.id === auth.getCurrentUser().id);
  
  if (user.password !== currentPassword) {
    showNotification('Contraseña actual incorrecta', 'error');
    return;
  }

  if (newPassword !== confirmPassword) {
    showNotification('Las contraseñas no coinciden', 'error');
    return;
  }

  if (newPassword.length < 6) {
    showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }

  // Update password
  const userIndex = users.findIndex(u => u.id === auth.getCurrentUser().id);
  users[userIndex].password = newPassword;
  localStorage.setItem('bas_users', JSON.stringify(users));
  
  showNotification('Contraseña actualizada correctamente', 'success');
  
  // Clear form
  document.getElementById('passwordForm').reset();
}

function handleNotificationsSave() {
  const settings = {
    emailNotifications: document.getElementById('emailNotifications').checked,
    marketingEmails: document.getElementById('marketingEmails').checked,
    weeklyReports: document.getElementById('weeklyReports').checked
  };

  localStorage.setItem('bas_notification_settings', JSON.stringify(settings));
  showNotification('Preferencias de notificaciones guardadas', 'success');
}

function handleExportData() {
  const user = auth.getCurrentUser();
  const users = JSON.parse(localStorage.getItem('bas_users'));
  const fullUser = users.find(u => u.id === user.id);
  
  const data = {
    profile: fullUser,
    payments: JSON.parse(localStorage.getItem('bas_payments')) || [],
    notificationSettings: JSON.parse(localStorage.getItem('bas_notification_settings')) || {}
  };

  // Create downloadable JSON
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `bas-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Datos exportados correctamente', 'success');
}

function handleDeleteAccount() {
  const confirmation = prompt('⚠️ ATENCIÓN: Esta acción es IRREVERSIBLE.\n\nSe eliminarán todos tus datos permanentemente.\n\nEscribe "ELIMINAR" para confirmar:');
  
  if (confirmation !== 'ELIMINAR') {
    showNotification('Eliminación cancelada', 'info');
    return;
  }

  // Remove user from storage
  let users = JSON.parse(localStorage.getItem('bas_users'));
  users = users.filter(u => u.id !== auth.getCurrentUser().id);
  localStorage.setItem('bas_users', JSON.stringify(users));
  
  // Logout and redirect
  auth.logout();
  showNotification('Cuenta eliminada', 'success');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
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
