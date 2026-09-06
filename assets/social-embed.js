'use strict';
// Direct visits remain link-only. Only the embedding parent can start a widget.
(() => {
  let loaded = false;
  window.addEventListener('message', event => {
    if (loaded || window.parent === window || event.source !== window.parent || event.origin !== new URL(location.href).origin || event.data !== 'gallis:load-consented-feed') return;
    const platform = document.body.dataset.platform;
    const sources = {x:'https://platform.twitter.com/widgets.js',tiktok:'https://www.tiktok.com/embed.js'};
    if (!Object.hasOwn(sources, platform)) return;
    loaded = true;
    const script = document.createElement('script');script.src = sources[platform];script.async = true;document.body.appendChild(script);
  });
})();
