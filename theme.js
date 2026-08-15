/* Montebay theme picker.
   Three settings: system, surf (light), rock (dark).
   The resolved theme is written to <html data-theme> before first paint by the
   inline snippet in the page head; this file only wires up the control and
   keeps "system" live when the OS preference changes. */
(function () {
    'use strict';

    var KEY = 'montebay-theme';
    var mq = window.matchMedia('(prefers-color-scheme: dark)');

    function stored() {
        try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
    }
    function resolve(pref) {
        if (pref === 'surf' || pref === 'rock') return pref;
        return mq.matches ? 'rock' : 'surf';
    }
    function apply(pref) {
        document.documentElement.setAttribute('data-theme', resolve(pref));
        var buttons = document.querySelectorAll('.theme-picker button');
        Array.prototype.forEach.call(buttons, function (b) {
            b.setAttribute('aria-checked', String(b.dataset.theme === pref));
        });
    }

    function init() {
        apply(stored());

        var picker = document.querySelector('.theme-picker');
        if (picker) {
            picker.addEventListener('click', function (e) {
                var btn = e.target.closest('button');
                if (!btn) return;
                var pref = btn.dataset.theme;
                try { localStorage.setItem(KEY, pref); } catch (err) {}
                apply(pref);
            });
        }

        /* Keep following the OS while the user is on "system". */
        var onChange = function () { if (stored() === 'system') apply('system'); };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
