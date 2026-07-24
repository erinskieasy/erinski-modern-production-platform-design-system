(() => {
  function setSubmenuState(toggle, submenu, expanded) {
    const state = expanded ? "expanded" : "collapsed";

    toggle.dataset.state = state;
    toggle.setAttribute("aria-expanded", String(expanded));
    submenu.dataset.state = state;
    submenu.setAttribute("aria-hidden", String(!expanded));
  }

  function initSideMenu(root = document) {
    root.querySelectorAll("[data-ds-side-menu]").forEach((menu) => {
      menu.querySelectorAll("[data-ds-side-toggle]").forEach((toggle) => {
        const submenuId = toggle.getAttribute("aria-controls");
        const submenu = submenuId ? document.getElementById(submenuId) : toggle.nextElementSibling;

        if (!submenu) {
          return;
        }

        const startsExpanded = toggle.getAttribute("aria-expanded") !== "false";
        setSubmenuState(toggle, submenu, startsExpanded);

        const toggleSubmenu = () => {
          const nextExpanded = toggle.getAttribute("aria-expanded") !== "true";
          setSubmenuState(toggle, submenu, nextExpanded);
        };

        toggle.addEventListener("click", toggleSubmenu);

        if (toggle.tagName !== "BUTTON") {
          toggle.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleSubmenu();
            }
          });
        }
      });
    });
  }

  window.AlignedSideMenu = { init: initSideMenu };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initSideMenu());
  } else {
    initSideMenu();
  }
})();
