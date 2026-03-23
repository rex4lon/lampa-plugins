(function () {
    "use strict";

    Lampa.Platform.tv();

    // === ТВОИ СЕРВЕРА ===
    var servers = [
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

    var current = 0;

    function nextServer() {
        current = (current + 1) % servers.length;
        return servers[current];
    }

    function checkServer(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.timeout = 3000;

        xhr.onload = function () {
            callback(true);
        };

        xhr.onerror = function () {
            callback(false);
        };

        xhr.ontimeout = function () {
            callback(false);
        };

        try {
            xhr.send();
        } catch (e) {
            callback(false);
        }
    }

    function switchServer() {
        var tries = 0;

        function go() {
            if (tries >= servers.length) {
                Lampa.Noty.show('Нет доступных серверов');
                return;
            }

            var server = nextServer();

            checkServer(server, function (ok) {
                if (ok) {
                    localStorage.setItem('torrserver_url', server);
                    Lampa.Noty.show('Сервер: ' + server);
                } else {
                    tries++;
                    go();
                }
            });
        }

        go();
    }

    // === SVG ИКОНКА (как в оригинале) ===
    var icon = `
    <svg viewBox="0 0 512 512" width="24" height="24" fill="currentColor">
        <rect x="232" y="69" width="43" height="377" fill="#718176"/>
        <rect x="232" y="446" width="43" height="43" fill="#979696"/>
        <circle cx="369" cy="61" r="19" fill="#43B471"/>
        <circle cx="416" cy="61" r="19" fill="#D3D340"/>
        <circle cx="463" cy="61" r="19" fill="#D15075"/>
    </svg>`;

    // === КНОПКА В ХЕДЕРЕ ===
    function addButton() {
        var observer = setInterval(function () {
            var head = document.querySelector('.head__actions');

            if (head && !document.getElementById('SWITCH_SERVER')) {
                clearInterval(observer);

                var btn = document.createElement('div');
                btn.id = 'SWITCH_SERVER';
                btn.className = 'head__action selector switch-screen';
                btn.innerHTML = icon;

                btn.onclick = function () {
                    switchServer();
                };

                head.appendChild(btn);
            }
        }, 500);
    }

    // === ПУНКТ В НАСТРОЙКАХ (как оригинал) ===
    function addSettings() {
        Lampa.Settings.add({
            component: 'torrserver',
            name: 'Free TorrServer',
            description: 'Кнопка для смены сервера',
            onRender: function (item) {
                item.on('hover:enter hover:click hover:touch', function () {
                    switchServer();
                });
            }
        });
    }

    // === ЗАПУСК ===
    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            addButton();
            addSettings();
        }
    });

})();
