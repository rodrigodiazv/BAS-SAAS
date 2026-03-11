// BAS-SAAS - Sistema de Autenticación
class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  init() {
    // Crear usuarios demo si no existen
    if (!localStorage.getItem('bas_users')) {
      const demoUsers = [
        {
          id: 1,
          email: 'admin@bas-saas.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin',
          plan: 'enterprise',
          createdAt: new Date('2024-01-15').toISOString()
        },
        {
          id: 2,
          email: 'demo@example.com',
          password: 'demo123',
          name: 'Demo User',
          role: 'user',
          plan: 'pro',
          createdAt: new Date('2024-02-20').toISOString()
        }
      ];
      localStorage.setItem('bas_users', JSON.stringify(demoUsers));
    }

    // Cargar sesión actual
    const sessionData = localStorage.getItem('bas_session');
    if (sessionData) {
      this.currentUser = JSON.parse(sessionData);
    }
  }

  login(email, password) {
    const users = JSON.parse(localStorage.getItem('bas_users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const sessionUser = { ...user };
      delete sessionUser.password;
      this.currentUser = sessionUser;
      localStorage.setItem('bas_session', JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  register(email, password, name) {
    const users = JSON.parse(localStorage.getItem('bas_users'));
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser = {
      id: users.length + 1,
      email,
      password,
      name,
      role: 'user',
      plan: 'free',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('bas_users', JSON.stringify(users));

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    this.currentUser = sessionUser;
    localStorage.setItem('bas_session', JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('bas_session');
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }
}

// Instancia global
const auth = new AuthSystem();
