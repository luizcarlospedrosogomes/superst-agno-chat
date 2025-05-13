import { css } from 'https://unpkg.com/lit@2.8.0/index.js?module';

export const chatbotStyles = css`
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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    dialog {
        position: fixed;
        left: auto;
        right: 20px;
        bottom: 80px;
        width: 350px;
        height: 500px;
        border: none;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        padding: 0;
        overflow: hidden;
        resize: both;
        z-index: 9999;
    }

    .dialog-content {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .dialog-header {
        background: #444;
        color: white;
        padding: 8px;
        font-weight: bold;
        cursor: move;
    }

    .messages {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
    }

    .textarea-container {
        display: flex;
        gap: 8px;
        padding: 10px;
        border-top: 1px solid #ccc;
    }

    textarea {
        flex: 1;
        resize: none;
    }

    button.close {
        background: transparent;
        border: none;
        color: white;
        float: right;
        cursor: pointer;
    }
    .floating-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
    }

    .chat-panel {
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 400px;
      height: 500px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }

    .user, .bot {
      margin: 5px 0;
    }

    .user {
      text-align: right;
      
    }

    .bot {
      text-align: left;
    }

    .textarea-container {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ddd;
    }

    textarea {
      flex: 1;
      padding: 6px;
      font-size: 14px;
      resize: none;
    }

    button.submit {
      margin-left: 8px;
    }

    /* Redimensionamento */
    .resize-handle {
      position: absolute;
      top: 0;
      left: 0;
      width: 12px;
      height: 12px;
      background: transparent;
      cursor: nwse-resize;
      z-index: 10;
    }

    .resize-handle:before {
      content: "↖";
      font-size: 12px;
      color: #888;
    }

    .header {
      background-color: #1FA8C9;
      color: white;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      
      align-items: center;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      border-radius: 8px 8px 0 0;
      cursor: move;
    }

    .header span {
      flex-grow: 1;
      text-align: center;
    }
    
    .gear-icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      fill: white;
    }
`;