(function() {  
    'use strict';  
  
    var all_presets = [  
        { name: '🌍 Jacred Public (Основний)', type: 'jackett', url: 'https://jacred.stream', key: 'pp' }  
    ];  
  
    function applyPreset(preset) {  
        // Зберігаємо тільки для Jackett  
        Lampa.Storage.set('jackett_url', preset.url);  
        Lampa.Storage.set('parser_jackett_url', preset.url);  
        Lampa.Storage.set('jackett_api', preset.key);  
        Lampa.Storage.set('jackett_key', preset.key);  
        Lampa.Storage.set('parser_jackett_api', preset.key);  
        Lampa.Storage.set('parser_jackett_key', preset.key);  
  
        $('.settings__input').each(function() {  
            var name = $(this).data('name');  
            if (name && name.indexOf('jackett') > -1) {  
                if (name.indexOf('url') > -1) {  
                    $(this).val(preset.url).find('.settings__value').text(preset.url);  
                }  
                if (name.indexOf('api') > -1 || name.indexOf('key') > -1) {  
                    $(this).val(preset.key).find('.settings__value').text(preset.key);  
                }  
            }  
        });  
  
        Lampa.Noty.show('✅ ' + preset.name + ' активовано!');  
    }  
  
    function initPlugin() {  
        Lampa.SettingsApi.addParam({  
            component: 'parser',  
            param: {  
                name: 'smart_preset_selector',  
                type: 'static',  
                default: 'Натисніть для вибору'  
            },  
            field: {  
                name: '⚡ Менеджер Парсерів',  
                description: 'Швидкий вибір URL парсера Jackett'  
            },  
            onRender: function(item) {  
                item.hide();   
                item.addClass('my-super-button');  
  
                item.on('click', function() {  
                    // Фільтруємо тільки за типом jackett  
                    var list = all_presets.filter(function(p) { return p.type === 'jackett'; });  
  
                    if (!list.length) return Lampa.Noty.show('⚠️ Немає налаштувань для Jackett');  
  
                    Lampa.Select.show({  
                        title: 'Оберіть джерело (Jackett)',  
                        items: list.map(function(p){ return {title: p.name, preset: p} }),  
                        onSelect: function(itm) {  
                            applyPreset(itm.preset);  
                            Lampa.Controller.toggle('settings_component');  
                        },  
                        onBack: function() {  
                            Lampa.Controller.toggle('settings_component');  
                        }  
                    });  
                });  
  
                var tryToPlace = function() {  
                    var anchor = $('div[data-name="parser_use"]');  
                    if (!anchor.length) anchor = $('div[data-name="jackett_url"]');  
  
                    if (anchor.length > 0) {  
                        $('.my-super-button').not(item).remove();  
                        item.insertBefore(anchor);  
                        item.show();  
                    }  
                };  
  
                setTimeout(tryToPlace, 50);  
                setTimeout(tryToPlace, 300);  
            }  
        });  
    }  
  
    if (window.appready) initPlugin();  
    else Lampa.Listener.follow('app', function(e) { if (e.type === 'ready') initPlugin(); });  
})();
