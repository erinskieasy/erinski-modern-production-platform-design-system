(() => {
  const hideTimers = new WeakMap();

  function getViewport(host) {
    return host.querySelector(":scope > [data-ds-scrollbar-viewport]") || host;
  }

  function ensureScrollbar(host) {
    let track = host.querySelector(":scope > .ds-scrollbar__track");

    if (!track) {
      track = document.createElement("span");
      track.className = "ds-scrollbar__track";
      track.setAttribute("aria-hidden", "true");

      const thumb = document.createElement("span");
      thumb.className = "ds-scrollbar__thumb";
      track.append(thumb);
      host.append(track);
    }

    return { track, thumb: track.querySelector(".ds-scrollbar__thumb") };
  }

  function isOverflowDisabled(viewport) {
    const styles = window.getComputedStyle(viewport);
    return styles.overflowY === "hidden" || styles.overflowY === "clip";
  }

  function update(host) {
    const viewport = getViewport(host);
    const { track, thumb } = ensureScrollbar(host);
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    const overflowDisabled = isOverflowDisabled(viewport);

    if (overflowDisabled || maxScroll <= 1) {
      if (overflowDisabled && viewport.scrollTop !== 0) viewport.scrollTop = 0;
      host.classList.remove("is-scrollbar-active", "is-scrollbar-dragging");
      track.hidden = true;
      thumb.style.blockSize = "0px";
      thumb.style.transform = "translateY(0)";
      return false;
    }

    track.hidden = false;

    const trackSize = track.clientHeight;
    const thumbStyles = window.getComputedStyle(thumb);
    const minThumbSize = Number.parseFloat(thumbStyles.minBlockSize) || 24;
    const thumbSize = Math.min(
      trackSize,
      Math.max(minThumbSize, (viewport.clientHeight / viewport.scrollHeight) * trackSize)
    );
    const thumbTravel = Math.max(0, trackSize - thumbSize);
    const thumbOffset = (viewport.scrollTop / maxScroll) * thumbTravel;

    thumb.style.blockSize = `${thumbSize}px`;
    thumb.style.transform = `translateY(${thumbOffset}px)`;
    return true;
  }

  function scheduleHide(host) {
    window.clearTimeout(hideTimers.get(host));
    hideTimers.set(host, window.setTimeout(() => {
      if (!host.classList.contains("is-scrollbar-dragging")) {
        host.classList.remove("is-scrollbar-active");
      }
    }, 1000));
  }

  function show(host) {
    if (!update(host)) return;

    host.classList.add("is-scrollbar-active");
    scheduleHide(host);
  }

  function bindDrag(host, viewport, track, thumb) {
    thumb.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || !update(host)) return;

      event.preventDefault();
      window.clearTimeout(hideTimers.get(host));
      host.classList.add("is-scrollbar-active", "is-scrollbar-dragging");
      thumb.setPointerCapture(event.pointerId);

      const startY = event.clientY;
      const startScrollTop = viewport.scrollTop;
      const maxScroll = viewport.scrollHeight - viewport.clientHeight;
      const thumbTravel = Math.max(0, track.clientHeight - thumb.getBoundingClientRect().height);

      const onPointerMove = (moveEvent) => {
        if (moveEvent.pointerId !== event.pointerId || thumbTravel <= 0) return;
        const nextScrollTop = startScrollTop + ((moveEvent.clientY - startY) / thumbTravel) * maxScroll;
        viewport.scrollTop = Math.max(0, Math.min(maxScroll, nextScrollTop));
        update(host);
      };

      const finishDrag = (endEvent) => {
        if (endEvent.pointerId !== event.pointerId) return;
        thumb.removeEventListener("pointermove", onPointerMove);
        thumb.removeEventListener("pointerup", finishDrag);
        thumb.removeEventListener("pointercancel", finishDrag);
        host.classList.remove("is-scrollbar-dragging");
        if (thumb.hasPointerCapture(event.pointerId)) {
          thumb.releasePointerCapture(event.pointerId);
        }
        scheduleHide(host);
      };

      thumb.addEventListener("pointermove", onPointerMove);
      thumb.addEventListener("pointerup", finishDrag);
      thumb.addEventListener("pointercancel", finishDrag);
    });
  }

  function initHost(host) {
    if (host.dataset.dsScrollbarReady === "true") return;

    host.dataset.dsScrollbarReady = "true";

    if (window.getComputedStyle(host).position === "static") {
      host.classList.add("is-scrollbar-positioned");
    }

    const viewport = getViewport(host);
    const { track, thumb } = ensureScrollbar(host);
    bindDrag(host, viewport, track, thumb);
    update(host);

    viewport.addEventListener("scroll", () => show(host), { passive: true });
    viewport.addEventListener("wheel", () => show(host), { passive: true });
    viewport.addEventListener("touchmove", () => show(host), { passive: true });
    host.addEventListener("pointermove", () => show(host), { passive: true });
    host.addEventListener("mouseenter", () => show(host));
    host.addEventListener("mouseleave", () => {
      if (!host.classList.contains("is-scrollbar-dragging")) scheduleHide(host);
    });
    viewport.addEventListener("transitionend", () => update(host));
    viewport.addEventListener("load", () => update(host), true);

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => update(host));
      resizeObserver.observe(host);
      resizeObserver.observe(viewport);
    }

    if ("MutationObserver" in window) {
      const mutationObserver = new MutationObserver(() => {
        window.requestAnimationFrame(() => update(host));
      });
      mutationObserver.observe(viewport, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  function init(root = document) {
    const hosts = [];
    if (root instanceof Element && root.matches("[data-ds-scrollbar]")) hosts.push(root);
    root.querySelectorAll("[data-ds-scrollbar]").forEach((host) => hosts.push(host));
    hosts.forEach((host) => initHost(host));
  }

  window.AlignedScrollbar = { init, update, show };

  window.addEventListener("resize", () => {
    document.querySelectorAll("[data-ds-scrollbar]").forEach((host) => update(host));
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    init();
  }
})();
