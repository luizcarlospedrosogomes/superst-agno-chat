// database-selector.js
import { LitElement, html, css } from 'https://unpkg.com/lit@2.8.0/index.js?module';

class DatabaseSelector extends LitElement {
  static styles = css`
    select {
      margin-bottom: 10px;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 14px;
      width: 100%;
    }
    label {
      font-weight: bold;
      display: block;
      margin-bottom: 4px;
    }
  `;

  static properties = {
    databases: { type: Array },
    selected: { type: String }
  };

  constructor() {
    super();
    this.databases = [];
    this.selected = '';
  }
  
  firstUpdated() {
    this._fetchDatabases();
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchDatabases();
  }

  async _fetchDatabases() {
    try {
      const res = await fetch('/agno/databases',{ credentials: "include" });
      const data = await res.json();
      this.databases = data.result || [];
      this.selected = this.databases[0] || '';
      this._emitSelection();
    } catch (err) {
      console.error('Erro ao carregar bancos de dados:', err);
    }
  }

  _onChange(e) {
    this.selected = e.target.value;
    this._emitSelection();
  }

  _emitSelection() {
    this.dispatchEvent(new CustomEvent('database-selected', {
      detail: this.selected,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <label>Banco:</label>
      <select @change=${this._onChange}>
        ${this.databases.map(db => html`
          <option value=${db.name} ?selected=${db.name === this.selected}>${db.name}</option>
        `)}
      </select>
    `;
  }
}

customElements.define('database-selector', DatabaseSelector);
