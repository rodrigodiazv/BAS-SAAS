// BAS-SAAS - Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación
  if (!auth.requireAuth()) return;

  const user = auth.getCurrentUser();
  const analytics = dataGen.getAnalytics();
  const subscriptions = dataGen.getSubscriptions();
  const activity = dataGen.getActivity();

  // Cargar info de usuario
  loadUserInfo(user);

  // Cargar estadísticas
  loadStats(analytics.overview);

  // Cargar gráficos
  loadRevenueChart(analytics.revenue);
  loadUsersChart(analytics.users);

  // Cargar tablas
  loadSubscriptions(subscriptions);
  loadActivity(activity);

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.logout();
    window.location.href = 'index.html';
  });
});

function loadUserInfo(user) {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

function loadStats(overview) {
  document.getElementById('statRevenue').textContent = `$${overview.totalRevenue.toLocaleString()}`;
  document.getElementById('statUsers').textContent = overview.activeUsers.toLocaleString();
  document.getElementById('statMRR').textContent = `$${overview.mrr.toLocaleString()}`;
  document.getElementById('statChurn').textContent = `${overview.churnRate}%`;
}

function loadRevenueChart(data) {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.month),
      datasets: [
        {
          label: 'Ingresos',
          data: data.map(d => d.revenue),
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'MRR',
          data: data.map(d => d.mrr),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => '$' + value
          }
        }
      }
    }
  });
}

function loadUsersChart(data) {
  const ctx = document.getElementById('usersChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.month),
      datasets: [{
        label: 'Usuarios',
        data: data.map(d => d.users),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function loadSubscriptions(plans) {
  const container = document.getElementById('subscriptionsList');
  container.innerHTML = plans.map(plan => `
    <div class="subscription-item">
      <div class="subscription-info">
        <div class="subscription-color" style="background: ${plan.color}"></div>
        <div class="subscription-name">${plan.name}</div>
      </div>
      <div class="subscription-stats">
        <span>${plan.users} usuarios</span>
        <span>$${plan.price}/mes</span>
      </div>
    </div>
  `).join('');
}

function loadActivity(activities) {
  const container = document.getElementById('activityList');
  container.innerHTML = activities.map(act => {
    let description = '';
    switch (act.type) {
      case 'signup':
        description = `${act.user} se registró`;
        break;
      case 'upgrade':
        description = `${act.user} actualizó a ${act.plan}`;
        break;
      case 'payment':
        description = `${act.user} pagó ${act.amount}`;
        break;
      case 'cancel':
        description = `${act.user} canceló su suscripción`;
        break;
    }
    return `
      <div class="activity-item">
        <div class="activity-icon">${act.icon}</div>
        <div class="activity-details">
          <div class="activity-description">${description}</div>
          <div class="activity-time">${act.time}</div>
        </div>
      </div>
    `;
  }).join('');
}
