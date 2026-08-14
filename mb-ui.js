/* Montebay design-system behaviour.
   Only what the rebuilt markup needs. Legacy behaviour stays in script.js. */
(function () {
    'use strict';

    /* FAQ accordion. One open at a time, keyboard accessible via the button. */
    var questions = document.querySelectorAll('.mb-faq__q');

    Array.prototype.forEach.call(questions, function (btn) {
        btn.addEventListener('click', function () {
            var panel = document.getElementById(btn.getAttribute('aria-controls'));
            if (!panel) return;

            var isOpen = btn.getAttribute('aria-expanded') === 'true';

            /* Close every other panel first. */
            Array.prototype.forEach.call(questions, function (other) {
                if (other === btn) return;
                var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
                other.setAttribute('aria-expanded', 'false');
                if (otherPanel) otherPanel.hidden = true;
            });

            btn.setAttribute('aria-expanded', String(!isOpen));
            panel.hidden = isOpen;
        });
    });
})();
