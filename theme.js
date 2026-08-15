/* Montebay header behaviour: theme picker + responsive nav.
   The resolved theme is written to <html data-theme> before first paint by the
   inline snippet in the page head; this file wires up the controls. */
(function () {
    'use strict';

    /* ---------------------------------------------------------------- theme */
    var KEY = 'montebay-theme';
    var mq = window.matchMedia('(prefers-color-scheme: dark)');

    function stored() {
        try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
    }
    function resolve(pref) {
        if (pref === 'surf' || pref === 'rock') return pref;
        return mq.matches ? 'rock' : 'surf';
    }
    function applyTheme(pref) {
        document.documentElement.setAttribute('data-theme', resolve(pref));
        var buttons = document.querySelectorAll('.theme-picker button');
        Array.prototype.forEach.call(buttons, function (b) {
            b.setAttribute('aria-checked', String(b.dataset.theme === pref));
        });
    }

    /* ------------------------------------------------------------------ nav */
    function initNav() {
        var toggle = document.querySelector('.nav-toggle');
        var nav = document.getElementById('site-nav');
        if (!toggle || !nav) return;

        function setOpen(open) {
            toggle.setAttribute('aria-expanded', String(open));
            if (open) nav.setAttribute('data-open', 'true');
            else nav.removeAttribute('data-open');
        }

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        /* Following a link should not leave the panel hanging open. */
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });

        document.addEventListener('click', function (e) {
            if (toggle.getAttribute('aria-expanded') !== 'true') return;
            if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                setOpen(false);
                toggle.focus();
            }
        });

        /* Widening past the breakpoint leaves the panel state stale otherwise. */
        var wide = window.matchMedia('(min-width: 901px)');
        var onWide = function () { if (wide.matches) setOpen(false); };
        if (wide.addEventListener) wide.addEventListener('change', onWide);
        else if (wide.addListener) wide.addListener(onWide);
    }

    function init() {
        applyTheme(stored());

        var picker = document.querySelector('.theme-picker');
        if (picker) {
            picker.addEventListener('click', function (e) {
                var btn = e.target.closest('button');
                if (!btn) return;
                var pref = btn.dataset.theme;
                try { localStorage.setItem(KEY, pref); } catch (err) {}
                applyTheme(pref);
            });
        }

        /* Keep following the OS while the user is on "system". */
        var onChange = function () { if (stored() === 'system') applyTheme('system'); };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);

        initNav();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
