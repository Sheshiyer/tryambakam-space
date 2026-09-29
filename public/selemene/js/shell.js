/* Selemene shared shell — mobile menu toggle with accessible focus trap.
 * Loaded on every page. No dependencies. Progressive enhancement:
 *   - Without JS, .nav-toggle is hidden (see CSS) and the nav list is visible.
 *   - With JS, after successful init the no-js class is removed so the
 *     toggle becomes visible and the list collapses on narrow viewports.
 *   - If init fails (missing elements), no-js stays and nav stays visible.
 * Idempotent: safe to include multiple times.
 */
(function () {
  if (window.__selemeneShellInit) return;
  window.__selemeneShellInit = true;

  function init() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var toggle = header.querySelector('.nav-toggle');
    var nav = header.querySelector('.primary-nav');
    if (!toggle || !nav) return;

    var lastFocus = null;

    function focusableIn(el) {
      return Array.prototype.slice.call(
        el.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function open() {
      lastFocus = document.activeElement;
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      var f = focusableIn(nav);
      if (f.length) f[0].focus();
      document.addEventListener('keydown', onKey);
    }

    function close() {
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKey);
      if (lastFocus && typeof lastFocus.focus === 'function') {
        try { lastFocus.focus(); } catch (_) {}
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      var f = focusableIn(nav);
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      var active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) close();
      else open();
    });

    nav.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.tagName === 'A' && nav.classList.contains('is-open')) {
        close();
      }
    });

    // Close on resize back to desktop width.
    var mql = window.matchMedia('(min-width: 720px)');
    var onMql = function () {
      if (mql.matches && nav.classList.contains('is-open')) close();
    };
    if (mql.addEventListener) mql.addEventListener('change', onMql);
    else if (mql.addListener) mql.addListener(onMql);

    // Only remove no-js after handlers are attached — nav is now interactive.
    document.documentElement.classList.remove('no-js');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
