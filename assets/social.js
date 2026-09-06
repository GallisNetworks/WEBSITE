'use strict';
(() => {
  const facebookURL = 'https://www.facebook.com/plugins/page.php?href=' + encodeURIComponent('https://www.facebook.com/people/Gallis-Networks/61572970461203/') + '&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false';
  document.querySelectorAll('[data-load-feed]').forEach(button => {
    const platform = button.dataset.loadFeed;
    const feed = document.querySelector('[data-feed="' + platform + '"]');
    const status = document.querySelector('[data-feed-status="' + platform + '"]');
    const original = feed.innerHTML;
    let loaded = false;
    button.hidden = false;
    button.addEventListener('click', () => {
      if (loaded) {
        feed.innerHTML = original; loaded = false;
        button.textContent = 'Load ' + (platform === 'tiktok' ? 'TikTok' : 'Facebook') + ' posts';
        status.textContent = 'Feed removed. You can still open the profile directly.';
        return;
      }
      const frame = document.createElement('iframe');
      frame.title = platform === 'tiktok' ? 'Gallis Networks TikTok profile and recent posts' : 'Gallis Networks Facebook page timeline';
      const width = Math.min(500, Math.max(180, Math.floor(feed.clientWidth)));
      frame.src = platform === 'tiktok' ? 'social-tiktok.html' : facebookURL.replace('width=340', 'width=' + width);
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.setAttribute('allow', 'encrypted-media; fullscreen');
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      frame.addEventListener('error', () => { status.textContent = 'The feed could not load. Please use the profile link below.'; });
      feed.replaceChildren(frame); loaded = true;
      button.textContent = 'Remove loaded feed';
      status.textContent = 'If posts do not appear, use the profile link below. The platform controls which posts are shown.';
    });
  });
})();
