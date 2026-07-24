(() => {
  const closeTimers = new WeakMap();

  function closeSelect(menu) {
    const trigger = menu.querySelector(".ds-select-trigger");
    const popover = menu.querySelector(".ds-select-popover");

    if (!trigger || !popover || popover.hidden) return;

    window.clearTimeout(closeTimers.get(menu));
    popover.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");

    closeTimers.set(menu, window.setTimeout(() => {
      popover.hidden = true;
      menu.classList.remove("is-open");
      window.AlignedFloating?.reset(popover, menu);
    }, 180));
  }

  function closeOthers(activeMenu) {
    document.querySelectorAll("[data-ds-select-menu]").forEach((menu) => {
      if (menu !== activeMenu) closeSelect(menu);
    });
  }

  function openSelect(menu) {
    const trigger = menu.querySelector(".ds-select-trigger");
    const popover = menu.querySelector(".ds-select-popover");

    if (!trigger || !popover) return;

    closeOthers(menu);
    window.clearTimeout(closeTimers.get(menu));
    menu.classList.add("is-open");
    popover.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    window.AlignedFloating?.place(trigger, popover, { root: menu });

    window.requestAnimationFrame(() => {
      popover.classList.add("is-open");
    });
  }

  function initSelectMenus(root = document) {
    root.querySelectorAll("[data-ds-select-menu]").forEach((menu) => {
      const trigger = menu.querySelector(".ds-select-trigger");
      const value = menu.querySelector(".ds-select-value");
      const popover = menu.querySelector(".ds-select-popover");
      const options = menu.querySelectorAll(".ds-select-option");

      if (!trigger || !value || !popover) return;

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();

        if (popover.hidden) {
          openSelect(menu);
        } else {
          closeSelect(menu);
        }
      });

      popover.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      options.forEach((option) => {
        option.addEventListener("click", () => {
          options.forEach((item) => item.setAttribute("aria-selected", "false"));
          option.setAttribute("aria-selected", "true");
          value.textContent = option.textContent;
          closeSelect(menu);
          trigger.focus({ preventScroll: true });
        });
      });
    });

    document.addEventListener("click", () => closeOthers(null));
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      document.querySelectorAll("[data-ds-select-menu]").forEach((menu) => {
        const trigger = menu.querySelector(".ds-select-trigger");
        const popover = menu.querySelector(".ds-select-popover");

        if (popover && !popover.hidden) {
          closeSelect(menu);
          trigger?.focus({ preventScroll: true });
        }
      });
    });

    window.addEventListener("resize", () => {
      document.querySelectorAll("[data-ds-select-menu]").forEach((menu) => {
        const trigger = menu.querySelector(".ds-select-trigger");
        const popover = menu.querySelector(".ds-select-popover");

        if (popover && !popover.hidden) {
          window.AlignedFloating?.place(trigger, popover, { root: menu });
        }
      });
    });
  }

  window.AlignedSelectMenu = { init: initSelectMenus, open: openSelect, close: closeSelect };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initSelectMenus());
  } else {
    initSelectMenus();
  }
})();
