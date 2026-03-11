// BAS-SAAS - Subscriptions Management
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['1 usuario', 'Funciones básicas', 'Soporte por email', '1 GB almacenamiento']
  },
  starter: {
    name: 'Starter',
    price: 29,
    features: ['5 usuarios', 'Todas las funciones', 'Soporte prioritario', '10 GB almacenamiento', 'Integraciones básicas']
  },
  pro: {
    name: 'Pro',
    price: 79,
    features: ['20 usuarios', 'Funciones avanzadas', 'Soporte 24/7', '100 GB almacenamiento', 'Integraciones ilimitadas', 'Análisis avanzados']
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    features: ['Usuarios ilimitados', 'Personalización completa', 'Account manager dedicado', '1 TB almacenamiento', 'API completa', 'SLA garantizado', 'Onboarding personalizado']
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.requireAuth()) return;

  const user = auth.getCurrentUser();
  loadUserInfo(user);
  loadCurrentPlan(user);
  loadPaymentHistory();

  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.logout();
    window.location.href = 'index.html';
  });

  document.getElementById('changePlanBtn').addEventListener('click', showPlansSection);
  document.getElementById('cancelPlanBtn').addEventListener('click', cancelSubscription);
  document.getElementById('downloadInvoicesBtn').addEventListener('click', () => {
    alert('Descargando facturas... (Demo)');
  });
});

function loadUserInfo(user) {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

function loadCurrentPlan(user) {
  const plan = PLANS[user.plan];
  
  document.getElementById('currentPlanName').textContent = `Plan ${plan.name}`;
  document.getElementById('currentPlanPrice').textContent = plan.price === 0 ? 'Gratis' : `$${plan.price}`;
  
  const featuresHTML = plan.features.map(f => 
    `<div class="feature-item">✅ ${f}</div>`
  ).join('');
  document.getElementById('currentPlanFeatures').innerHTML = featuresHTML;
}

function showPlansSection() {
  document.getElementById('plansSection').style.display = 'block';
  
  const user = auth.getCurrentUser();
  const plansHTML = Object.entries(PLANS).map(([key, plan]) => {
    const isCurrent = key === user.plan;
    return `
      <div class="plan-card ${isCurrent ? 'current-plan' : ''}">
        ${isCurrent ? '<div class="current-badge">Plan actual</div>' : ''}
        <h3>${plan.name}</h3>
        <div class="plan-price-big">
          ${plan.price === 0 ? 'Gratis' : `$${plan.price}<span>/mes</span>`}
        </div>
        <ul class="plan-features-list">
          ${plan.features.map(f => `<li>✅ ${f}</li>`).join('')}
        </ul>
        ${!isCurrent ? `
          <button class="btn-primary full-width" onclick="changePlan('${key}')">
            ${getPlanButton(user.plan, key)}
          </button>
        ` : '<button class="btn-secondary full-width" disabled>Plan actual</button>'}
      </div>
    `;
  }).join('');
  
  document.getElementById('plansGrid').innerHTML = plansHTML;
}

function getPlanButton(currentPlan, targetPlan) {
  const currentPrice = PLANS[currentPlan].price;
  const targetPrice = PLANS[targetPlan].price;
  
  if (targetPrice > currentPrice) return 'Actualizar plan';
  if (targetPrice < currentPrice) return 'Cambiar a este plan';
  return 'Seleccionar';
}

function changePlan(newPlan) {
  if (!confirm(`¿Confirmar cambio a plan ${PLANS[newPlan].name}?`)) return;
  
  // Update user plan
  let users = JSON.parse(localStorage.getItem('bas_users'));
  const userIndex = users.findIndex(u => u.id === auth.getCurrentUser().id);
  
  if (userIndex !== -1) {
    users[userIndex].plan = newPlan;
    localStorage.setItem('bas_users', JSON.stringify(users));
    
    // Update session
    const sessionUser = { ...users[userIndex] };
    delete sessionUser.password;
    localStorage.setItem('bas_session', JSON.stringify(sessionUser));
    
    // Add payment record
    addPaymentRecord(PLANS[newPlan].name, PLANS[newPlan].price);
    
    showNotification(`Plan cambiado a ${PLANS[newPlan].name} correctamente`, 'success');
    
    setTimeout(() => window.location.reload(), 1500);
  }
}

function cancelSubscription() {
  if (!confirm('¿Estás seguro de cancelar tu suscripción? Perderás acceso a las funciones premium.')) return;
  
  changePlan('free');
}

function loadPaymentHistory() {
  // Generate or load payment history
  if (!localStorage.getItem('bas_payments')) {
    generatePaymentHistory();
  }
  
  const payments = JSON.parse(localStorage.getItem('bas_payments'));
  const tbody = document.getElementById('paymentsTableBody');
  
  tbody.innerHTML = payments.map(payment => `
    <tr>
      <td>${formatDate(payment.date)}</td>
      <td>${payment.description}</td>
      <td><strong>$${payment.amount}</strong></td>
      <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
      <td><button class="btn-link" onclick="downloadInvoice('${payment.id}')">📄 Descargar</button></td>
    </tr>
  `).join('');
}

function generatePaymentHistory() {
  const user = auth.getCurrentUser();
  const plan = PLANS[user.plan];
  const payments = [];
  
  if (plan.price > 0) {
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    let paymentDate = new Date(createdDate);
    
    while (paymentDate < now) {
      payments.push({
        id: `INV-${payments.length + 1000}`,
        date: paymentDate.toISOString(),
        description: `Plan ${plan.name}`,
        amount: plan.price,
        status: 'paid'
      });
      
      paymentDate.setMonth(paymentDate.getMonth() + 1);
    }
  }
  
  localStorage.setItem('bas_payments', JSON.stringify(payments));
}

function addPaymentRecord(planName, amount) {
  let payments = JSON.parse(localStorage.getItem('bas_payments')) || [];
  
  payments.unshift({
    id: `INV-${1000 + payments.length}`,
    date: new Date().toISOString(),
    description: `Plan ${planName}`,
    amount: amount,
    status: 'paid'
  });
  
  localStorage.setItem('bas_payments', JSON.stringify(payments));
  loadPaymentHistory();
}

function downloadInvoice(invoiceId) {
  alert(`Descargando factura ${invoiceId}... (Demo)`);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
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

// Make functions global
window.changePlan = changePlan;
window.downloadInvoice = downloadInvoice;
