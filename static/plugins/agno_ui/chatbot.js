import { LitElement, html, css } from 'https://unpkg.com/lit@2.8.0/index.js?module';
import { unsafeHTML } from 'https://unpkg.com/lit@2.8.0/directives/unsafe-html.js?module';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@10.0.0/lib/marked.esm.js';
import './database-selector.js';

class ChatbotFloatingButton extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column-reverse;
      width: 320px;
    }

    button {
      padding: 12px 20px;
      background-color: #1FA8C9;
      color: white;
      border: none;
      border-radius: 50px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-size: 16px;
      cursor: pointer;
    }

    .chatbox {
        background: white;
        border: 1px solid #ccc;
        border-radius: 12px;
        padding: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        width: 100%;
        min-width: 250px;
        min-height: 200px;
        max-height: 80vh;
        resize: both;
        overflow: auto;
        display: flex;
        flex-direction: column;
        }

    .messages {
      flex-grow: 1;
      overflow-y: auto;
      margin-bottom: 10px;
    }

    .messages .user {
      font-weight: bold;
      margin-bottom: 4px;
    }

    .messages .bot {
      margin-bottom: 12px;
    }

    .textarea-container {
      margin-top: auto;
    }

    textarea {
      width: 100%;
      height: 80px;
      resize: none;
      font-size: 14px;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }

    .submit {
      margin-top: 10px;
      background-color: #28a745;
    }

    .markdown-content {
      font-size: 14px;
      line-height: 1.4;
    }

    .markdown-content pre {
      background: #f4f4f4;
      padding: 8px;
      border-radius: 6px;
      overflow-x: auto;
    }

    .markdown-content code {
      background: #f0f0f0;
      padding: 2px 4px;
      border-radius: 4px;
    }
  `;

  static properties = {
    showChatbox: { type: Boolean },
    message: { type: String },
    loading: { type: Boolean },
    messages: { type: Array }
  };

  constructor() {
    super();
    this.showChatbox = false;
    this.message = '';
    this.loading = false;
    this.messages = [];
    this.selectedDatabase = ''
  }

  render() {
    return html`
      <button @click=${this.toggleChatbox}>🤖 Chatbot</button>
      ${this.showChatbox ? html`
        <div class="chatbox">
          <database-selector @database-selected=${e => this.selectedDatabase = e.detail}></database-selector>
          <div class="messages">
            ${this.messages.map(msg => html`
              <div class=${msg.user ? 'user' : 'bot'}>
                <div class="markdown-content">
                  ${unsafeHTML(marked.parse(msg.text))}
                </div>
              </div>
            `)}
          </div>
          <div class="textarea-container">
            <textarea
              .value=${this.message}
              @input=${e => this.message = e.target.value}
              placeholder="Digite sua pergunta..."
            ></textarea>
            <button class="submit" @click=${this.sendMessage} ?disabled=${this.loading}>
              ${this.loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      ` : ''}
    `;
  }

  toggleChatbox() {
    this.showChatbox = !this.showChatbox;
  }

  async sendMessage() {
    const trimmed = this.message.trim();
    if (!trimmed) return;

    this.loading = true;
    this.messages = [...this.messages, { user: true, text: trimmed }];
    this.message = '';

    try {
      const res = await fetch(`/agno/query?question=${encodeURIComponent(trimmed)}&database=${this.selectedDatabase.name}`, {
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      const botReply = data?.result || 'Nenhuma resposta.';
      this.messages = [...this.messages, { user: false, text: botReply }];
    } catch (err) {
      this.messages = [...this.messages, { user: false, text: 'Erro ao se comunicar com o servidor.' }];
    } finally {
      this.loading = false;
    }
  }
}

customElements.define('chatbot-floating-button', ChatbotFloatingButton);

function mountLitButton() {
  if (!document.body) return setTimeout(mountLitButton, 300);
  const el = document.createElement("chatbot-floating-button");
  document.body.appendChild(el);
}

mountLitButton();
