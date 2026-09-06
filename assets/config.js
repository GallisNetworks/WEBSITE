/* Public configuration only. Never add passwords, tokens or secret API keys.
   Complete docs/LAUNCH.md before enabling enquiries. */
window.GALLIS_CONFIG = Object.freeze({
  formspreeId: '',
  contactEmail: '',
  enquiriesEnabled: false,
  privacyReviewed: false,
  turnstileSiteKey: '',
  // Only set after Formspree rejects missing/invalid CAPTCHA tokens in server tests.
  serverProtectionVerified: false
});
