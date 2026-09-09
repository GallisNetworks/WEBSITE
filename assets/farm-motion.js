
'use strict';
(() => {
  const diagram = document.querySelector('.farm-diagram');
  const button = document.querySelector('.farm-replay');
  if (!diagram || !button || !window.matchMedia) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const play = () => {
    if (reduced.matches) return;
    diagram.classList.remove('farm-motion-active');
    void diagram.offsetWidth;
    diagram.classList.add('farm-motion-active');
  };
  button.hidden = reduced.matches;
  button.addEventListener('click', play);
  reduced.addEventListener('change', () => {
    button.hidden = reduced.matches;
    if (reduced.matches) diagram.classList.remove('farm-motion-active');
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { play(); observer.disconnect(); }
    }, {threshold: 0.2});
    observer.observe(diagram);
  }
})();
