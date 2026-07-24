(() => {
  const hideTimers = new WeakMap();

  function ensureScrollbar(scroller) {
    let track = scroller.querySelector(":scope > .ds-scrollbar__track");

    if (!track) {
      track = document.createElement("span");
      track.className = "ds-scrollbar__track";
      track.setAttribute("aria-hidden", "true");

      const thumb = document.createElement("span");
      thumb.className = "ds-scrollbar__thumb";
      track.append(thumb);
      scroller.append(track);
    }

    return { track, thumb: track.querySelector(".ds-scrollbar__thumb") };
  }

  function update(scroller) {
    const { track, thumb } = ensureScrollbar(scroller);
    const scrollerStyles = window.getComputedStyle(scroller);

    if (scrollerStyles.overflowY === "hidden" || scrollerStyles.overflowY === "clip") {
      scroller.classList.remove("is-scrollbar-active");
      thumb.style.blockSize = "0px";
      return;
    }

    const maxScroll = scroller.scrollHeight - scroller.clientHeight;
    const thumbStyles = window.getComputedStyle(thumb);
    const minThumbSize = Number.parseFloat(thumbStyles.minBlockSize) || 24;

    track.style.blockSize = `${scroller.clientHeight}px`;
    track.style.transform = `translateY(${scroller.scrollTop}px)`;

    if (maxScroll <= 1) {
      scroller.classList.remove("is-scrollbar-active");
      thumb.style.blockSize = "0px";
      return;
    }

    const thumbSize = Math.max(minThumbSize, (scroller.clientHeight / scroller.scrollHeight) * scroller.clientHeight);
    const thumbTravel = Math.max(0, scroller.clientHeight - thumbSize);
    const thumbOffset = (scroller.scrollTop / maxScroll) * thumbTravel;

    thumb.style.blockSize = `${thumbSize}px`;
    thumb.style.transform = `translateY(${thumbOffset}px)`;
  }

  function show(scroller) {
    const scrollerStyles = window.getComputedStyle(scroller);

    if (scrollerStyles.overflowY === "hidden" || scrollerStyles.overflowY === "clip") {
      scroller.classList.remove("is-scrollbar-active");
      return;
    }

    update(scroller);

    if (scroller.scrollHeight <= scroller.clientHeight + 1) return;

    scroller.classList.add("is-scrollbar-active");
    window.clearTimeout(hideTimers.get(scroller));
    hideTimers.set(scroller, window.setTimeout(() => {
      scroller.classList.remove("is-scrollbar-active");
    }, 1000));
  }

  function init(root = document) {
    root.querySelectorAll("[data-ds-scrollbar]").forEach((scroller) => {
      if (scroller.dataset.dsScrollbarReady === "true") return;

      scroller.dataset.dsScrollbarReady = "true";

      if (window.getComputedStyle(scroller).position === "static") {
        scroller.classList.add("is-scrollbar-positioned");
      }

      ensureScrollbar(scroller);
      update(scroller);

      ["scroll", "wheel", "pointermove", "touchmove"].forEach((eventName) => {
        scroller.addEventListener(eventName, () => show(scroller), { passive: true });
      });

      scroller.addEventListener("mouseenter", () => show(scroller));
      scroller.addEventListener("mouseleave", () => {
        window.clearTimeout(hideTimers.get(scroller));
        hideTimers.set(scroller, window.setTimeout(() => {
          scroller.classList.remove("is-scrollbar-active");
        }, 1000));
      });
    });
  }

  window.AlignedScrollbar = { init, update, show };

  window.addEventListener("resize", () => {
    document.querySelectorAll("[data-ds-scrollbar]").forEach((scroller) => update(scroller));
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    init();
  }
})();
