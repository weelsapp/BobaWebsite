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
})();
