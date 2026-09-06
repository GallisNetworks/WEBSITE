const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('assets/site.js', 'utf8');
function setup(config = {}, fetchImpl = async () => ({ok: true})) {
  let submit; let calls = 0; let resets = 0;
  const status = {dataset: {}, focus() {}};
  const button = {disabled: true};
  const form = {dataset: {}, elements: {namedItem: () => ({value: ''})},
    reportValidity: () => true, reset() { resets++; }, addEventListener(event, fn) { if (event === 'submit') submit = fn; }};
  const nodes = {'#enquiry-form': form, '#submit-enquiry': button, '#form-status': status, '#property': {}, '#direct-email': {hidden: true}};
  let timeout;
  const window = {GALLIS_CONFIG: config, setTimeout(fn) { timeout = fn; return 1; }, clearTimeout() {}};
  vm.runInNewContext(source, {document: {body: {classList: {add() {}}}, querySelector: (id) => nodes[id], querySelectorAll: () => []}, window,
    AbortController, FormData: class {}, fetch: async (...args) => { calls++; return fetchImpl(...args); }});
  return {status, button, form, nodes, submit: () => submit({preventDefault() {}}), calls: () => calls, resets: () => resets, timeout: () => timeout()};
}
const ready = {formspreeId: 'abcdefgh', contactEmail: 'hello@gallisnetworks.com', enquiriesEnabled: true, privacyReviewed: true};
test('draft and incomplete configuration never send personal details', async () => {
  for (const config of [{}, {...ready, enquiriesEnabled: false}, {...ready, privacyReviewed: false}, {...ready, contactEmail: 'unconfigured@example.com'}, {...ready, formspreeId: '../other'}]) {
    const app = setup(config); await app.submit(); assert.equal(app.calls(), 0); assert.equal(app.button.disabled, true);
  }
});
test('valid submission posts to intended provider and resets only on success', async () => {
  const app = setup(ready, async (url, options) => {assert.equal(url, 'https://formspree.io/f/abcdefgh'); assert.equal(options.method, 'POST'); assert.equal(options.headers.Accept, 'application/json'); return {ok: true};});
  assert.equal(app.nodes['#direct-email'].href, 'mailto:hello@gallisnetworks.com');
  await app.submit(); assert.equal(app.calls(), 1); assert.equal(app.resets(), 1); assert.equal(app.status.dataset.state, 'success'); assert.equal(app.button.disabled, false);
});
test('server failure and network error preserve customer input and allow retry', async () => {
  for (const impl of [async () => ({ok: false}), async () => {throw new Error('offline');}]) {
    const app = setup(ready, impl); await app.submit(); assert.equal(app.resets(), 0); assert.equal(app.status.dataset.state, 'error'); assert.equal(app.button.disabled, false);
  }
});
test('double submission sends once while pending', async () => {
  let finish; const app = setup(ready, () => new Promise(resolve => {finish = resolve;}));
  const pending = app.submit(); await app.submit(); assert.equal(app.calls(), 1); assert.equal(app.button.disabled, true);
  finish({ok: true}); await pending;
});
test('invalid input does not submit', async () => { const app = setup(ready); app.form.reportValidity = () => false; await app.submit(); assert.equal(app.calls(), 0); });
test('timeout reports uncertain receipt and keeps input', async () => {
  const app = setup(ready, (_, {signal}) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(Object.assign(new Error('timeout'), {name: 'AbortError'})))));
  const pending = app.submit(); app.timeout(); await pending; assert.equal(app.resets(), 0); assert.match(app.status.textContent, /cannot confirm receipt/); assert.equal(app.button.disabled, false);
});
