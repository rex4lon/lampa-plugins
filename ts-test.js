(function () {
  'use strict';

  if (!window.Lampa) return;

  Lampa.Platform.tv();

  const STORAGE_KEY = 'torrserver_url';

  const SERVERS = [
    '127.0.0.1:8090',
    'localhost:8090',

    '185.235.218.109:8090',
    '95.174.93.5:8090',
    '77.110.122.115:8090',
    '77.238.228.41:8290',
    '91.192.105.69:8090',
    '195.64.231.192:8090',
    '193.228.128.112/ts',
    '31.129.234.181/ts',
    '78.40.195.218:9118/ts',
    '45.144.53.25:37940'
  ];

  // =========================
  // HELPERS
  // =========================
  function normalize(url) {
    return url.startsWith('http') ? url : 'http://' + url;
  }

  function getServer() {
    return localStorage.getItem(STORAGE_KEY) || normalize(SERVERS[0]);
  }

  function setServer(url) {
    const normalized = normalize(url);

    localStorage.setItem(STORAGE_KEY, normalized);

    // 🔥 ВАЖНО: применяем в Lampa
    Lampa.Storage.set('torrserver_url', normalized);

    notify('Сервер: ' + normalized);
  }

  function notify(text) {
    Lampa.Noty.show(text);
  }

  // =========================
  // SWITCH
  // =========================
  function switchServer() {
    const current = getServer();

    let index = SERVERS.findIndex(s => normalize(s) === current);

    if (index === -1) index = 0;

    index = (index + 1) % SERVERS.length;

    setServer(SERVERS[index]);
  }

  // =========================
  // BUTTON
  // =========================
  function addButton() {
    const observer = new MutationObserver(() => {
      const header = document.querySelector('.head__actions');

      if (header && !document.getElementById('torr_switch')) {
        const btn = document.createElement('div');

        btn.id = 'torr_switch';
        btn.className = 'head__action selector';

        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"/>
          </svg>
        `;

        // ✅ обычный click (самый стабильный)
        btn.onclick = switchServer;

        header.appendChild(btn);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // =========================
  // SETTINGS (реально рабочие)
  // =========================
  function addSettings() {
    Lampa.SettingsApi.addComponent({
      component: 'torrserver',
      name: 'TorrServer'
    });

    Lampa.SettingsApi.addParam({
      component: 'torrserver',
      param: {
        name: 'URL TorrServer',
        type: 'input',
        default: getServer()
      },
      onChange: (value) => {
        setServer(value);
      }
    });
  }

  // =========================
  // INIT
  // =========================
  function init() {
    addButton();
    addSettings();

    // применяем текущий сервер при старте
    setServer(getServer());
  }

  Lampa.Listener.follow('app', function (e) {
    if (e.type === 'ready') {
      init();
    }
  });

})();
