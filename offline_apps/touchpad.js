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

  pad.addEventListener("touchmove", e => {
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    x = Math.max(0, Math.min(window.innerWidth, x + dx));
    y = Math.max(0, Math.min(document.body.scrollHeight, y + dy));

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    startX = touch.clientX;
    startY = touch.clientY;
  });

  pad.addEventListener("touchend", e => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap < 300) {
      const el = document.elementFromPoint(x, y - window.scrollY);
      if (el) {
        const click = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y - window.scrollY
        });
        el.dispatchEvent(click);
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

