// Gestione stato online/offline
window.addEventListener('online', () => {
  showStatus('Sei online ✔️', 'green');
});
window.addEventListener('offline', () => {
  showStatus('Sei offline ❌', 'red');
});

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

// Salvataggio e recupero dati
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input').forEach(input => {
    const saved = localStorage.getItem(input.id);
    if (saved) input.value = saved;
  });

  // Pulsante tema
  const btn = document.createElement('button');
  btn.textContent = '🌓 Cambia Tema';
  btn.style.position = 'fixed';
  btn.style.bottom = '10px';
  btn.style.right = '10px';
  btn.style.padding = '10px';
  btn.style.borderRadius = '8px';
  btn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  };
  document.body.appendChild(btn);

  // Tema salvato
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

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

// Rende il calcolo automatico
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
