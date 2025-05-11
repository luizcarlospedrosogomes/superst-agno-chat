import { LitElement, html, css } from 'https://unpkg.com/lit@2.8.0/index.js?module';

class ChatbotFloatingButton extends LitElement {
  static styles = css`
    button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      padding: 12px 20px;
      background-color: #1FA8C9;
      color: white;
      border: none;
      border-radius: 50px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      font-size: 16px;
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <button @click=${this._onClick}>🤖 Chatbot</button>
    `;
  }

  _onClick() {
    alert("Chatbot ativado com Lit!");
  }
}

customElements.define('chatbot-floating-button', ChatbotFloatingButton);

// Aguarda o body estar disponível
function mountLitButton() {
  if (!document.body) {
    return setTimeout(mountLitButton, 300);
  }
  const el = document.createElement("chatbot-floating-button");
  document.body.appendChild(el);
}

mountLitButton();
