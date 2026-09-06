'use strict';
(() => {
  const names = Object.freeze({tiktok: 'TikTok', facebook: 'Facebook', x: 'X', bluesky: 'Bluesky'});
  const actor = 'did:plc:vfgfspxjsta2ei3aat4ylqsq';
  const blueskyAPI = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=' + encodeURIComponent(actor) + '&limit=10&filter=posts_no_replies';
  const facebookURL = 'https://www.facebook.com/plugins/page.php?href=' + encodeURIComponent('https://www.facebook.com/people/Gallis-Networks/61572970461203/') + '&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false';
  document.querySelectorAll('[data-load-feed]').forEach(button => {
    const platform = button.dataset.loadFeed;
    if (!Object.hasOwn(names, platform)) return;
    const feed = document.querySelector('[data-feed="' + platform + '"]');
    const status = document.querySelector('[data-feed-status="' + platform + '"]');
    if (!feed || !status) return;
    const original = Array.from(feed.childNodes).map(node => node.cloneNode(true));
    let active = false, generation = 0, timer, controller;
    button.hidden = false;
    button.setAttribute('aria-expanded', 'false');
    const restore = () => {
      active = false; generation++;
      window.clearTimeout(timer);
      if (controller) controller.abort();
      feed.replaceChildren(...original.map(node => node.cloneNode(true)));
      feed.classList.remove('social-posts');
      button.textContent = 'Load ' + names[platform] + ' posts';
      button.setAttribute('aria-expanded', 'false');
    };
    window.addEventListener('gallis:privacy-change', () => {
      if (active && !window.GALLIS_PRIVACY?.allowed(platform)) { restore(); status.textContent = 'Permission withdrawn. Feed removed.'; }
    });
    async function refreshBluesky(id) {
      if (!active || id !== generation) return;
      if (!window.GALLIS_PRIVACY?.allowed(platform)) { restore(); return; }
      if (document.hidden) { timer = window.setTimeout(() => refreshBluesky(id), 300000); return; }
      const request = new AbortController(); controller = request;
      const timeout = window.setTimeout(() => request.abort(), 12000);
      try {
        const response = await fetch(blueskyAPI, {credentials: 'omit', redirect: 'error', signal: request.signal});
        if (!response.ok) throw new Error('Feed unavailable');
        const data = await response.json();
        if (!active || id !== generation) return;
        if (!Array.isArray(data.feed)) throw new Error('Invalid feed');
        const posts = data.feed.filter(item => !item?.reason && item?.post?.author?.did === actor && typeof item.post.record?.text === 'string' && typeof item.post.uri === 'string' && item.post.uri.startsWith('at://' + actor + '/app.bsky.feed.post/')).slice(0, 3);
        if (!posts.length) throw new Error('No public posts');
        const cards = posts.map(({post}) => {
          const card = document.createElement('article'); card.className = 'social-post';
          const date = new Date(post.record.createdAt);
          if (!Number.isNaN(date.getTime())) { const time = document.createElement('time'); time.dateTime = date.toISOString(); time.textContent = date.toLocaleDateString('en-GB'); card.appendChild(time); }
          const text = document.createElement('p'); text.textContent = post.record.text.slice(0, 5000); card.appendChild(text);
          const photo = post.embed?.images?.[0];
          if (photo && typeof photo.thumb === 'string') {
            try {
              const url = new URL(photo.thumb);
              if (url.origin === 'https://cdn.bsky.app' && url.pathname.startsWith('/img/') && !url.username && !url.password) {
                const img = document.createElement('img'); img.src = url.href; img.alt = typeof photo.alt === 'string' ? photo.alt.slice(0, 1000) : ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; card.appendChild(img);
              }
            } catch (_) { /* Text and direct post link remain usable. */ }
          }
          const link = document.createElement('a');
          link.href = 'https://bsky.app/profile/' + actor + '/post/' + encodeURIComponent(post.uri.split('/').pop());
          link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'View post on Bluesky ↗'; card.appendChild(link);
          return card;
        });
        feed.replaceChildren(...cards); feed.classList.add('social-posts');
        status.textContent = 'Latest public posts. Refreshes every five minutes while this page is visible.';
      } catch (_) {
        if (active && id === generation) status.textContent = 'We could not refresh Bluesky. Use the profile link below; any posts already shown remain available.';
      } finally {
        window.clearTimeout(timeout);
        if (active && id === generation) timer = window.setTimeout(() => refreshBluesky(id), 300000);
      }
    }
    button.addEventListener('click', () => {
      if (active) { restore(); status.textContent = 'Feed removed. You can still open the profile directly.'; return; }
      if (!window.GALLIS_PRIVACY?.allowed(platform)) {
        status.textContent = 'Allow this provider in Cookie settings, then select Load posts.';
        window.GALLIS_PRIVACY?.open(); return;
      }
      active = true; const id = ++generation;
      button.textContent = 'Remove loaded feed'; button.setAttribute('aria-expanded', 'true');
      status.textContent = 'Loading ' + names[platform] + ' posts…';
      if (platform === 'bluesky') { return refreshBluesky(id); }
      const frame = document.createElement('iframe');
      frame.title = 'Gallis Networks ' + names[platform] + ' posts';
      const width = Math.min(500, Math.max(180, Math.floor(feed.clientWidth)));
      frame.src = platform === 'facebook' ? facebookURL.replace('width=340', 'width=' + width) : 'social-' + platform + '.html';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.setAttribute('allow', 'fullscreen');
      // Never combine scripts and same-origin access for local helper documents.
      frame.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox' + (platform === 'facebook' ? ' allow-same-origin' : ''));
      const fallback = () => { if (active && id === generation) status.textContent = 'If posts do not appear, use the profile link below. The platform may require sign-in or restrict embedded posts.'; };
      frame.addEventListener('load', () => {
        if (active && id === generation && platform !== 'facebook' && window.GALLIS_PRIVACY?.allowed(platform)) frame.contentWindow?.postMessage('gallis:load-consented-feed', '*');
        window.clearTimeout(timer); fallback();
      });
      frame.addEventListener('error', () => { window.clearTimeout(timer); fallback(); });
      timer = window.setTimeout(fallback, 12000);
      feed.replaceChildren(frame);
    });
  });
})();
