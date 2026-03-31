(function () {
  'use strict';

  if (window._freeTorrServerLoaded) return;
  window._freeTorrServerLoaded = true;

  var PLUGIN_VERSION = '2.0.0';
  var WORKER_URL = 'https://your-worker.workers.dev/';
  var WORKER_TOKEN = 'tsk_live_b7Qx9L2pZr8VdK4mN6sF1HcT';

  Lampa.Platform.tv();

  var _btnSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve" fill="currentColor"><g><g><rect x="232.254" y="69.157" style="fill:#718176;" width="42.982" height="377.465"></rect><polygon style="fill:#718176;" points="56.146,446.588 76.861,489.564 232.234,489.564 232.234,446.588"></polygon><polygon style="fill:#718176;" points="275.21,446.588 275.21,489.564 435.111,489.564 455.826,446.588"></polygon><rect x="232.234" y="446.588" style="fill:#979696;" width="42.977" height="42.977"></rect><path style="fill:#718176;" d="M511.972,7.837v105.05c0,4.315-3.485,7.8-7.8,7.8H7.8c-4.315,0-7.8-3.485-7.8-7.8V7.837c0-4.315,3.485-7.799,7.8-7.799h496.372C508.487,0.037,511.972,3.522,511.972,7.837z"></path><path style="fill:#718176;" d="M511.972,148.318v105.05c0,4.315-3.485,7.883-7.8,7.883H7.8c-4.315,0-7.8-3.568-7.8-7.883v-105.05c0-4.315,3.485-7.8,7.8-7.8h496.372C508.487,140.518,511.972,144.003,511.972,148.318z"></path><path style="fill:#718176;" d="M511.972,288.882v105.05c0,4.315-3.485,7.799-7.8,7.799H7.8c-4.315,0-7.8-3.484-7.8-7.799v-105.05c0-4.314,3.485-7.799,7.8-7.799h496.372C508.487,281.082,511.972,284.568,511.972,288.882z"></path><path style="fill:#FFFFFF;" d="M492.427,6.264H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.309,13.31,13.309h472.882c7.351,0,13.31-5.959,13.31-13.309V19.573C505.737,12.222,499.778,6.264,492.427,6.264z"></path><path style="fill:#FFFFFF;" d="M492.427,146.79H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31V160.1C505.737,152.749,499.778,146.79,492.427,146.79z"></path><path style="fill:#FFFFFF;" d="M492.427,287.318H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31v-81.539C505.737,293.276,499.778,287.318,492.427,287.318z"></path><rect x="225.104" y="49.742" style="fill:#979696;" width="100.213" height="21.202"></rect><circle style="fill:#43B471;" cx="369.338" cy="61.198" r="19.487"></circle><circle style="fill:#D3D340;" cx="416.663" cy="61.198" r="19.487"></circle><circle style="fill:#D15075;" cx="463.989" cy="61.198" r="19.487"></circle><rect x="225.104" y="190.269" style="fill:#979696;" width="100.213" height="21.202"></rect><circle style="fill:#43B471;" cx="369.338" cy="201.725" r="19.487"></circle><circle style="fill:#D3D340;" cx="416.663" cy="201.725" r="19.487"></circle><circle style="fill:#D15075;" cx="463.989" cy="201.725" r="19.487"></circle><rect x="225.104" y="330.796" style="fill:#979696;" width="100.213" height="21.202"></rect><circle style="fill:#43B471;" cx="369.338" cy="342.252" r="19.487"></circle><circle style="fill:#D3D340;" cx="416.663" cy="342.252" r="19.487"></circle><circle style="fill:#D15075;" cx="463.989" cy="342.252" r="19.487"></circle></g></g></svg>';

  var _fieldSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve" width="256px" height="256px" fill="#000000"><g><g><rect x="232.254" y="69.157" style="fill:#718176;" width="42.982" height="377.465"></rect><polygon style="fill:#718176;" points="56.146,446.588 76.861,489.564 232.234,489.564 232.234,446.588"></polygon><polygon style="fill:#718176;" points="275.21,446.588 275.21,489.564 435.111,489.564 455.826,446.588"></polygon><rect x="232.234" y="446.588" style="fill:#979696;" width="42.977" height="42.977"></rect><path style="fill:#718176;" d="M511.972,7.837v105.05c0,4.315-3.485,7.8-7.8,7.8H7.8c-4.315,0-7.8-3.485-7.8-7.8V7.837c0-4.315,3.485-7.799,7.8-7.799h496.372C508.487,0.037,511.972,3.522,511.972,7.837z"></path><path style="fill:#718176;" d="M511.972,148.318v105.05c0,4.315-3.485,7.883-7.8,7.883H7.8c-4.315,0-7.8-3.568-7.8-7.883v-105.05c0-4.315,3.485-7.8,7.8-7.8h496.372C508.487,140.518,511.972,144.003,511.972,148.318z"></path><path style="fill:#718176;" d="M511.972,288.882v105.05c0,4.315-3.485,7.799-7.8,7.799H7.8c-4.315,0-7.8-3.484-7.8-7.799v-105.05c0-4.314,3.485-7.799,7.8-7.799h496.372C508.487,281.082,511.972,284.568,511.972,288.882z"></path><path style="fill:#FFFFFF;" d="M492.427,6.264H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.309,13.31,13.309h472.882c7.351,0,13.31-5.959,13.31-13.309V19.573C505.737,12.222,499.778,6.264,492.427,6.264z"></path><path style="fill:#FFFFFF;" d="M492.427,146.79H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31V160.1C505.737,152.749,499.778,146.79,492.427,146.79z"></path><path style="fill:#FFFFFF;" d="M492.427,287.318H19.545c-7.351,0-13.31,5.959-13.31,13.31v81.539c0,7.351,5.959,13.31,13.31,13.31h472.882c7.351,0,13.31-5.959,13.31-13.31v-81.539C505.737,293.276,499.778,287.318,492.427,287.318z"></path><rect x="225.104" y="49.742" style="fill:#979696;" width="100.213" height="21.202"></rect><circle style="fill:#43B471;" cx="369.338" cy="61.198" r="19.487"></circle><circle style="fill:#D3D340;" cx="416.663" cy="61.198" r="19.487"></circle><circle style="fill:#D15075;" cx="463.989" cy="61.198" r="19.487"></circle><rect x="225.104" y="190.269" style="fill:#979696;" width="100.213" height="21.202"></rect><circle style="fill:#43B471;" cx="369.338" cy="201.725" r="19.487"></circle><circle style="fill:#D3D340;" cx="416.663" cy="201.725" r="19.487"></circle><circle style="fill:#D15075;" cx="463.989" cy="201.725" r="19.487"></circle><rect x="225.104" y="330.796" style="fill:#979696;" width="100.213" height="21.202"></rect><circle style="fill:#43B471;" cx="369.338" cy="342.252" r="19.487"></circle><circle style="fill:#D3D340;" cx="416.663" cy="342.252" r="19.487"></circle><circle style="fill:#D15075;" cx="463.989" cy="342.252" r="19.487"></circle></g></g></svg>';

  var _fieldName =
    '<div class="settings-folder" style="padding:0!important">' +
    '<div style="width:1.3em;height:1.3em;padding-right:.1em">' + _fieldSvg + '</div>' +
    '<div style="font-size:1.0em"><div style="padding:0.3em 0.3em; padding-top:0;">' +
    '<div style="background:#d99821; padding:0.5em; border-radius:0.4em;">' +
    '<div style="line-height:0.3;">Free TorrServer</div>' +
    '</div></div></div></div>';

  var FALLBACK_SERVERS = [
    'http://185.235.218.109:8090',
    'http://95.174.93.5:8090',
    'http://77.110.122.115:8090',
    'http://77.238.228.41:8290',
    'http://91.192.105.69:8090',
    'http://195.64.231.192:8090',
    'http://193.228.128.112/ts',
    'http://31.129.234.181/ts',
    'http://78.40.195.218:9118/ts',
    'http://45.144.53.25:37940'
  ];

  var activityListenerAttached = false;
  var torrentsObserver = null;
  var buttonInited = false;
  var changingNow = false;

  function normalizeUrl(url) {
    if (!url) return '';
    url = String(url).trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
    return url.replace(/\/+$/, '');
  }

  function getButtonMode() {
    return String(Lampa.Storage.get('switch_server_button', '2'));
  }

  function getTorrservMode() {
    return String(Lampa.Storage.get('torrserv', '1'));
  }

  function setButtonVisible(visible) {
    setTimeout(function () {
      var btn = $('#SWITCH_SERVER');
      if (!btn.length) return;
      if (visible) btn.show();
      else btn.hide();
    }, 10);
  }

  function applyButtonVisibility() {
    if (getTorrservMode() === '0') {
      setButtonVisible(false);
      return;
    }

    var mode = getButtonMode();
    var component = '';
    try {
      component = Lampa.Activity.active().component || '';
    } catch (e) {}

    if (mode === '1') {
      setButtonVisible(false);
      return;
    }

    if (mode === '2') {
      setButtonVisible(component === 'torrents');
      return;
    }

    if (mode === '3') {
      setButtonVisible(true);
      return;
    }

    setButtonVisible(false);
  }

  function ensureActivityListener() {
    if (activityListenerAttached) return;
    activityListenerAttached = true;

    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name !== 'activity') return;
      applyButtonVisibility();
      handleTorrentsObserver();
    });
  }

  function randomFallbackUrl() {
    var url = FALLBACK_SERVERS[Math.floor(Math.random() * FALLBACK_SERVERS.length)];
    return normalizeUrl(url);
  }

  function fetchWorkerServer() {
    return new Promise(function (resolve, reject) {
      if (!WORKER_URL) {
        reject(new Error('empty worker url'));
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', WORKER_URL, true);
      xhr.timeout = 5000;
      xhr.setRequestHeader('x-api-key', WORKER_TOKEN);

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status >= 200 && xhr.status < 300) {
          var text = (xhr.responseText || '').trim();
          var url = '';

          try {
            var data = JSON.parse(text);
            url = data.url || data.server || data.address || '';
          } catch (e) {
            url = text;
          }

          url = normalizeUrl(url);

          if (!url) {
            reject(new Error('empty worker response'));
            return;
          }

          resolve(url);
        } else {
          reject(new Error('worker status ' + xhr.status));
        }
      };

      xhr.onerror = function () {
        reject(new Error('worker network error'));
      };

      xhr.ontimeout = function () {
        reject(new Error('worker timeout'));
      };

      xhr.send();
    });
  }

  function setServerUrl(url) {
    url = normalizeUrl(url);
    if (!url) return false;

    Lampa.Storage.set('torrserver_url_two', url);
    Lampa.Storage.set('torrserver_use_link', 'two');
    return true;
  }

  function changeServer(silent) {
    if (changingNow) return;
    changingNow = true;

    fetchWorkerServer()
      .then(function (url) {
        setServerUrl(url);
        if (!silent) Lampa.Noty.show('TorrServer изменён');
      })
      .catch(function () {
        var fallback = randomFallbackUrl();
        if (fallback) {
          setServerUrl(fallback);
          if (!silent) Lampa.Noty.show('TorrServer изменён (резерв)');
        } else {
          if (!silent) Lampa.Noty.show('Ошибка запроса');
        }
      })
      .then(function () {
        changingNow = false;
      });
  }

  function destroyObserver() {
    if (torrentsObserver) {
      try {
        torrentsObserver.disconnect();
      } catch (e) {}
      torrentsObserver = null;
    }
  }

  function handleTorrentsObserver() {
    if (getTorrservMode() !== '1') {
      destroyObserver();
      return;
    }

    var component = '';
    try {
      component = Lampa.Activity.active().component || '';
    } catch (e) {}

    if (component !== 'torrents') {
      destroyObserver();
      return;
    }

    if (torrentsObserver) return;

    torrentsObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (!m.target || !$(m.target).is('.modal__title')) return;

        var title = $('.modal__title').text().trim();
        if (title !== Lampa.Lang.translate('torrent_error_connect')) return;

        $('.torrent-checklist__progress-bar > div').remove();
        $('.torrent-checklist__progress-steps').remove();
        $('.torrent-checklist__list > li').remove();

        var descr = $('.torrent-checklist__descr');
        if (descr.length) {
          descr.html('Сервер не ответил, нажмите кнопку снизу для его замены на другой.');
        }

        var btn = $('.modal .simple-button');
        if (btn.length) {
          btn.html('Сменить сервер');
          btn.off('hover:enter hover:click hover:touch.free_torrserver_fix');
          btn.on('hover:enter hover:click hover:touch', function () {
            $('.modal').remove();
            changeServer(false);
            Lampa.Activity.back('content');
          });
        }
      });
    });

    torrentsObserver.observe(document.body, { childList: true, subtree: true });
  }

  function initButton() {
    if (buttonInited) return;
    buttonInited = true;

    var btnHtml = '<div id="SWITCH_SERVER" class="head__action selector switch-screen" title="Сменить TorrServer">' + _btnSvg + '</div>';

    var actions = $('#app > div.head > div > div.head__actions');
    if (!actions.length) return;

    if (!$('#SWITCH_SERVER').length) {
      actions.append(btnHtml);
      $('#SWITCH_SERVER').insertAfter('div[class="head__action selector open--settings"]');
    }

    $('#SWITCH_SERVER').off('hover:enter hover:click hover:touch');
    $('#SWITCH_SERVER').on('hover:enter hover:click hover:touch', function () {
      changeServer(false);
    });

    ensureActivityListener();
    applyButtonVisibility();
    handleTorrentsObserver();
  }

  function boot() {
    ensureActivityListener();

    if (localStorage.getItem('switch_server_button') === null) {
      Lampa.Storage.set('switch_server_button', '2');
    }

    if (localStorage.getItem('torrserv') === null) {
      Lampa.Storage.set('torrserv', '1');
    }

    if (getTorrservMode() === '1') {
      Lampa.Storage.set('torrserver_url_two', '');
      Lampa.Storage.set('torrserver_use_link', 'two');
      setTimeout(function () {
        changeServer(true);
      }, 1000);
    } else {
      Lampa.Storage.set('torrserver_use_link', 'one');
    }

    if (Lampa.Platform.is('android')) {
      Lampa.Storage.set('internal_torrclient', true);
    }

    applyButtonVisibility();
    handleTorrentsObserver();
  }

  Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
      name: 'torrserv',
      type: 'select',
      values: {
        0: 'Свой вариант',
        1: 'Автовыбор'
      },
      default: 1
    },
    field: {
      name: _fieldName,
      description: 'Автовыбор сервера через Cloudflare Worker'
    },
    onChange: function (value) {
      if (String(value) === '0') {
        Lampa.Storage.set('torrserver_use_link', 'one');
        Lampa.Storage.set('torrserver_url_two', '');
        applyButtonVisibility();
        destroyObserver();
        Lampa.Settings.update();
        return;
      }

      if (String(value) === '1') {
        Lampa.Storage.set('torrserver_use_link', 'two');
        changeServer(false);
        applyButtonVisibility();
        handleTorrentsObserver();
        Lampa.Settings.update();
      }
    },
    onRender: function (item) {
      setTimeout(function () {
        if ($('div[data-name="torrserv"]').length > 1) item.hide();

        $('.settings-param__name', item).css('color', '#ffffff');
        $('div[data-name="torrserv"]').insertAfter('div[data-name="torrserver_use_link"]');

        if (Lampa.Storage.field('torrserv') == '1') {
          $('div[data-name="torrserver_url_two"]').hide();
          $('div[data-name="torrserver_url"]').hide();
          $('div[data-name="torrserver_use_link"]').hide();
          $('div > span:contains("Ссылки")').remove();
        }

        if (Lampa.Storage.field('torrserv') == '0') {
          $('div[data-name="torrserver_url_two"]').hide();
          $('div[data-name="torrserver_use_link"]').hide();
          $('div[data-name="switch_server_button"]').hide();
        }
      }, 0);
    }
  });

  Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
      name: 'switch_server_button',
      type: 'select',
      values: {
        1: 'Не показывать',
        2: 'Показывать только в торрентах',
        3: 'Показывать всегда'
      },
      default: '2'
    },
    field: {
      name: 'Кнопка для смены сервера',
      description: 'Отображение кнопки быстрой смены TorrServer в верхнем баре'
    },
    onChange: function () {
      applyButtonVisibility();
    },
    onRender: function () {
      setTimeout(function () {
        $('div[data-name="switch_server_button"]').insertAfter('div[data-name="torrserver_url"]');
      }, 0);
    }
  });

  var _wait = setInterval(function () {
    if (typeof Lampa !== 'undefined') {
      clearInterval(_wait);
      boot();
    }
  }, 200);

  if (window.appready) {
    initButton();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') initButton();
    });
  }

  console.log('Free TorrServer plugin loaded:', PLUGIN_VERSION);
})();
