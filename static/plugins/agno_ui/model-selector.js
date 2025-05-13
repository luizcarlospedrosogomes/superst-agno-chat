// model-selector.js
import { LitElement, html, css } from 'https://unpkg.com/lit@2.8.0/index.js?module';

class ModelSelector extends LitElement {
  static properties = {
    models: { type: Array },
    selectedModel: { type: String },
  };

  constructor() {
    super();
    this.models = [
        {
            id: 'gemini-2.0-flash',
            name: 'Gemini-Flash'
        }
    ]; // Exemplos de modelos
    this.selected = 'gemini-2.0-flash';
  }

  static styles = css`
    .model-selector {
        color: #000000d9;
        position: absolute;
        top: 28px;
        right: 0;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 10px;
        border-radius: 8px;
        z-index: 10001;
        width: 180px;
        font-size: 11px;
    }

    .model-item {
      padding: 10px;
      margin: 5px 0;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 5px;
      transition: background-color 0.3s;
    }

    .model-item:hover {
      background-color: #f1f1f1;
    }

    .model-item.selected {
      background-color: #007BFF;
      color: white;
    }
  `;

    firstUpdated() {
        this._emitSelection();
    }

   _onChange(e) {
        this.selected = e.target.value;
        this._emitSelection();
    }

  _emitSelection() {
    this.dispatchEvent(new CustomEvent('model-selected', {
      detail: this.selected,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="model-selector">
        <h3>Selecione um Modelo</h3>
        <select @change=${this._onChange}>
        ${this.models.map((model) => html`
          <option value=${model.id} ?selected=${model.id === this.selected}>${model.name}</option>
        `)}
        </select>
      </div>
    `;
  }

  
}

customElements.define('model-selector', ModelSelector);
