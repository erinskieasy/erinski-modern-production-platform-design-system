(() => {
  const openModal = (modal) => {
    if (!modal) return;

    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      const input = modal.querySelector("input, button, [href], select, textarea, [tabindex]:not([tabindex='-1'])");
      input?.focus();
    });
  };

  const closeModal = (modal) => {
    if (!modal) return;

    modal.classList.remove("is-open");
    window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        modal.hidden = true;
      }
    }, 220);
  };

  const initModals = (root = document) => {
    root.querySelectorAll("[data-ds-modal-trigger]").forEach((trigger) => {
      const target = trigger.getAttribute("data-ds-modal-trigger");
      const modal = target ? document.querySelector(target) : null;

      trigger.addEventListener("click", () => openModal(modal));
    });

    root.querySelectorAll("[data-ds-modal]").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.closest("[data-ds-modal-close]")) {
          closeModal(modal);
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      document.querySelectorAll("[data-ds-modal].is-open").forEach(closeModal);
    });
  };

  window.AlignedModal = { init: initModals, open: openModal, close: closeModal };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initModals());
  } else {
    initModals();
  }
})();
