/* Feature block: scroll-in staggered reveal (top-to-bottom, left-to-right) */
(function () {
  const section = document.querySelector('.feature');
  if (!section) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build reveal order: media (left), then title, text, cards left->right, then actions
  const items = [];
  const media = section.querySelector('.feature__media');
  if (media) items.push(media);

  const title = section.querySelector('.feature__title');
  if (title) items.push(title);

  const text = section.querySelector('.feature__text');
  if (text) items.push(text);

  const cards = section.querySelectorAll('.feature__card');
  if (cards && cards.length) {
    cards.forEach((card) => items.push(card));
  }

  const actions = section.querySelector('.feature__actions');
  if (actions) items.push(actions);

  function revealStaggered() {
    const baseDelay = 120; // ms between items
    items.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('is-in');
      }, i * baseDelay);
    });
  }

  if (prefersReduced) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const rootTarget = section.querySelector('.feature__container') || section;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealStaggered();
          obs.disconnect();
        }
      });
    },
    { root: null, threshold: 0.2 }
  );

  observer.observe(rootTarget);

  // Sequentially preload feature card videos after window load so they are ready
  // by the time the user scrolls. This avoids bandwidth spikes and animation hitches.
  window.addEventListener('load', () => {
    const vids = Array.from(section.querySelectorAll('.card__video[data-src]'));
    if (!vids.length) return;

    const preloadOne = (video) => new Promise((resolve) => {
      const src = video.getAttribute('data-src');
      if (!src) return resolve();

      // Set source lazily and encourage the browser to fetch/decode it
      video.setAttribute('src', src);
      video.setAttribute('preload', 'auto');

      let settled = false;
      const done = () => { if (!settled) { settled = true; resolve(); } };

      // Resolve when the browser can play through, with a small fallback timer
      video.addEventListener('canplaythrough', done, { once: true });
      video.addEventListener('loadeddata', () => {
        // Kick autoplay on some browsers; ignore promise rejections
        const p = video.play && video.muted ? video.play() : null;
        if (p && typeof p.then === 'function') p.catch(() => {});
      }, { once: true });

      setTimeout(done, 1500);
      try { video.load(); } catch (_) {}
    });

    (async () => {
      for (const v of vids) {
        await preloadOne(v);
      }
    })();
  });
})();
