(() => {
  function readPixelVar(name, fallback) {
    const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const parsed = Number.parseFloat(value);

    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function resolveGap(gap) {
    if (Number.isFinite(gap)) return gap;

    const systemGap = readPixelVar("--ds-connected-gap", NaN);
    return Number.isFinite(systemGap) ? systemGap : readPixelVar("--connected-gap", 8);
  }

  function place(trigger, panel, options = {}) {
    if (!trigger || !panel) return null;

    const viewportPadding = Number.isFinite(options.viewportPadding) ? options.viewportPadding : 8;
    const connectedGap = resolveGap(options.gap);
    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const spaceBelow = window.innerHeight - triggerRect.bottom - viewportPadding;
    const spaceAbove = triggerRect.top - viewportPadding;
    const placementY = panelRect.height + connectedGap > spaceBelow && spaceAbove > spaceBelow ? "top" : "bottom";
    const spaceRight = window.innerWidth - triggerRect.left - viewportPadding;
    const spaceLeft = triggerRect.right - viewportPadding;
    const alignX = panelRect.width > spaceRight && spaceLeft >= panelRect.width ? "right" : "left";
    const availableBlock = Math.max((placementY === "top" ? spaceAbove : spaceBelow) - connectedGap, 96);
    const root = options.root || trigger.closest("[data-ds-floating-root]");
    const placement = { placementY, alignX, availableBlock };

    panel.dataset.placementY = placementY;
    panel.dataset.alignX = alignX;
    panel.style.maxBlockSize = `${Math.floor(availableBlock)}px`;
    panel.style.overflowY = panelRect.height > availableBlock ? "auto" : "";

    if (root) {
      root.dataset.placementY = placementY;
      root.dataset.alignX = alignX;
    }

    return placement;
  }

  function reset(panel, root) {
    if (!panel) return;

    panel.style.maxBlockSize = "";
    panel.style.overflowY = "";

    if (root) {
      delete root.dataset.placementY;
      delete root.dataset.alignX;
    }
  }

  window.AlignedFloating = { place, reset };
})();
