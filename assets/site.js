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
  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  if (tabs.length && panels.length) {
    const tabList = document.querySelector('.service-tabs');
    tabList.setAttribute('role', 'tablist');
    function activate(id, focus = false) {
      tabs.forEach((tab) => {
        const selected = tab.dataset.tab === id;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (selected && focus) tab.focus();
      });
      panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== id; });
    }
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'service-' + tab.dataset.tab);
      tab.addEventListener('click', (event) => { event.preventDefault(); activate(tab.dataset.tab); });
      tab.addEventListener('keydown', (event) => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else if (event.key !== ' ') return;
        event.preventDefault(); activate(tabs[next].dataset.tab, true);
      });
    });
    panels.forEach((panel) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', 'tab-' + panel.dataset.panel);
      panel.tabIndex = 0;
    });
    function selectHash() {
      const match = panels.find((panel) => '#' + panel.id === window.location.hash);
      if (match) activate(match.dataset.panel);
    }
    activate(tabs[0].dataset.tab);
    selectHash();
    window.addEventListener('hashchange', selectHash);
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
  document.querySelectorAll('[data-service]').forEach((link) => link.addEventListener('click', () => {
    document.querySelector('#service').value = link.dataset.service;
  }));
  const requestedService = new URLSearchParams(window.location?.search || '').get('service');
  const serviceSelect = document.querySelector('#service');
  if (requestedService && serviceSelect && Array.from(serviceSelect.options).some(option => option.value === requestedService)) serviceSelect.value = requestedService;
  const ready = config.enquiriesEnabled === true && config.privacyReviewed === true && config.serverProtectionVerified === true &&
    /^[a-zA-Z0-9_-]{20,100}$/.test(config.turnstileSiteKey || '') &&
    /^[a-zA-Z0-9]{6,32}$/.test(config.formspreeId || '') &&
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gallisnetworks\.com$/i.test(config.contactEmail || '');
  const setStatus = (text, state) => { status.textContent = text; status.dataset.state = state; };
  const challengeStatus = document.querySelector('#challenge-status');
  const setChallengeStatus = (text) => { if (challengeStatus) challengeStatus.textContent = text; };
  let sending = false;
  let token = '';
  let widgetId;
  const invalidate = () => { token = ''; button.disabled = true; };
  const expired = () => { invalidate(); setChallengeStatus('Please complete a fresh security check before sending.'); };
  if (ready) {
    form.dataset.ready = 'true';
    button.disabled = true;
    button.textContent = 'Send enquiry ↗';
    setStatus('Complete the security check before sending your enquiry.', 'ready');
    const email = document.querySelector('#direct-email');
    email.href = 'mailto:' + config.contactEmail;
    email.textContent = 'Or email ' + config.contactEmail;
    email.hidden = false;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    const unavailable = () => {
      invalidate();
      setChallengeStatus('The security check is unavailable. Reload this page or use the email link.');
    };
    const loadTimeout = window.setTimeout(unavailable, 15000);
    script.onerror = () => { window.clearTimeout(loadTimeout); unavailable(); };
    script.onload = () => {
      window.clearTimeout(loadTimeout);
      try {
        widgetId = window.turnstile.render('#turnstile-container', {
          sitekey: config.turnstileSiteKey,
          callback: (value) => { token = typeof value === 'string' ? value : ''; button.disabled = sending || !token; setChallengeStatus(token ? 'Security check complete.' : 'Please complete the security check.'); },
          'expired-callback': expired,
          'error-callback': () => { unavailable(); },
          'timeout-callback': expired
        });
      } catch (_) { unavailable(); }
    };
    document.head.appendChild(script);
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!ready) { setStatus('Preview only — no enquiry has been sent.', 'ready'); return; }
    if (sending || !form.reportValidity()) return;
    if (!token) { setStatus('Please complete the security check before sending.', 'error'); return; }
    if (form.elements.namedItem('_gotcha').value) { setStatus('Unable to send this enquiry. Please try again.', 'error'); return; }
    const previousNextStep = document.querySelector('#enquiry-next-step');
    if (previousNextStep) previousNextStep.hidden = true;
    sending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    setStatus('Sending your enquiry…', 'sending');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const data = new FormData(form);
      data.set('cf-turnstile-response', token);
      const response = await fetch('https://formspree.io/f/' + config.formspreeId, {
        method: 'POST', credentials: 'omit', redirect: 'error', body: data, headers: { Accept: 'application/json' }, signal: controller.signal
      });
      if (!response.ok) throw Object.assign(new Error('Submission rejected'), {status: response.status});
      form.reset();
      const nextStep = document.querySelector('#enquiry-next-step');
      if (nextStep) nextStep.hidden = false;
      setStatus('Thank you. Your enquiry has been submitted. Gallis Networks will reply by email.', 'success');
    } catch (error) {
      setStatus(error.status === 429
        ? 'The enquiry service has reached a sending limit. Your details are still here. Please use the email link or try again later.'
        : error.name === 'AbortError'
        ? 'The request timed out, so we cannot confirm receipt. Your details are still here. You can retry or use the email link.'
        : 'We could not confirm your enquiry was sent. Your details are still here. Please try again or use the email link.', 'error');
    } finally {
      window.clearTimeout(timeout);
      sending = false; invalidate();
      try { window.turnstile.reset(widgetId); } catch (_) { /* Keep sending disabled. */ }
      button.textContent = 'Send enquiry ↗'; status.focus();
    }
  });
})();
