'use strict';
(() => {
  const key = 'gallis-privacy-v1', lifetime = 180 * 86400000;
  const platforms = ['tiktok', 'facebook', 'x', 'bluesky'];
  let state = null, returnFocus = null;
  function valid(value) {
    return value && value.version === 1 && Number.isFinite(value.savedAt) && value.savedAt <= Date.now() && Date.now() - value.savedAt < lifetime && platforms.every(p => typeof value.choices?.[p] === 'boolean');
  }
  function read() {
    try { const value = JSON.parse(localStorage.getItem(key)); if (valid(value)) return value; localStorage.removeItem(key); } catch (_) { /* Storage unavailable: remain denied. */ }
    return null;
  }
  state = read();
  const panel = document.createElement('section');
  panel.className = 'privacy-panel'; panel.hidden = true; panel.tabIndex = -1;
  panel.setAttribute('aria-labelledby', 'privacy-title');
  const policyPath = location.pathname.includes('/services/') ? '../cookie-policy.html' : 'cookie-policy.html';
  panel.innerHTML = '<h2 id="privacy-title">Your social content choices</h2><p>Optional feeds send connection information to their providers, which may use cookies or associate visits with your account. Core pages work without them. No analytics or advertising scripts are installed by us.</p><p><a href="' + policyPath + '">Cookie and provider information</a>. Choices are remembered for up to 180 days. You can change them using Cookie settings.</p><fieldset><legend>Allow optional providers</legend>' + platforms.map(p => '<label><input type="checkbox" data-provider="' + p + '">' + ({tiktok:'TikTok',facebook:'Facebook',x:'X',bluesky:'Bluesky'})[p] + '</label>').join('') + '</fieldset><p>After saving, select Load posts to display an allowed feed. Instagram is a profile link only.</p><div class="privacy-actions"><button type="button" data-reject>Reject optional</button><button type="button" data-save>Save selected</button></div>';
  document.body.appendChild(panel);
  const boxes = [...panel.querySelectorAll('[data-provider]')];
  function announce() { window.dispatchEvent(new Event('gallis:privacy-change')); }
  function allowed(p) {
    if (state && !valid(state)) { state = null; try { localStorage.removeItem(key); } catch (_) {} announce(); }
    return !!(platforms.includes(p) && state?.choices[p]);
  }
  function open() {
    returnFocus = document.activeElement;
    boxes.forEach(box => { box.checked = allowed(box.dataset.provider); });
    panel.hidden = false; panel.focus();
  }
  function save(reject) {
    state = {version:1, savedAt:Date.now(), choices:Object.fromEntries(boxes.map(box => [box.dataset.provider, !reject && box.checked]))};
    try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) { /* Current page still honours the choice. */ }
    panel.hidden = true; announce();
    if (returnFocus?.isConnected) returnFocus.focus();
  }
  panel.querySelector('[data-reject]').addEventListener('click', () => save(true));
  panel.querySelector('[data-save]').addEventListener('click', () => save(false));
  document.querySelectorAll('[data-cookie-settings]').forEach(button => { button.hidden = false; button.addEventListener('click', open); });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { state = read(); boxes.forEach(box => { box.checked = allowed(box.dataset.provider); }); announce(); } });
  // Check expiry even when a loaded iframe has no polling loop.
  window.setInterval(() => { if (state && !valid(state)) { allowed('tiktok'); } }, 60000);
  window.GALLIS_PRIVACY = Object.freeze({allowed, open});
  if (!state && document.querySelector('[data-load-feed]')) panel.hidden = false;
})();
