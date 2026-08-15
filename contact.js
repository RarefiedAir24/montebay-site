/* Contact form: client validation, submit to the Lambda, inline feedback.
   Validation runs on blur and on submit, never on keystroke. */
(function () {
    'use strict';

    var ENDPOINT = 'https://bisrhls8q9.execute-api.us-east-2.amazonaws.com/prod/montebay/contact';

    var form = document.getElementById('contactForm');
    if (!form) return;

    var submit = document.getElementById('cf-submit');
    var status = document.getElementById('cf-status');

    var RULES = {
        name:    function (v) { return v.trim() ? '' : 'Please add your name.'; },
        email:   function (v) {
            if (!v.trim()) return 'Please add an email so we can reply.';
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'That does not look like a valid email.';
        },
        message: function (v) { return v.trim() ? '' : 'Please tell us what you need.'; }
    };

    function fieldError(name, msg) {
        var input = form.elements[name];
        var err = document.getElementById('cf-' + name + '-err');
        if (!input || !err) return;
        if (msg) {
            err.textContent = msg;
            err.hidden = false;
            input.setAttribute('aria-invalid', 'true');
        } else {
            err.hidden = true;
            input.removeAttribute('aria-invalid');
        }
    }

    Object.keys(RULES).forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        input.addEventListener('blur', function () {
            fieldError(name, RULES[name](input.value));
        });
    });

    function setStatus(msg, kind) {
        status.textContent = msg;
        status.className = 'form-status' + (kind ? ' is-' + kind : '');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var firstBad = null;
        Object.keys(RULES).forEach(function (name) {
            var msg = RULES[name](form.elements[name].value);
            fieldError(name, msg);
            if (msg && !firstBad) firstBad = name;
        });

        if (firstBad) {
            setStatus('Please fix the highlighted fields.', 'error');
            form.elements[firstBad].focus();
            return;
        }

        submit.disabled = true;
        var original = submit.textContent;
        submit.textContent = 'Sending';
        setStatus('');

        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: form.elements.name.value,
                email: form.elements.email.value,
                subject: form.elements.subject.value,
                message: form.elements.message.value,
                website: form.elements.website.value
            })
        })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
            if (res.ok && res.data && res.data.success) {
                form.hidden = true;
                setStatus('Thanks. Your message is on its way and we will reply to ' +
                          form.elements.email.value + '.', 'ok');
                status.focus && status.focus();
            } else {
                setStatus((res.data && res.data.error) ||
                          'Could not send that. Please email contact@montebay.io directly.', 'error');
                submit.disabled = false;
                submit.textContent = original;
            }
        })
        .catch(function () {
            setStatus('Network problem. Please email contact@montebay.io directly.', 'error');
            submit.disabled = false;
            submit.textContent = original;
        });
    });
})();
