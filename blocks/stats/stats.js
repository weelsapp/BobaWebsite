/* Stats block: scroll-in reveal + count-up numbers */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const container = document.querySelector('.stats__row');
  if (!container) return;

  const stats = Array.from(container.querySelectorAll('.stat'));
  if (stats.length === 0) return;

  // Format number with decimal comma and suffix (e.g., 67,45M)
  function formatValue(value, decimals, suffix) {
    const fixed = value.toFixed(decimals);
    // Replace decimal point with comma to match requested style
    const withComma = fixed.replace('.', ',');
    return withComma + (suffix || '');
  }

  function animateCount(el, target, decimals, suffix, duration = 1200) {
    const start = 0;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const current = start + (target - start) * eased;
      el.textContent = formatValue(current, decimals, suffix);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = formatValue(target, decimals, suffix);
      }
    }

    requestAnimationFrame(frame);
  }

  function initStat(stat, delayIndex) {
    const valueEl = stat.querySelector('.stat__value');
    if (!valueEl) return;

    const target = parseFloat(valueEl.getAttribute('data-target') || '0');
    const suffix = valueEl.getAttribute('data-suffix') || '';
    const decimals = parseInt(valueEl.getAttribute('data-decimals') || '0', 10);

    // Stagger from left to right
    const delay = delayIndex * 120;

    setTimeout(() => {
      stat.classList.add('is-in');
      if (prefersReduced) {
        // Set value immediately without animating
        valueEl.textContent = formatValue(target, decimals, suffix);
      } else {
        animateCount(valueEl, target, decimals, suffix, 1200);
      }
    }, delay);
  }

  // Observe the row once
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stats.forEach((stat, i) => initStat(stat, i));
          obs.disconnect();
        }
      });
    },
    { root: null, threshold: 0.2 }
  );

  observer.observe(container);
})();
