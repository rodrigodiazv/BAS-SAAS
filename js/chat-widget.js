// BAS-SAAS - Live Chat Widget (connected to Telegram)
class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.sessionId = this.getOrCreateSessionId();
    this.messages = this.loadMessages();
    this.pollingInterval = null;
    this.init();
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
    if (this.messages.length > 0) {
      this.renderMessages();
    }
    this.startPolling();
  }

  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('bas_chat_session');
    if (!sessionId) {
      sessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('bas_chat_session', sessionId);
    }
    return sessionId;
  }

  loadMessages() {
    const stored = localStorage.getItem('bas_chat_messages');
    return stored ? JSON.parse(stored) : [];
  }

  saveMessages() {
    localStorage.setItem('bas_chat_messages', JSON.stringify(this.messages));
  }

  createWidget() {
    const widgetHTML = `
      <div class="chat-widget" id="chatWidget">
        <!-- Floating Button -->
        <button class="chat-button" id="chatButton">
          <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="chat-badge" id="chatBadge" style="display:none;">1</span>
        </button>

        <!-- Chat Window -->
        <div class="chat-window" id="chatWindow" style="display:none;">
          <div class="chat-header">
            <div class="chat-header-info">
              <div class="chat-avatar">💎</div>
              <div>
                <div class="chat-title">Charly - Asistente IA</div>
                <div class="chat-status">
                  <span class="status-dot"></span>
                  Online ahora
                </div>
              </div>
            </div>
            <button class="chat-close" id="chatClose">×</button>
          </div>

          <div class="chat-messages" id="chatMessages">
            <!-- Messages will be rendered here -->
          </div>

          <form class="chat-input-form" id="chatForm">
            <input 
              type="text" 
              class="chat-input" 
              id="chatInput" 
              placeholder="Escribe tu mensaje..."
              autocomplete="off"
            />
            <button type="submit" class="chat-send">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);
  }

  attachEventListeners() {
    document.getElementById('chatButton').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatClose').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatForm').addEventListener('submit', (e) => this.handleSubmit(e));
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const chatWindow = document.getElementById('chatWindow');
    const chatButton = document.getElementById('chatButton');
    
    if (this.isOpen) {
      chatWindow.style.display = 'flex';
      chatButton.style.display = 'none';
      this.scrollToBottom();
      this.markAsRead();
      
      // Show welcome message if no messages
      if (this.messages.length === 0) {
        this.addMessage('bot', '¡Hola! Soy Charly, tu asistente IA. ¿En qué puedo ayudarte con BAS?', false);
      }
    } else {
      chatWindow.style.display = 'none';
      chatButton.style.display = 'flex';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage('user', message, true);
    input.value = '';
    
    // Send to Telegram
    await this.sendToTelegram(message);
    
    // Show typing indicator
    this.showTyping();
  }

  addMessage(sender, text, save = true) {
    const messageObj = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date().toISOString()
    };
    
    this.messages.push(messageObj);
    if (save) this.saveMessages();
    
    this.renderMessage(messageObj);
    this.scrollToBottom();
  }

  renderMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    this.messages.forEach(msg => this.renderMessage(msg));
  }

  renderMessage(message) {
    const container = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${message.sender}`;
    
    const time = new Date(message.timestamp).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageEl.innerHTML = `
      <div class="message-bubble">
        <div class="message-text">${this.escapeHtml(message.text)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
    
    container.appendChild(messageEl);
  }

  showTyping() {
    const container = document.getElementById('chatMessages');
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message bot typing-indicator';
    typingEl.id = 'typingIndicator';
    typingEl.innerHTML = `
      <div class="message-bubble">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.appendChild(typingEl);
    this.scrollToBottom();
  }

  removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  async sendToTelegram(message) {
    try {
      // Get user info
      const userInfo = this.getUserInfo();
      
      // Format message for Telegram
      const page = window.location.pathname.replace('/BAS-SAAS/', '') || 'landing';
      const telegramMessage = `🌐 *Chat BAS-SAAS*\n\n👤 ${userInfo.name || 'Anónimo'}\n📧 ${userInfo.email || 'Visitante'}\n💼 Plan: ${userInfo.plan || 'No registrado'}\n📍 ${page}\n🆔 \`${this.sessionId}\`\n\n💬 *Mensaje:*\n${message}`;

      // Store message for Charly to respond
      const chatData = {
        sessionId: this.sessionId,
        userInfo,
        message,
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage for Charly's webhook to pick up
      const pendingKey = 'bas_pending_chats';
      const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
      pending.push(chatData);
      localStorage.setItem(pendingKey, JSON.stringify(pending));

      // Make message available globally for webhook
      window.basChatQueue = window.basChatQueue || [];
      window.basChatQueue.push({
        sessionId: this.sessionId,
        telegramMessage,
        timestamp: Date.now()
      });

      console.log('Message queued for Telegram:', telegramMessage);

      // Show auto-response while waiting for Charly
      setTimeout(() => {
        this.removeTyping();
        this.addMessage('bot', 'Mensaje recibido. Charly te responderá en un momento...', true);
      }, 1500);

    } catch (error) {
      console.error('Error sending to Telegram:', error);
      this.removeTyping();
      this.addMessage('bot', 'Lo siento, hubo un error. Intenta de nuevo.', true);
    }
  }

  simulateResponse(userMessage) {
    // This will be replaced with real responses from Telegram
    const responses = [
      'Gracias por tu mensaje. Un momento mientras reviso eso...',
      'Entiendo. ¿Podrías darme más detalles sobre tu negocio?',
      'Perfecto. Te estoy conectando con un asesor...'
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    this.addMessage('bot', response, true);
  }

  startPolling() {
    // Poll for new messages from Telegram every 3 seconds
    this.pollingInterval = setInterval(() => {
      this.checkForNewMessages();
    }, 3000);
  }

  async checkForNewMessages() {
    // This will check for responses from Telegram
    // For now, it's a placeholder
  }

  getUserInfo() {
    const sessionUser = localStorage.getItem('bas_session');
    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      return {
        name: user.name,
        email: user.email,
        plan: user.plan
      };
    }
    return {};
  }

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  markAsRead() {
    const badge = document.getElementById('chatBadge');
    if (badge) badge.style.display = 'none';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}


  // Method to receive responses from Charly (called from console or webhook)
  receiveFromCharly(text, targetSessionId = null) {
    const sessionId = targetSessionId || this.sessionId;
    
    if (sessionId === this.sessionId) {
      this.removeTyping();
      this.addMessage('bot', text, true);
      
      // Show notification if chat is closed
      if (!this.isOpen) {
        const badge = document.getElementById('chatBadge');
        if (badge) {
          badge.textContent = '1';
          badge.style.display = 'flex';
        }
      }
    }
  }
}

// Make widget globally accessible
let chatWidgetInstance = null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    chatWidgetInstance = new ChatWidget();
    window.chatWidget = chatWidgetInstance;
  });
} else {
  chatWidgetInstance = new ChatWidget();
  window.chatWidget = chatWidgetInstance;
}
