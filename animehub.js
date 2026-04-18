(function () {
  'use strict';

  if (window.animehub_plugin_v1) return;
  window.animehub_plugin_v1 = true;

  function tr(key, fallback) {
    try {
      if (window.Lampa && Lampa.Lang && Lampa.Lang.translate) {
        var value = Lampa.Lang.translate(key);
        if (value && value !== key) return value;
      }
    } catch (e) {}
    return fallback || key;
  }

  function getTmdbKey() {
    try {
      if (window.Lampa && Lampa.TMDB && typeof Lampa.TMDB.key === 'function') {
        return (Lampa.TMDB.key() || '').toString().trim();
      }
    } catch (e) {}
    return '';
  }

  function storageGet(name, fallback) {
    try {
      return Lampa.Storage.get(name, fallback);
    } catch (e) {
      return fallback;
    }
  }

  function pad2(value) {
    var text = String(value || '');
    return text.length < 2 ? '0' + text : text;
  }

  function formatDate(date) {
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function addDays(date, days) {
    var next = new Date(date.getTime());
    next.setDate(next.getDate() + days);
    return next;
  }

  function normalizeItems(items) {
    var list = Array.isArray(items) ? items : [];
    var allowLangs = { ja: true, ko: true, zh: true };
    var allowCountries = { JP: true, KR: true, CN: true };

    return list.filter(function (item) {
      return item && item.id;
    }).filter(function (item) {
      var lang = (item.original_language || '').toString().toLowerCase();
      if (allowLangs[lang]) return true;

      var countries = Array.isArray(item.origin_country) ? item.origin_country : [];
      for (var i = 0; i < countries.length; i++) {
        var code = (countries[i] || '').toString().toUpperCase();
        if (allowCountries[code]) return true;
      }

      if (!lang && countries.length === 0) return true;
      return false;
    }).map(function (item) {
      if (!Array.isArray(item.genre_ids)) item.genre_ids = [];
      if (!Array.isArray(item.genres)) item.genres = [];
      if (!item.media_type) item.media_type = 'tv';
      if (!item.method) item.method = 'tv';
      item.source = 'tmdb';

      if (!item.poster_path && item.backdrop_path) item.poster_path = item.backdrop_path;
      if (!item.backdrop_path && item.poster_path) item.backdrop_path = item.poster_path;

      return item;
    });
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ensureTopRowStyle() {
    if (document.getElementById('animehub-top-style')) return;
    var style = document.createElement('style');
    style.id = 'animehub-top-style';
    style.textContent = '' +
      '.animehub-top-row .card{position:relative!important;width:52vw!important;max-width:58em!important;height:22em!important;border-radius:1em!important;overflow:hidden!important;background-size:cover!important;background-position:center!important;box-shadow:0 0 20px rgba(0,0,0,.35)!important;}' +
      '.animehub-top-row .card-more{display:none!important;}' +
      '.animehub-top-card{position:relative!important;}' +
      '.animehub-top-overlay{position:absolute;inset:0;pointer-events:none;display:flex;flex-direction:column;justify-content:flex-end;padding:1.4em;background:linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.55) 45%,rgba(0,0,0,.1) 100%);}' +
      '.animehub-top-title{font-size:2.1em;font-weight:700;line-height:1.1;color:#fff;max-width:88%;margin-bottom:.25em;text-shadow:0 2px 8px rgba(0,0,0,.6);}' +
      '.animehub-top-desc{font-size:1.35em;line-height:1.25;color:#f1f1f1;max-width:70%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 1px 5px rgba(0,0,0,.6);}' +
      '.animehub-top-rate{position:absolute;right:.6em;bottom:.45em;font-size:2em;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.6);}' +
      '.animehub-top-row .animehub-top-card .card__title{display:none!important;}' +
      '@media (max-width:1280px){.animehub-top-row .card{width:70vw!important;height:19em!important}.animehub-top-title{font-size:1.65em}.animehub-top-desc{font-size:1.15em;max-width:80%}}';
    document.head.appendChild(style);
  }

  function getCardMovie(cardNode) {
    var card = $(cardNode);
    return cardNode.heroMovieData || card.data('item') || cardNode.card_data || cardNode.item || null;
  }

  function isAnimeHubScreen() {
    try {
      var href = decodeURIComponent(String(window.location && window.location.href || '')).toLowerCase();
      if (href.indexOf('component=animehub_main') >= 0) return true;
      if (href.indexOf('аніме - tmdb') >= 0 || href.indexOf('anime - tmdb') >= 0) return true;
    } catch (e) {}

    var titleNode = document.querySelector('.head__title,.activity__title,.full-start__title');
    var titleText = titleNode ? String(titleNode.textContent || '').toLowerCase() : '';
    var animeText = tr('menu_anime', 'anime').toLowerCase();
    return titleText.indexOf(animeText) >= 0 && titleText.indexOf('tmdb') >= 0;
  }

  function resetTopDecorations() {
    var rows = document.querySelectorAll('.animehub-top-row');
    for (var i = 0; i < rows.length; i++) rows[i].classList.remove('animehub-top-row');

    var cards = document.querySelectorAll('.animehub-top-card');
    for (var c = 0; c < cards.length; c++) {
      cards[c].classList.remove('animehub-top-card');
      var overlays = cards[c].querySelectorAll('.animehub-top-overlay');
      for (var j = 0; j < overlays.length; j++) overlays[j].remove();
    }
  }

  function decorateTopRowCards() {
    if (!isAnimeHubScreen()) {
      resetTopDecorations();
      return;
    }

    ensureTopRowStyle();

    var topTitle = tr('title_in_top', 'Top').toLowerCase().trim();
    var lines = document.querySelectorAll('.items-line');
    var topLine = null;

    for (var i = 0; i < lines.length; i++) {
      var titleNode = lines[i].querySelector('.items-line__title,.items__title,.row__title');
      var current = titleNode ? titleNode.textContent.toLowerCase().trim() : '';
      if (current === topTitle) {
        topLine = lines[i];
        break;
      }
    }

    if (!topLine) return;

    topLine.classList.add('animehub-top-row');

    var cards = topLine.querySelectorAll('.card');
    for (var c = 0; c < cards.length; c++) {
      var cardNode = cards[c];
      if (cardNode.classList.contains('animehub-top-card')) continue;

      var movie = getCardMovie(cardNode);
      if (!movie || !movie.id) continue;

      var backdrop = movie.backdrop_path || '';
      var poster = movie.poster_path || '';
      var imgUrl = '';

      if (backdrop) imgUrl = Lampa.TMDB.image('t/p/w1280' + backdrop);
      else if (poster) imgUrl = Lampa.TMDB.image('t/p/w780' + poster);
      if (!imgUrl) continue;

      var item = $(cardNode);
      item.addClass('animehub-top-card');
      item.css('background-image', 'url(' + imgUrl + ')');
      item.css('background-size', 'cover');
      item.css('background-position', 'center');

      item.find('.animehub-top-overlay').remove();

      var title = escapeHtml(movie.name || movie.title || '');
      var desc = escapeHtml(movie.overview || '');
      var rate = movie.vote_average ? Number(movie.vote_average).toFixed(1) : '';

      item.append(
        '<div class="animehub-top-overlay">' +
          '<div class="animehub-top-title">' + title + '</div>' +
          '<div class="animehub-top-desc">' + desc + '</div>' +
          (rate ? '<div class="animehub-top-rate">' + rate + '</div>' : '') +
        '</div>'
      );
    }
  }

  function buildCategories() {
    var now = new Date();
    var year = now.getFullYear();
    var today = formatDate(now);
    var oneHundredDaysAgo = formatDate(addDays(now, -100));

    var ranges = [2000, 2010, 2015];
    var categories = [{
      titleKey: 'title_in_top',
      url: 'discover/tv',
      params: {
        sort_by: 'vote_average.desc',
        'vote_count.gte': '250',
        'first_air_date.lte': today
      }
    }, {
      titleKey: 'title_now_watch',
      url: 'discover/tv',
      params: {
        with_genres: '16',
        sort_by: 'popularity.desc',
        'vote_count.gte': '20',
        'first_air_date.lte': today,
        'first_air_date.gte': (year - 2) + '-01-01',
        noDefaultCountry: true
      },
      randomPage: 3,
      fallback: {
        url: 'tv/on_the_air',
        params: {
          noDefaultAnimeGenre: true,
          noDefaultCountry: true
        }
      }
    }, {
      titleKey: 'title_ongoing',
      url: 'discover/tv',
      params: {
        sort_by: 'popularity.desc',
        'first_air_date.gte': oneHundredDaysAgo
      }
    }, {
      titleKey: 'title_popular',
      url: 'discover/tv',
      params: {
        sort_by: 'popularity.desc',
        'vote_count.gte': '80'
      }
    }, {
      titleKey: 'title_new_this_year',
      url: 'discover/tv',
      params: {
        sort_by: 'first_air_date.desc',
        first_air_date_year: String(year)
      }
    }, {
      titleKey: 'title_last_year',
      url: 'discover/tv',
      params: {
        sort_by: 'popularity.desc',
        'first_air_date.gte': (year - 1) + '-01-01',
        'first_air_date.lte': (year - 1) + '-12-31'
      }
    }, {
      titleKey: 'title_hight_voite',
      url: 'discover/tv',
      params: {
        sort_by: 'vote_average.desc',
        'vote_average.gte': '8',
        'vote_count.gte': '120'
      }
    }];

    ranges.forEach(function (startYear) {
      var endYear = startYear + 9;
      categories.push({
        titleKey: 'title_best_of_' + startYear,
        url: 'discover/tv',
        params: {
          sort_by: 'vote_average.desc',
          'vote_count.gte': '90',
          'first_air_date.gte': startYear + '-01-01',
          'first_air_date.lte': endYear + '-12-31'
        }
      });

      categories.push({
        titleKey: 'title_comedy_of_' + startYear,
        url: 'discover/tv',
        params: {
          with_genres: '16,35',
          sort_by: 'popularity.desc',
          'vote_count.gte': '60',
          'first_air_date.gte': startYear + '-01-01',
          'first_air_date.lte': endYear + '-12-31'
        }
      });
    });

    categories = categories.concat([{
      titleKey: 'filter_genre_fm',
      url: 'discover/tv',
      params: {
        with_genres: '16,10751',
        sort_by: 'popularity.desc',
        'vote_count.gte': '60'
      }
    }, {
      titleKey: 'filter_genre_hf',
      url: 'discover/tv',
      params: {
        with_genres: '16,10765',
        sort_by: 'popularity.desc',
        'vote_count.gte': '60'
      }
    }, {
      titleKey: 'filter_genre_mp',
      url: 'discover/tv',
      params: {
        with_genres: '16,10768',
        sort_by: 'popularity.desc',
        'vote_count.gte': '40'
      }
    }]);

    [{
      id: 14544,
      key: 'filter_keyword_robots'
    }, {
      id: 9951,
      key: 'filter_keyword_aliens'
    }, {
      id: 5484,
      key: 'filter_keyword_reincarnation'
    }, {
      id: 470,
      key: 'filter_keyword_spy'
    }, {
      id: 10617,
      key: 'filter_keyword_disaster'
    }, {
      id: 12377,
      key: 'filter_keyword_zombie'
    }, {
      id: 10873,
      key: 'filter_keyword_school'
    }].forEach(function (entry) {
      categories.push({
        titleKey: entry.key,
        url: 'discover/tv',
        params: {
          with_keywords: String(entry.id),
          sort_by: 'popularity.desc',
          'vote_count.gte': '30'
        }
      });
    });

    return categories.map(function (cat) {
      cat.title = tr(cat.titleKey, cat.titleKey);
      return cat;
    });
  }

  function buildTmdbUrl(url, params, page) {
    var lang = storageGet('language', 'uk');
    var key = getTmdbKey();
    var query = {};
    var finalParams = params || {};

    query.include_adult = 'false';
    query.page = String(page || 1);
    query.language = lang;
    if (!finalParams.noDefaultAnimeGenre) {
      query.with_genres = finalParams.with_genres || '16';
    } else if (finalParams.with_genres) {
      query.with_genres = finalParams.with_genres;
    }

    if (!finalParams.noDefaultCountry) {
      query.with_origin_country = finalParams.with_origin_country || 'JP';
    } else if (finalParams.with_origin_country) {
      query.with_origin_country = finalParams.with_origin_country;
    }

    for (var field in finalParams) {
      if (!Object.prototype.hasOwnProperty.call(finalParams, field)) continue;
      if (field === 'noDefaultAnimeGenre' || field === 'noDefaultCountry') continue;
      query[field] = finalParams[field];
    }

    if (key) query.api_key = key;

    var queryString = Object.keys(query).map(function (name) {
      return encodeURIComponent(name) + '=' + encodeURIComponent(query[name]);
    }).join('&');

    return Lampa.TMDB.api(url + '?' + queryString);
  }

  function fetchCategory(cat, page, onDone, onFail) {
    function requestOne(url, params, reqPage, cbDone, cbFail) {
      var network = new Lampa.Reguest();
      network.silent(buildTmdbUrl(url, params, reqPage), function (json) {
        var data = json || {};
        data.results = normalizeItems(data.results);
        data.page = data.page || reqPage;
        data.total_pages = data.total_pages || 1;
        data.source = 'tmdb';
        cbDone(data);
      }, cbFail);
    }

    var actualPage = page || 1;
    if (cat && cat.randomPage && actualPage === 1) {
      actualPage = 1 + Math.floor(Math.random() * Math.max(1, Number(cat.randomPage) || 1));
    }

    requestOne(cat.url, cat.params, actualPage, function (data) {
      if (data.results && data.results.length) {
        onDone(data);
        return;
      }

      if (cat && cat.fallback && cat.fallback.url) {
        requestOne(cat.fallback.url, cat.fallback.params || {}, 1, function (fallbackData) {
          onDone(fallbackData);
        }, function () {
          if (onFail) onFail();
        });
        return;
      }

      onDone(data);
    }, function () {
      if (onFail) onFail();
    });
  }

  function AnimeHubMain(object) {
    var comp = new Lampa.InteractionMain(object);

    comp.create = function () {
      var _this = this;
      var categories = buildCategories();
      var status = new Lampa.Status(categories.length);

      ensureTopRowStyle();
      this.activity.loader(true);

      status.onComplite = function () {
        var rows = [];
        Object.keys(status.data).sort(function (a, b) {
          return Number(a) - Number(b);
        }).forEach(function (index) {
          var json = status.data[index];
          if (!json || !Array.isArray(json.results) || !json.results.length) return;

          var cat = categories[Number(index)];
          if (!cat) return;

          var results = json.results;
          Lampa.Utils.extendItemsParams(results, {
            style: {
              name: 'wide'
            }
          });

          rows.push({
            title: cat.title,
            results: results,
            url: cat.url,
            params: cat.params,
            source: 'tmdb'
          });
        });

        if (rows.length) {
          _this.build(rows);
          setTimeout(decorateTopRowCards, 120);
          setTimeout(decorateTopRowCards, 600);
          setTimeout(decorateTopRowCards, 1400);
          _this.activity.loader(false);
          return;
        }

        _this.empty();
      };

      categories.forEach(function (cat, idx) {
        fetchCategory(cat, 1, function (json) {
          status.append(String(idx), json);
        }, function () {
          status.error();
        });
      });

      return this.render();
    };

    comp.onMore = function (data) {
      Lampa.Activity.push({
        title: data.title,
        component: 'animehub_view',
        source: 'tmdb',
        url: data.url,
        params: data.params || {},
        page: 1
      });
    };

    return comp;
  }

  function AnimeHubView(object) {
    var comp = new Lampa.InteractionCategory(object);

    comp.create = function () {
      var _this = this;
      fetchCategory({
        url: object.url,
        params: object.params || {}
      }, 1, function (json) {
        _this.build(json);
      }, this.empty.bind(this));
    };

    comp.nextPageReuest = function (state, resolve, reject) {
      fetchCategory({
        url: object.url,
        params: object.params || {}
      }, state.page, resolve, reject);
    };

    return comp;
  }

  function openAnime() {
    Lampa.Activity.push({
      title: tr('menu_anime', 'Anime') + ' - TMDB',
      component: 'animehub_main',
      source: 'tmdb',
      page: 1
    });
  }

  var lastOpenAt = 0;
  function safeOpenAnime(event) {
    var now = Date.now();
    if (now - lastOpenAt < 350) return;
    lastOpenAt = now;

    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    openAnime();
  }

  function bindMenuNode(node) {
    if (!node || node.__animehub_bound) return;
    node.__animehub_bound = true;
    node.addEventListener('click', safeOpenAnime, true);
    node.addEventListener('hover:enter', safeOpenAnime, true);
  }

  function menuItem() {
    return '' +
      '<li class="menu__item selector menu__item--animehub" data-action="animehub">' +
      '<div class="menu__ico">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.5 8.5h-9v-2h9v2zm0 5h-9v-2h9v2z"/>' +
      '</svg>' +
      '</div>' +
      '<div class="menu__text">' + tr('menu_anime', 'Anime') + '</div>' +
      '</li>';
  }

  function patchMenu(body) {
    if (!body || !body.find) return;
    var list = body.find('.menu__list');
    if (!list.length) return;

    // Якщо рідний пункт anime існує - залишаємо його, лише перехопимо дію.
    var nativeAnime = list.find('[data-action="anime"]');
    if (nativeAnime.length) {
      nativeAnime.each(function () {
        bindMenuNode(this);
      });
      return;
    }

    if (!list.find('[data-action="animehub"]').length) {
      list.append(menuItem());
    }

    list.find('[data-action="animehub"]').each(function () {
      bindMenuNode(this);
    });
  }

  function patchMenuDomFallback() {
    var list = document.querySelector('.menu__list');
    if (!list) return;

    var nativeAnime = list.querySelector('[data-action="anime"]');
    if (nativeAnime) {
      bindMenuNode(nativeAnime);
      return;
    }

    var existsHub = list.querySelector('[data-action="animehub"]');
    if (existsHub) {
      bindMenuNode(existsHub);
      return;
    }

    var wrap = document.createElement('div');
    wrap.innerHTML = menuItem();
    if (wrap.firstElementChild) {
      list.appendChild(wrap.firstElementChild);
      bindMenuNode(wrap.firstElementChild);
    }
  }

  function start() {
    if (!window.Lampa || !Lampa.Component || !Lampa.Listener) return;

    Lampa.Component.add('animehub_main', AnimeHubMain);
    Lampa.Component.add('animehub_view', AnimeHubView);

    Lampa.Listener.follow('menu', function (event) {
      if (!event) return;

      if (event.type === 'start' && event.body) {
        patchMenu(event.body);
      }

      if (event.type === 'action' && (event.action === 'anime' || event.action === 'animehub')) {
        if (event.abort) event.abort();
        openAnime();
      }
    });

    // Якщо меню вже було змонтоване до старту плагіна.
    setTimeout(patchMenuDomFallback, 100);
    setTimeout(patchMenuDomFallback, 600);
    setTimeout(patchMenuDomFallback, 1500);

    var observer = new MutationObserver(function () {
      patchMenuDomFallback();
      decorateTopRowCards();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (window.appready) {
    start();
  } else {
    Lampa.Listener.follow('app', function (event) {
      if (event && event.type === 'ready') start();
    });
  }
})();
