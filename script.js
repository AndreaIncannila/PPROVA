let deferredPrompt;

// Gestione stato online/offline
window.addEventListener('online', () => showStatus('Sei online ✔️', 'green'));
window.addEventListener('offline', () => showStatus('Sei offline ❌', 'red'));

function showStatus(message, color) {
  let status = document.getElementById('status');
  if (!status) {
    status = document.createElement('div');
    status.id = 'status';
    status.style.position = 'fixed';
    status.style.top = '10px';
    status.style.right = '10px';
    status.style.padding = '10px';
    status.style.zIndex = '9999';
    status.style.borderRadius = '8px';
    status.style.color = 'white';
    document.body.appendChild(status);
  }
  status.style.backgroundColor = color;
  status.textContent = message;
  setTimeout(() => { status.style.display = 'none'; }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  // Ripristina valori salvati
  document.querySelectorAll('input').forEach(input => {
    const saved = localStorage.getItem(input.id);
    if (saved) input.value = saved;
  });

  // Tema salvato
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Bottone tema
  const btnTheme = document.createElement('button');
  btnTheme.textContent = '🌓 Cambia Tema';
  btnTheme.style.position = 'fixed';
  btnTheme.style.bottom = '10px';
  btnTheme.style.right = '10px';
  btnTheme.style.padding = '10px';
  btnTheme.style.borderRadius = '8px';
  btnTheme.onclick = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  };
  document.body.appendChild(btnTheme);

  // Bottone installazione PWA
  const btnInstall = document.createElement('button');
  btnInstall.id = 'installBtn';
  btnInstall.textContent = '📲 Installa App';
  btnInstall.style.position = 'fixed';
  btnInstall.style.bottom = '60px';
  btnInstall.style.right = '10px';
  btnInstall.style.padding = '10px';
  btnInstall.style.borderRadius = '8px';
  btnInstall.style.display = 'none';
  document.body.appendChild(btnInstall);

  btnInstall.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Utente ha accettato l’installazione');
        } else {
          console.log('Utente ha rifiutato l’installazione');
        }
        deferredPrompt = null;
        btnInstall.style.display = 'none';
      });
    }
  });

  calc(); // calcolo iniziale
});

// Rende dark mode visibile
const style = document.createElement('style');
style.textContent = `
.dark-mode {
  background-color: #121212;
  color: white;
}
`;
document.head.appendChild(style);

// Calcolo automatico
document.addEventListener('input', () => {
  document.querySelectorAll('input').forEach(input => {
    localStorage.setItem(input.id, input.value);
  });
  calc();
});

function calc() {
  const hp = parseFloat(document.getElementById('altezzaPosteriore')?.value) || 0;
  const ha = parseFloat(document.getElementById('altezzaAnteriore')?.value) || 0;
  const sp = parseFloat(document.getElementById('sporgenza')?.value) || 0;

  const hp_mod = hp - 8.5;
  const ha_mod = ha + 9;
  const sp_mod = sp - 32.5;
  const profondita = Math.sqrt(Math.pow(hp_mod - ha_mod, 2) + Math.pow(sp_mod, 2)).toFixed(2);

  if (!isNaN(profondita)) {
    document.getElementById('risultato')?.innerText = `Profondità guida: ${profondita} cm`;
    localStorage.setItem('ultimaModifica', new Date().toLocaleString());
    document.getElementById('ultimaData')?.innerText = 'Ultimo calcolo: ' + localStorage.getItem('ultimaModifica');
  }
}

// Intercetta evento installazione PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'block';
});
