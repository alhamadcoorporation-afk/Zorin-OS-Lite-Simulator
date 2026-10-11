const DEFAULT_USER = {
  username: 'alhamad',
  password: '1234'
};

const APP_LIBRARY = {
  terminal: { name: 'Terminal', icon: '⌨️', installed: true, type: 'system' },
  files: { name: 'Fichiers', icon: '📁', installed: true, type: 'system' },
  notes: { name: 'Notes', icon: '📝', installed: true, type: 'system' },
  browser: { name: 'Navigateur', icon: '🌐', installed: true, type: 'app' },
  calculator: { name: 'Calculatrice', icon: '🧮', installed: true, type: 'app' },
  settings: { name: 'Paramètres', icon: '⚙️', installed: true, type: 'system' },
  appstore: { name: 'Centre d’applications', icon: '🛍️', installed: true, type: 'app' },
  music: { name: 'Lecteur', icon: '🎵', installed: false, type: 'app' },
  office: { name: 'Bureau', icon: '📄', installed: false, type: 'app' },
  chat: { name: 'Messagerie', icon: '💬', installed: false, type: 'app' },
  games: { name: 'Jeux', icon: '🎮', installed: false, type: 'app' }
};

const systemState = {
  user: DEFAULT_USER,
  system: {
    name: 'Zorin OS Lite',
    version: 'Ultra Edition 2026',
    theme: 'light',
    accent: '#2d7ff9'
  },
  apps: APP_LIBRARY,
  files: {
    'Documents/README.txt': 'Bienvenue dans Zorin OS Lite Simulator.\nCette machine a été modifiée.
',
    'Documents/notes.txt': 'Objectif : simuler un vrai environnement de bureau Zorin OS Lite.\nVous pouvez l’étendre avec des commandes et des applications.',
    'Downloads/system-state.json': '{"status": "prêt"}'
  },
  notes: 'Votre système a été préconfiguré. Essayez les commandes: help, ls, install music, theme dark, export',
  wallpaper: 'light',
  installedApps: ['terminal', 'files', 'notes', 'browser', 'calculator', 'settings', 'appstore'],
  windows: []
};

const storageKey = 'zorin-lite-sim-state-v1';
const windowsLayer = document.getElementById('windowsLayer');
const desktopIcons = document.getElementById('desktopIcons');
const taskbarApps = document.getElementById('taskbarApps');
const startMenuItems = document.getElementById('startMenuItems');
const clockText = document.getElementById('clockText');
const wallpaper = document.getElementById('wallpaper');
const startMenu = document.getElementById('startMenu');

let appCounter = 0;
let currentUser = 'alhamad';

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      Object.assign(systemState, parsed);
      if (!systemState.apps) systemState.apps = APP_LIBRARY;
      if (!systemState.installedApps) systemState.installedApps = [...Object.keys(APP_LIBRARY).filter(k => APP_LIBRARY[k].installed)];
    } catch (err) {
      console.warn('Impossible de charger l’état enregistré, le système reprend les valeurs par défaut.', err);
    }
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(systemState));
}

function syncTheme() {
  document.documentElement.style.setProperty('--primary', systemState.system.accent);
  document.documentElement.style.setProperty('--primary-2', shadeColor(systemState.system.accent, 26));
  wallpaper.style.background = systemState.wallpaper === 'dark'
    ? 'linear-gradient(135deg, rgba(7, 15, 24, 0.76), rgba(22, 41, 58, 0.84)), radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 12%), linear-gradient(135deg, #0b1320 0%, #1d3148 55%, #0a1725 100%)'
    : 'linear-gradient(135deg, rgba(105, 155, 255, 0.18), rgba(10, 15, 22, 0.18)), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 12%), linear-gradient(135deg, #dfeaf9 0%, #aac0dd 25%, #7ca1cb 55%, #5c7fac 100%)';
}

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = (num >> 16) + amt;
  const g = ((num >> 8) & 0x00FF) + amt;
  const b = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (r < 255 ? r < 1 ? 0 : r : 255) * 0x10000 + (g < 255 ? g < 1 ? 0 : g : 255) * 0x100 + (b < 255 ? b < 1 ? 0 : b : 255)).toString(16).slice(1);
}

function bootSequence() {
  const bootScreen = document.getElementById('bootScreen');
  setTimeout(() => {
    bootScreen.classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
  }, 1800);
}

function login() {
  const username = document.getElementById('usernameInput').value.trim();
  const password = document.getElementById('passwordInput').value;
  if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
    currentUser = username;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
    renderDesktop();
    renderStartMenu();
    updateClock();
    setInterval(updateClock, 1000);
    saveState();
  } else {
    alert('Identifiants invalides. Utilisez: alhamad / 1234');
  }
}

function updateClock() {
  const now = new Date();
  clockText.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createWindow(appId, title, width = 480, height = 360) {
  const win = document.createElement('div');
  win.className = 'window';
  win.dataset.appId = appId;
  win.style.width = `${width}px`;
  win.style.height = `${height}px`;
  win.style.left = `${40 + (appCounter % 5) * 36}px`;
  win.style.top = `${30 + (appCounter % 4) * 28}px`;

  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerHTML = `<div class="window-title">${title}</div><div class="window-controls"><button class="min" title="Minimiser"></button><button class="max" title="Maximiser"></button><button class="close" title="Fermer"></button></div>`;

  const body = document.createElement('div');
  body.className = 'window-body';

  win.appendChild(header);
  win.appendChild(body);
  windowsLayer.appendChild(win);

  header.querySelector('.close').addEventListener('click', () => closeWindow(win));
  header.querySelector('.min').addEventListener('click', () => {
    win.style.display = 'none';
    updateTaskbar();
  });
  header.querySelector('.max').addEventListener('click', () => {
    if (win.style.width === 'calc(100vw - 80px)') {
      win.style.width = `${width}px`;
      win.style.height = `${height}px`;
    } else {
      win.style.width = 'calc(100vw - 80px)';
      win.style.height = 'calc(100vh - 110px)';
    }
  });

  enableDrag(win, header);
  appCounter += 1;
  updateTaskbar();
  return body;
}

function closeWindow(win) {
  win.remove();
  updateTaskbar();
}

function enableDrag(win, handle) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  handle.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = win.offsetLeft;
    initialTop = win.offsetTop;
    handle.setPointerCapture(e.pointerId);
  });

  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    win.style.left = `${Math.max(0, Math.min(window.innerWidth - 160, initialLeft + dx))}px`;
    win.style.top = `${Math.max(0, Math.min(window.innerHeight - 120, initialTop + dy))}px`;
  });

  handle.addEventListener('pointerup', () => {
    dragging = false;
  });
}

function renderDesktop() {
  desktopIcons.innerHTML = '';
  const shortcuts = [
    { app: 'files', label: 'Fichiers', icon: '📁' },
    { app: 'notes', label: 'Notes', icon: '📝' },
    { app: 'terminal', label: 'Terminal', icon: '⌨️' },
    { app: 'browser', label: 'Navigateur', icon: '🌐' },
    { app: 'appstore', label: 'App Store', icon: '🛍️' },
    { app: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  shortcuts.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'desktop-icon';
    el.setAttribute('data-app', item.app);
    el.innerHTML = `<div class="icon">${item.icon}</div><span>${item.label}</span>`;
    el.addEventListener('dblclick', () => openApp(item.app));
    desktopIcons.appendChild(el);
  });

  renderStartMenu();
  syncTheme();
}

function renderStartMenu() {
  startMenuItems.innerHTML = '';
  const apps = Object.keys(systemState.apps).filter((key) => systemState.apps[key].installed || key === 'appstore' || key === 'settings' || key === 'terminal');
  apps.forEach((key) => {
    const btn = document.createElement('button');
    btn.textContent = `${systemState.apps[key].icon} ${systemState.apps[key].name}`;
    btn.addEventListener('click', () => {
      openApp(key);
      startMenu.classList.add('hidden');
    });
    startMenuItems.appendChild(btn);
  });
}

function updateTaskbar() {
  taskbarApps.innerHTML = '';
  const visibleWindows = [...document.querySelectorAll('.window')];
  visibleWindows.forEach((win) => {
    const appName = win.dataset.appId || 'application';
    const btn = document.createElement('div');
    btn.className = 'taskbar-pill';
    btn.textContent = appName;
    btn.addEventListener('click', () => {
      const z = [...document.querySelectorAll('.window')].indexOf(win) + 10;
      win.style.zIndex = String(z);
      win.style.display = 'block';
    });
    taskbarApps.appendChild(btn);
  });
}

function openApp(appId) {
  if (!systemState.apps[appId] || !systemState.apps[appId].installed) {
    if (appId === 'files' || appId === 'notes' || appId === 'terminal' || appId === 'browser' || appId === 'calculator' || appId === 'settings' || appId === 'appstore') {
      systemState.apps[appId] = { ...systemState.apps[appId], installed: true };
    } else {
      alert(`L’application ${appId} n’est pas installée.`);
      return;
    }
  }

  if (appId === 'terminal') openTerminal();
  else if (appId === 'files') openFiles();
  else if (appId === 'notes') openNotes();
  else if (appId === 'browser') openBrowser();
  else if (appId === 'calculator') openCalculator();
  else if (appId === 'settings') openSettings();
  else if (appId === 'appstore') openAppStore();
  else if (appId === 'music') openMusic();
  else if (appId === 'office') openOffice();
  else if (appId === 'chat') openChat();
  else if (appId === 'games') openGames();
}

function openFiles() {
  const body = createWindow('files', 'Fichiers', 500, 370);
  const container = document.createElement('div');
  container.classList.add('app-window-body');

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  toolbar.innerHTML = '<button>Créer dossier</button><button>Nouvelle note</button>';

  const list = document.createElement('div');
  list.className = 'file-list';

  Object.keys(systemState.files).forEach((path) => {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.innerHTML = `<strong>${path}</strong><br><span>${systemState.files[path].slice(0, 40)}...</span><br><button>Ouvrir</button>`;
    card.querySelector('button').addEventListener('click', () => {
      alert(`${path}\n\n${systemState.files[path]}`);
    });
    list.appendChild(card);
  });

  container.appendChild(toolbar);
  container.appendChild(list);
  body.appendChild(container);
  updateTaskbar();
}

function openNotes() {
  const body = createWindow('notes', 'Notes', 480, 360);
  const textarea = document.createElement('textarea');
  textarea.className = 'notepad-editor';
  textarea.value = systemState.notes;
  textarea.addEventListener('input', () => {
    systemState.notes = textarea.value;
    saveState();
  });
  body.appendChild(textarea);
  updateTaskbar();
}

function openTerminal() {
  const body = createWindow('terminal', 'Terminal', 560, 400);

  const output = document.createElement('div');
  output.className = 'terminal-output';
  output.textContent = `Bienvenue sur ${systemState.system.name}.
Type "help" pour afficher les commandes.\n$ `;

  const input = document.createElement('input');
  input.className = 'terminal-input';
  input.placeholder = 'Entrez une commande...';

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim();
      if (!command) return;
      output.textContent += `${command}\n`;
      output.textContent += executeCommand(command) + '\n';
      output.scrollTop = output.scrollHeight;
      input.value = '';
      saveState();
    }
  });

  body.appendChild(output);
  body.appendChild(input);
  input.focus();
  updateTaskbar();
}

function executeCommand(command) {
  const parts = command.split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      return `Commandes disponibles:\nhelp\nls\npwd\nwhoami\ncat <fichier>\necho <texte>\nmkdir <nom>\ninstall <app>\nuninstall <app>\napps\nexport\ntheme <light|dark|blue|green>\nclear\nreboot\napt list\ninfo`;
    case 'ls':
      return Object.keys(systemState.files).join('\n') || 'Aucun fichier';
    case 'pwd':
      return '/home/' + currentUser;
    case 'whoami':
      return currentUser;
    case 'cat':
      return systemState.files[args[0]] || 'Fichier introuvable';
    case 'echo':
      return args.join(' ') || 'Aucune valeur';
    case 'mkdir':
      if (!args[0]) return 'Utilisation: mkdir <nom>';
      const dirName = args[0];
      systemState.files[`${dirName}/placeholder.txt`] = 'Nouveau dossier créé.';
      return `Dossier créé: ${dirName}`;
    case 'install':
      if (!args[0]) return 'Utilisation: install <app>';
      const appKey = args[0].toLowerCase();
      if (!systemState.apps[appKey]) return `Application inconnue: ${appKey}`;
      systemState.apps[appKey].installed = true;
      if (!systemState.installedApps.includes(appKey)) systemState.installedApps.push(appKey);
      return `Application installée: ${systemState.apps[appKey].name}`;
    case 'uninstall':
      if (!args[0]) return 'Utilisation: uninstall <app>';
      const key = args[0].toLowerCase();
      if (!systemState.apps[key]) return `Application inconnue: ${key}`;
      systemState.apps[key].installed = false;
      systemState.installedApps = systemState.installedApps.filter((item) => item !== key);
      return `Application désinstallée: ${systemState.apps[key].name}`;
    case 'apps':
      return Object.keys(systemState.apps).map((k) => `${k}: ${systemState.apps[k].installed ? 'installée' : 'absente'}`).join('\n');
    case 'apt':
      if (args[0] === 'list') return 'Available packages:\n- music\n- office\n- chat\n- games';
      return 'Commande apt non prise en charge directement';
    case 'theme':
      const mode = (args[0] || '').toLowerCase();
      if (mode === 'dark') {
        systemState.system.theme = 'dark';
        systemState.wallpaper = 'dark';
      } else if (mode === 'light') {
        systemState.system.theme = 'light';
        systemState.wallpaper = 'light';
      } else if (mode === 'blue') {
        systemState.system.accent = '#2d7ff9';
      } else if (mode === 'green') {
        systemState.system.accent = '#36b37e';
      } else {
        return 'Utilisation: theme <light|dark|blue|green>';
      }
      syncTheme();
      return `Thème appliqué: ${mode}`;
    case 'clear':
      return 'clear';
    case 'export':
      exportSystemState();
      return 'Le système a été exporté dans le navigateur. Vérifiez le téléchargement.';
    case 'reboot':
      document.getElementById('desktop').classList.add('hidden');
      document.getElementById('bootScreen').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('bootScreen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
      }, 1200);
      return 'Redémarrage du système...';
    case 'info':
      return `${systemState.system.name} ${systemState.system.version}\nUtilisateur: ${currentUser}\nAccent: ${systemState.system.accent}`;
    default:
      return `Commande inconnue: ${cmd}. Tapez "help".`;
  }
}

function openBrowser() {
  const body = createWindow('browser', 'Navigateur', 620, 420);
  body.classList.add('browser-page');

  const bar = document.createElement('div');
  bar.className = 'browser-bar';
  bar.innerHTML = '<input value="https://zorin-os-lite.local" /><button>Go</button>';

  const content = document.createElement('div');
  content.className = 'browser-content';
  content.innerHTML = `
    <h3>Bienvenue sur le navigateur Zorin</h3>
    <p>Cette page simule un navigateur web de bureau.</p>
    <p>Vous pouvez modifier le système à partir du terminal, installer des applications, puis télécharger la configuration complète.</p>
    <p>Le système est prêt pour personnalisation.</p>
  `;

  body.appendChild(bar);
  body.appendChild(content);
  updateTaskbar();
}

function openCalculator() {
  const body = createWindow('calculator', 'Calculatrice', 280, 360);
  const input = document.createElement('input');
  input.type = 'text';
  input.value = '0';
  input.style.width = '100%';
  input.style.padding = '12px';
  input.style.fontSize = '1.5rem';
  input.style.border = '1px solid rgba(255,255,255,0.08)';
  input.style.background = 'rgba(255,255,255,0.04)';
  input.style.color = 'white';
  input.style.borderRadius = '10px';
  body.appendChild(input);

  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  grid.style.gap = '8px';
  grid.style.marginTop = '12px';

  buttons.forEach((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.padding = '12px';
    btn.style.borderRadius = '10px';
    btn.style.border = 'none';
    btn.style.background = 'rgba(255,255,255,0.05)';
    btn.style.color = 'white';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      if (label === '=') {
        try {
          input.value = Function(`"use strict"; return (${input.value})`)();
        } catch {
          input.value = 'Erreur';
        }
      } else {
        input.value = input.value === '0' ? label : input.value + label;
      }
    });
    grid.appendChild(btn);
  });

  body.appendChild(grid);
  updateTaskbar();
}

function openSettings() {
  const body = createWindow('settings', 'Paramètres', 540, 360);
  const wrap = document.createElement('div');
  wrap.className = 'settings-grid';

  const accentCard = document.createElement('div');
  accentCard.className = 'setting-card';
  accentCard.innerHTML = `
    <label>Couleur d'accent</label>
    <input type="color" value="${systemState.system.accent}" id="accentPicker" />
  `;
  accentCard.querySelector('#accentPicker').addEventListener('input', (e) => {
    systemState.system.accent = e.target.value;
    syncTheme();
    saveState();
  });

  const themeCard = document.createElement('div');
  themeCard.className = 'setting-card';
  themeCard.innerHTML = `
    <label>Thème</label>
    <select id="themeSelect">
      <option value="light" ${systemState.system.theme === 'light' ? 'selected' : ''}>Clair</option>
      <option value="dark" ${systemState.system.theme === 'dark' ? 'selected' : ''}>Sombre</option>
    </select>
  `;
  themeCard.querySelector('#themeSelect').addEventListener('change', (e) => {
    systemState.system.theme = e.target.value;
    systemState.wallpaper = e.target.value;
    syncTheme();
    saveState();
  });

  const userCard = document.createElement('div');
  userCard.className = 'setting-card';
  userCard.innerHTML = `
    <label>Nom de l'ordinateur</label>
    <input type="text" value="${systemState.system.name}" id="systemNameInput" />
  `;
  userCard.querySelector('#systemNameInput').addEventListener('input', (e) => {
    systemState.system.name = e.target.value || 'Zorin OS Lite';
    saveState();
  });

  wrap.appendChild(accentCard);
  wrap.appendChild(themeCard);
  wrap.appendChild(userCard);
  body.appendChild(wrap);
  updateTaskbar();
}

function openAppStore() {
  const body = createWindow('appstore', 'Centre d’applications', 620, 420);
  const panel = document.createElement('div');
  panel.className = 'store-grid';

  Object.keys(systemState.apps).forEach((key) => {
    const app = systemState.apps[key];
    if (!['terminal', 'files', 'notes', 'browser', 'calculator', 'settings', 'appstore'].includes(key) || true) {
      const card = document.createElement('div');
      card.className = 'store-card';
      card.innerHTML = `
        <strong>${app.icon} ${app.name}</strong><br>
        <span>${app.installed ? 'Installée' : 'Disponible'}</span><br>
        <button>${app.installed ? 'Désinstaller' : 'Installer'}</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        if (app.installed) {
          systemState.apps[key].installed = false;
          systemState.installedApps = systemState.installedApps.filter((item) => item !== key);
        } else {
          systemState.apps[key].installed = true;
          if (!systemState.installedApps.includes(key)) systemState.installedApps.push(key);
        }
        saveState();
        renderStartMenu();
        openAppStore();
      });
      panel.appendChild(card);
    }
  });

  body.appendChild(panel);
  updateTaskbar();
}

function openMusic() {
  const body = createWindow('music', 'Lecteur', 420, 220);
  body.innerHTML = '<div class="panel-box"><p>Lecture audio simulée</p><p>Exemple de musique Zorin.</p><button>Lecture</button></div>';
  updateTaskbar();
}

function openOffice() {
  const body = createWindow('office', 'Bureau', 460, 260);
  body.innerHTML = '<div class="panel-box"><p>Suite bureautique simulée.</p><p>Votre système contient désormais un environnement de productivité.</p></div>';
  updateTaskbar();
}

function openChat() {
  const body = createWindow('chat', 'Messagerie', 460, 300);
  body.innerHTML = '<div class="panel-box"><p>Messages internes du système</p><p>Prêt pour les conversations entre utilisateurs.</p></div>';
  updateTaskbar();
}

function openGames() {
  const body = createWindow('games', 'Jeux', 380, 220);
  body.innerHTML = '<div class="panel-box"><p>Mini-jeux simulés</p><p>Exemple : jeu de logique, puzzle, etc.</p></div>';
  updateTaskbar();
}

function exportSystemState() {
  const exportData = {
    system: systemState.system,
    installedApps: systemState.installedApps,
    files: systemState.files,
    notes: systemState.notes,
    wallpaper: systemState.wallpaper,
    user: currentUser
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zorin-lite-modified-system.json';
  a.click();
  URL.revokeObjectURL(url);

  const zip = new JSZip();
  zip.file('system.json', JSON.stringify(exportData, null, 2));
  zip.file('README.txt', 'Système modifié - Zorin OS Lite Simulator\n');
  zip.generateAsync({ type: 'blob' }).then((content) => {
    const zipUrl = URL.createObjectURL(content);
    const zipLink = document.createElement('a');
    zipLink.href = zipUrl;
    zipLink.download = 'zorin-lite-modified-package.zip';
    zipLink.click();
    URL.revokeObjectURL(zipUrl);
  });
}

function attachEvents() {
  document.getElementById('loginButton').addEventListener('click', login);
  document.getElementById('startButton').addEventListener('click', () => {
    startMenu.classList.toggle('hidden');
  });
  document.getElementById('downloadSystemBtn').addEventListener('click', exportSystemState);
  document.getElementById('saveSystemBtn').addEventListener('click', () => {
    saveState();
    alert('Système sauvegardé dans le navigateur.');
  });
  document.getElementById('shutdownBtn').addEventListener('click', () => {
    document.getElementById('desktop').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('usernameInput').value = DEFAULT_USER.username;
    document.getElementById('passwordInput').value = DEFAULT_USER.password;
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#startButton') && !e.target.closest('.start-menu')) {
      startMenu.classList.add('hidden');
    }
  });
}

loadState();
attachEvents();
bootSequence();
syncTheme();

window.addEventListener('beforeunload', saveState);
