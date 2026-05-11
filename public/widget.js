(function() {
  // Get config from script tag
  const script = document.currentScript;
  const businessId = script.getAttribute('data-business');
  const color = script.getAttribute('data-color') || '#00FF88';
  const position = script.getAttribute('data-position') || 'bottom-right';
  const greeting = script.getAttribute('data-greeting') || 'Hello! How can I help you today?';

  if (!businessId) {
    console.error('AskMela: data-business attribute is required');
    return;
  }

  // Inject styles
  const styles = `
    #askmela-widget-btn {
      position: fixed;
      ${position.includes('right') ? 'right: 20px' : 'left: 20px'};
      bottom: 20px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${color};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #askmela-widget-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 24px rgba(0,0,0,0.25);
    }
    #askmela-widget-iframe {
      position: fixed;
      ${position.includes('right') ? 'right: 20px' : 'left: 20px'};
      bottom: 88px;
      width: 380px;
      height: 580px;
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      z-index: 999999;
      display: none;
      background: white;
    }
    #askmela-widget-iframe.open {
      display: block;
      animation: askmela-slide-up 0.25s ease;
    }
    @keyframes askmela-slide-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 480px) {
      #askmela-widget-iframe {
        width: calc(100vw - 24px);
        height: calc(100vh - 120px);
        right: 12px;
        left: 12px;
        bottom: 80px;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Create button
  const btn = document.createElement('button');
  btn.id = 'askmela-widget-btn';
  btn.setAttribute('aria-label', 'Open Ask Mela chat');
  btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
        fill="#0F172A"/>
    </svg>
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'askmela-widget-iframe';
  iframe.src = `https://askmela.addus.xyz/chat/widget/${businessId}?color=${encodeURIComponent(color)}&greeting=${encodeURIComponent(greeting)}`;
  iframe.title = 'Ask Mela Chat';
  iframe.allow = 'microphone';

  // Toggle open/close
  let isOpen = false;
  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.classList.add('open');
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      `;
    } else {
      iframe.classList.remove('open');
      btn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
            fill="#0F172A"/>
        </svg>
      `;
    }
  });

  document.body.appendChild(btn);
  document.body.appendChild(iframe);
})();
