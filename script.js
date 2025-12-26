// Interactivity for Republic At War (RaW) preview site
// - smooth scrolling for internal anchors
// - in-page hyperdrive overlay for external links/buttons marked with [data-external]
// - modal "coming soon" screen with back button
// - year auto-fill
// - external links open in a new tab (noopener)

/* Utility: safe open in new tab */
function openInNewTab(url) {
  if (!url) return;
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (e) {
    // fallback
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // fill year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // smooth scroll for nav links to anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // overlay control
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlayText');

  function showOverlay(message = 'Engaging hyperdrive…') {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('hyperdrive-active');
    if (overlayText) overlayText.textContent = message;
  }
  function hideOverlay() {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('hyperdrive-active');
  }

  // click handlers for any element with data-external and data-href
  document.querySelectorAll('[data-external][data-href]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const href = el.getAttribute('data-href');
      const label = el.getAttribute('data-label') || '';

      // show hyperdrive overlay with custom or default message
      showOverlay(label ? `${label} — Launching…` : 'Engaging hyperdrive…');

      // quick hyperdrive effect, then open in new tab
      const wait = 900; // ms; short but noticeable
      setTimeout(() => {
        // open in new tab (per request)
        openInNewTab(href);
        // keep overlay for a short extra moment, then hide
        setTimeout(hideOverlay, 400);
      }, wait);
    });
  });

  // allow clicking overlay to cancel (optional)
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideOverlay();
    });
  }

  // Coming soon modal handling
  const modal = document.getElementById('modal');
  const trailerBtn = document.getElementById('watch-coming-soon');
  const modalClose = document.getElementById('modal-close');
  const modalBack = modal ? modal.querySelector('.modal-back') : null;

  function openModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
  }

  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      openModal();
    });
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBack) modalBack.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // keyboard: Esc to close modal or overlay
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      hideOverlay();
    }
  });
});
