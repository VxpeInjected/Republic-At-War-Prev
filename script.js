// Interactivity for Republic At War (RaW) preview site (revised layout & docs popup)
// - smooth scrolling for internal anchors
// - in-page hyperdrive overlay for external links/buttons marked with [data-external]
// - documentation popup and coming-soon modal handling
// - year auto-fill
// - external links open in a new tab (noopener)
// - warp effect toggles the background while overlay is active

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

  // overlay control & warp background
  const overlay = document.getElementById('overlay');
  const overlayText = document.getElementById('overlayText');
  const backdrop = document.getElementById('space-backdrop');

  function showOverlay(message = 'Engaging hyperdrive…') {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('hyperdrive-active');
    if (backdrop) backdrop.classList.add('warp');
    if (overlayText) overlayText.textContent = message;
  }
  function hideOverlay() {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('hyperdrive-active');
    if (backdrop) backdrop.classList.remove('warp');
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
      const wait = 900; // ms
      setTimeout(() => {
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

  // Modal handling (coming soon & docs)
  function setupModal(buttonSelectorOrId, modalId) {
    const btn = (typeof buttonSelectorOrId === 'string') ? document.getElementById(buttonSelectorOrId) || document.querySelector(buttonSelectorOrId) : null;
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const closeBtns = modal.querySelectorAll('.modal-back, .btn.ghost, .btn.primary, #modal-close, #docs-close');
    const openFn = () => modal.setAttribute('aria-hidden', 'false');
    const closeFn = () => modal.setAttribute('aria-hidden', 'true');

    // open triggers: elements with data-modal pointing to this modal id
    document.querySelectorAll(`[data-modal="${modalId}"]`).forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openFn();
      });
    });

    // also support explicit button ids
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); openFn(); });

    // close triggers
    closeBtns.forEach(cb => cb.addEventListener('click', () => closeFn()));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeFn(); });

    // Esc closes
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFn(); });
  }

  // Wire modals:
  // Coming soon: id "modal-coming-soon"
  setupModal('watch-coming-soon', 'modal-coming-soon');
  // Docs modal: a couple of potential triggers (#docs-btn and #docs-open)
  setupModal('docs-btn', 'modal-docs');
  setupModal('docs-open', 'modal-docs');

  // Accessibility: trap focus could be added here if desired for the modals

});
