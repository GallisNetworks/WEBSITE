'use strict';
(() => {
  document.body.classList.add('js');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  if (menu && nav) {
    menu.hidden = false;
    const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
    });
  }
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const form = document.querySelector('#enquiry-form');
  if (!form) return;
  const config = window.GALLIS_CONFIG || {};
  const button = document.querySelector('#submit-enquiry');
  const status = document.querySelector('#form-status');
  const property = document.querySelector('#property');
  document.querySelectorAll('[data-property]').forEach((link) => link.addEventListener('click', () => {
    property.value = link.dataset.property;
  }));
  const ready = config.enquiriesEnabled === true && config.privacyReviewed === true &&
    /^[a-zA-Z0-9]{6,32}$/.test(config.formspreeId || '') &&
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gallisnetworks\.com$/i.test(config.contactEmail || '');
  const setStatus = (text, state) => { status.textContent = text; status.dataset.state = state; };
  if (ready) {
    form.dataset.ready = 'true';
    button.disabled = false;
    button.textContent = 'Send enquiry ↗';
    setStatus('Ready when you are. Tell us about your project above.', 'ready');
    const email = document.querySelector('#direct-email');
    email.href = 'mailto:' + config.contactEmail;
    email.textContent = 'Or email ' + config.contactEmail;
    email.hidden = false;
  }
  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!ready) { setStatus('Preview only — no enquiry has been sent.', 'ready'); return; }
    if (sending || !form.reportValidity()) return;
    if (form.elements.namedItem('_gotcha').value) { setStatus('Unable to send this enquiry. Please try again.', 'error'); return; }
    sending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    setStatus('Sending your enquiry…', 'sending');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://formspree.io/f/' + config.formspreeId, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission rejected');
      form.reset();
      setStatus('Thank you. Your enquiry has been submitted. Gallis Networks will reply by email.', 'success');
    } catch (error) {
      setStatus(error.name === 'AbortError'
        ? 'The request timed out, so we cannot confirm receipt. Your details are still here. You can retry or use the email link.'
        : 'We could not confirm your enquiry was sent. Your details are still here. Please try again or use the email link.', 'error');
    } finally {
      window.clearTimeout(timeout);
      sending = false; button.disabled = false; button.textContent = 'Send enquiry ↗'; status.focus();
    }
  });
})();
