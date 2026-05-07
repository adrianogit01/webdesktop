let touchpadAtivo = false;

function toggleTouchpad() {
  if (touchpadAtivo) {
    // Desativa: remove os elementos e event listeners
    const pad = document.getElementById("custom-touchpad");
    const cursor = document.getElementById("custom-cursor");
    if (pad) pad.remove();
    if (cursor) cursor.remove();

    // Remove event listener de scroll
    window.removeEventListener("scroll", atualizarCursorPos);
    touchpadAtivo = false;
  } else {
    iniciarTouchpad();
    touchpadAtivo = true;
  }
}

let atualizarCursorPos; // precisa ser acessível para remoção

function iniciarTouchpad() {
  if (document.getElementById("custom-touchpad")) return;

  const cursor = document.createElement("div");
  cursor.id = "custom-cursor";
  Object.assign(cursor.style, {
    position: "absolute",
    width: "0",
    height: "0",
    borderTop: "10px solid transparent",
    borderBottom: "10px solid transparent",
    borderLeft: "15px solid white",
    pointerEvents: "none",
    zIndex: "9999"
  });
  document.body.appendChild(cursor);

  const pad = document.createElement("div");
  pad.id = "custom-touchpad";
  Object.assign(pad.style, {
    position: "fixed",
    right: "0",
    bottom: "50px",
    width: "60%",
    height: "220px",
    backgroundColor: "rgba(255,255,255,0.5)",
    zIndex: "9998",
    touchAction: "none"
  });
  document.body.appendChild(pad);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y + window.scrollY}px`;

  let lastTap = 0;
  let startX, startY;

  pad.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

// Dentro da função iniciarTouchpad, no listener de touchmove:

pad.addEventListener("touchmove", e => {
    e.preventDefault();
    const touch = e.touches[0];
    
    // 1. Captura o fator de zoom (ex: 1.5 para 150%)
    // Lemos do body conforme definido no seu index.html
    const fatorZoom = (parseFloat(document.body.style.zoom) || 100) / 100;

    // 2. Ajusta o deslocamento dividindo pelo zoom
    const dx = (touch.clientX - startX) / fatorZoom;
    const dy = (touch.clientY - startY) / fatorZoom;

    // 3. Atualiza as coordenadas x e y
    x = Math.max(0, Math.min(window.innerWidth / fatorZoom, x + dx));
    y = Math.max(0, Math.min(document.body.scrollHeight / fatorZoom, y + dy));

    // 4. Aplica ao estilo (o navegador já interpreta esses valores 
    // de acordo com o zoom do elemento pai)
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    startX = touch.clientX;
    startY = touch.clientY;
});

  pad.addEventListener("touchend", e => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap < 300) {
        // 1. Pegar o zoom atual exatamente no momento do clique
        const fatorZoom = (parseFloat(document.body.style.zoom) || 100) / 100;

        // 2. O elementFromPoint precisa da coordenada VISUAL no viewport.
        // Se o x/y do cursor já estão normalizados, multiplicamos de volta 
        // ou usamos a posição relativa ao scroll corretamente.
        const clickX = x * fatorZoom;
        const clickY = (y - window.scrollY) * fatorZoom;

        const el = document.elementFromPoint(x, y - window.scrollY); 
        
        if (el) {
            // Simula o clique com coordenadas ajustadas
            const click = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x, 
                clientY: y - window.scrollY
            });
            el.dispatchEvent(click);
            
            // Foco especial para inputs e botões de titlebar
            if (el.tagName === 'BUTTON' || el.tagName === 'A') {
                el.focus();
            }
        }
    }
    lastTap = now;
});

  atualizarCursorPos = () => {
    x = window.innerWidth / 2;
    y = window.innerHeight / 2 + window.scrollY;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y - window.scrollY}px`;
  };

  window.addEventListener("scroll", atualizarCursorPos);
}

