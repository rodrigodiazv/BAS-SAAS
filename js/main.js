// BAS-SAAS - Main Landing Logic
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si ya está logueado
  if (auth.isAuthenticated()) {
    // Mostrar botón de dashboard en lugar de login
    updateNavForLoggedUser();
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Modal de login/signup
  setupAuthModals();
});

function updateNavForLoggedUser() {
  const ctaButtons = document.querySelectorAll('.btn-primary, .btn-hero');
  ctaButtons.forEach(btn => {
    if (btn.textContent.includes('gratis') || btn.textContent.includes('Prueba')) {
      btn.textContent = '📊 Ir al Dashboard';
      btn.href = 'dashboard.html';
    }
  });
}

function setupAuthModals() {
  // Crear modal de login
  const loginModal = createLoginModal();
  const signupModal = createSignupModal();
  document.body.appendChild(loginModal);
  document.body.appendChild(signupModal);

  // Detectar clicks en CTAs
  document.querySelectorAll('a[href="#signup"], a[href="#cta"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!auth.isAuthenticated()) {
        e.preventDefault();
        showModal('signupModal');
      }
    });
  });

  // Links de cambio entre modals
  document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    hideModal('signupModal');
    showModal('loginModal');
  });

  document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    hideModal('loginModal');
    showModal('signupModal');
  });

  // Cerrar modals
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      hideModal('loginModal');
      hideModal('signupModal');
    });
  });

  // Click fuera del modal
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      hideModal('loginModal');
      hideModal('signupModal');
    }
  });

  // Formularios
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

function createLoginModal() {
  const modal = document.createElement('div');
  modal.id = 'loginModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">×</button>
      <h2>Iniciar sesión</h2>
      <p class="modal-subtitle">Accede a tu cuenta BAS</p>
      <form id="loginForm">
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="tu@email.com" required>
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" placeholder="••••••••" required>
        </div>
        <div class="form-error" id="loginError"></div>
        <button type="submit" class="btn-submit">Entrar</button>
      </form>
      <p class="modal-footer">
        ¿No tienes cuenta? <a href="#" id="showSignup">Regístrate gratis</a>
      </p>
      <div class="modal-demo-hint">
        💡 <strong>Demo:</strong> admin@bas-saas.com / admin123
      </div>
    </div>
  `;
  return modal;
}

function createSignupModal() {
  const modal = document.createElement('div');
  modal.id = 'signupModal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">×</button>
      <h2>Crear cuenta</h2>
      <p class="modal-subtitle">Prueba gratis 14 días, sin tarjeta</p>
      <form id="signupForm">
        <div class="form-group">
          <label>Nombre completo</label>
          <input type="text" name="name" placeholder="Juan Pérez" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="tu@email.com" required>
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" placeholder="••••••••" required minlength="6">
        </div>
        <div class="form-error" id="signupError"></div>
        <button type="submit" class="btn-submit">Crear cuenta gratis</button>
      </form>
      <p class="modal-footer">
        ¿Ya tienes cuenta? <a href="#" id="showLogin">Inicia sesión</a>
      </p>
    </div>
  `;
  return modal;
}

function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');

  const result = auth.login(email, password);
  
  if (result.success) {
    window.location.href = 'dashboard.html';
  } else {
    showError('loginError', result.error);
  }
}

function handleSignup(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  const result = auth.register(email, password, name);
  
  if (result.success) {
    window.location.href = 'dashboard.html';
  } else {
    showError('signupError', result.error);
  }
}

function showModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}

function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 5000);
}

// Video Demo - YouTube Lazy Load
const YOUTUBE_VIDEO_ID = 'QfcozcbDwHg'; // Video genérico temporal

function loadVideoDemo() {
  const placeholder = document.getElementById('youtubePlaceholder');
  const frame = document.getElementById('youtubeFrame');
  const iframe = frame.querySelector('iframe');
  
  iframe.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`;
  placeholder.style.display = 'none';
  frame.style.display = 'block';
}

// Mantener función legacy por si acaso
function loadYouTube() {
  loadVideoDemo();
}

// Alternativamente, si subes el video directamente al sitio:
function loadLocalVideo() {
  const placeholder = document.getElementById('youtubePlaceholder');
  const video = document.getElementById('demoVideo');
  
  placeholder.style.display = 'none';
  video.style.display = 'block';
  video.play();
}
