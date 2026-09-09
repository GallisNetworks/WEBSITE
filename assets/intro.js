'use strict';
(() => {
  const chapter = document.querySelector('#property-plan');
  const button = document.querySelector('#intro-motion');
  if (!chapter || !button) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let disabled = false, queued = false;
  function draw() {
    queued = false;
    if (!chapter.classList.contains('intro-animated')) return;
    const box = chapter.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)));
    chapter.style.setProperty('--progress', progress.toFixed(4));
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
  function mode() {
    const enabled = !disabled && !reduced.matches;
    chapter.classList.toggle('intro-animated', enabled);
    button.disabled = reduced.matches;
    button.textContent = reduced.matches ? 'Reduced motion enabled' : enabled ? 'Turn motion off' : 'Turn motion on';
    button.setAttribute('aria-pressed', String(!enabled));
    schedule();
  }
  button.hidden = false;
  button.addEventListener('click', () => { disabled = !disabled; mode(); });
  reduced.addEventListener('change', mode);
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  mode();
})();
