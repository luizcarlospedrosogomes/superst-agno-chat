import { LitElement, html, css } from 'https://unpkg.com/lit@2.8.0/index.js?module';
import { unsafeHTML } from 'https://unpkg.com/lit@2.8.0/directives/unsafe-html.js?module';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@10.0.0/lib/marked.esm.js';
import './database-selector.js';
import './model-selector.js'; 
import { chatbotStyles } from './style.js'
class ChatbotFloatingPanel extends LitElement {
  static properties = {
    showChat: { type: Boolean },
    message: { type: String },
    loading: { type: Boolean },
    messages: { type: Array },
    selectedDatabase: { type: Object },
    showModelSelector: { type: Boolean }, // Para exibir o selector de modelos
    selectedModel: { type: String }, 
  };

  constructor() {
    super();
    this.showChat = false;
    this.message = '';
    this.loading = false;
    this.messages = [];
    this.selectedDatabase = {};
    this.showModelSelector = true; 
    this.selectedModel = '';
    
  }

  static styles = chatbotStyles;

  render() {
    return html`
      <button class="floating-button" @click=${() => this.showChat = !this.showChat}>🤖 Chatbot</button>

      ${this.showChat ? html`
        <div class="chat-panel">
          <div class="resize-handle" @mousedown=${this.startResize}></div>
          <div class="header">
           <span>Data Bot</span>
           <div >
            <svg @click=${this.toggleModelSelector} class="gear-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15.4l2.6 1.6a9.7 9.7 0 0 0 0-4.4l-2.6 1.6M4.6 8.6L2 7a9.7 9.7 0 0 0 0 4.4l2.6-1.6M12 1v4M12 19v4M4.2 4.2l2.8 2.8M16.6 16.6l2.8 2.8M1 12h4M19 12h4M4.2 19.8l2.8-2.8M16.6 7.4l2.8-2.8"></path>
              </svg>
               ${this.showModelSelector ? html`
                  <model-selector @model-selected=${this.onModelSelected}></model-selector>
              ` : ''} 
            </div>
          </div>
          <database-selector  @database-selected=${e => this.selectedDatabase = e.detail}></database-selector>

          <div class="messages">
            ${this.messages.map(msg => html`
              <div class=${msg.user ? 'user' : 'bot'}>
                ${unsafeHTML(marked.parse(msg.text))}
              </div>
              
              <span style=${msg.user ? 'display: none;' : 'font-size: 8px; color: #888;'}>${this.selectedModel}</span>

            `)}
          </div>

          <div class="textarea-container">
            <textarea
              .value=${this.message}
              @input=${e => this.message = e.target.value}
              placeholder="Digite sua pergunta..."
            ></textarea>
            <button class="submit" @click=${this.sendMessage} ?disabled=${this.loading}>
              ${this.loading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
            
      ` : ''}
    `;
  }

  async sendMessage() {
    const text = this.message.trim();
    if (!text) return;

    this.loading = true;
    this.messages = [...this.messages, { user: true, text }];
    this.message = '';

    try {
      const res = await fetch(`/agno/query?question=${encodeURIComponent(text)}&database=${this.selectedDatabase?.name || ''}`);
      const data = await res.json();
      this.messages = [...this.messages, { user: false, text: data?.result || 'Nenhuma resposta.' }];
    } catch {
      this.messages = [...this.messages, { user: false, text: 'Erro ao se comunicar com o servidor.' }];
    } finally {
      this.loading = false;
    }
  }


  toggleModelSelector() {
    this.showModelSelector = !this.showModelSelector;
  }

  onModelSelected(e) {
    this.selectedModel = e.detail;
    this.showModelSelector = false;
  } 

  startResize(e) {
    const chatPanel = this.shadowRoot.querySelector('.chat-panel');
    const startWidth = chatPanel.offsetWidth;
    const startHeight = chatPanel.offsetHeight;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent) => {
      const width = startWidth + startX - moveEvent.clientX;
      const height = startHeight + startY - moveEvent.clientY;

      chatPanel.style.width = `${width}px`;
      chatPanel.style.height = `${height}px`;
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
}

customElements.define('chatbot-floating-panel', ChatbotFloatingPanel);


function mountLitButton() {
  if (!document.body) return setTimeout(mountLitButton, 300);
  const el = document.createElement("chatbot-floating-panel");
  document.body.appendChild(el);
}
mountLitButton();
