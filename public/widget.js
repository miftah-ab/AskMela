(function() {
  // 1. Get configuration from script tag
  const script = document.currentScript;
  const businessId = script.getAttribute('data-business');
  const accentColor = script.getAttribute('data-color') || '#00FF88';
  const position = script.getAttribute('data-position') || 'bottom-right';
  const baseUrl = script.src.split('/widget.js')[0]; // Auto-detect base URL

  if (!businessId) {
    console.error('AskMela Widget: Missing data-business attribute');
    return;
  }

  // 2. Create styles
  const styles = `
    #askmela-widget-container {
      position: fixed;
      ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #askmela-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${accentColor};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #askmela-button:hover {
      transform: scale(1.1);
    }
    #askmela-button svg {
      width: 30px;
      height: 30px;
      fill: white;
    }
    #askmela-iframe-container {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 120px);
      max-width: calc(100vw - 40px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      overflow: hidden;
      display: none;
      transform-origin: bottom right;
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
      transform: scale(0.9);
    }
    #askmela-iframe-container.open {
      display: block;
      opacity: 1;
      transform: scale(1);
    }
    @media (max-width: 480px) {
      #askmela-iframe-container {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
      }
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // 3. Create DOM elements
  const container = document.createElement('div');
  container.id = 'askmela-widget-container';

  const button = document.createElement('div');
  button.id = 'askmela-button';
  button.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;

  const iframeContainer = document.createElement('div');
  iframeContainer.id = 'askmela-iframe-container';
  
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/chat/widget/${businessId}?color=${encodeURIComponent(accentColor)}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  iframeContainer.appendChild(iframe);
  container.appendChild(iframeContainer);
  container.appendChild(button);
  document.body.appendChild(container);

  // 4. Handle events
  let isOpen = false;
  button.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframeContainer.style.display = 'block';
      setTimeout(() => iframeContainer.classList.add('open'), 10);
      button.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
    } else {
      iframeContainer.classList.remove('open');
      setTimeout(() => iframeContainer.style.display = 'none', 300);
      button.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;
    }
  };
})();
