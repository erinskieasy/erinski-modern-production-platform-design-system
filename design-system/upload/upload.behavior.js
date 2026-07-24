(function () {
  const instances = new WeakMap();

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes)) return "0 MB";
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  function createUpload(root) {
    if (!root || instances.has(root)) return instances.get(root);

    const dropzone = root.querySelector("[data-ds-upload-dropzone]");
    const input = root.querySelector("[data-ds-upload-input]");
    const fileName = root.querySelector("[data-ds-upload-name]");
    const fileSize = root.querySelector("[data-ds-upload-size]");
    const progressBar = root.querySelector("[data-ds-upload-progress]");
    const removeButton = root.querySelector("[data-ds-upload-remove]");
    const cancelButton = root.querySelector("[data-ds-upload-cancel]");
    const submitButton = root.querySelector("[data-ds-upload-submit]");

    if (!dropzone || !input || !fileName || !fileSize || !progressBar || !removeButton || !cancelButton || !submitButton) {
      return null;
    }

    let selectedFile = null;
    let progressTimer = 0;
    let dragDepth = 0;

    function setState(state) {
      root.dataset.uploadState = state;
      root.classList.toggle("has-file", state !== "idle");
      root.classList.toggle("is-uploading", state === "uploading");
      root.classList.toggle("is-success", state === "success");
    }

    function setProgress(value) {
      const progress = Math.max(0, Math.min(Number(value) || 0, 100));
      progressBar.style.inlineSize = `${progress}%`;
      root.setAttribute("aria-busy", String(progress > 0 && progress < 100));
    }

    function reset() {
      window.clearInterval(progressTimer);
      selectedFile = null;
      dragDepth = 0;
      input.value = "";
      fileName.textContent = "No file selected";
      fileSize.textContent = "0 MB";
      submitButton.textContent = root.dataset.submitLabel || "Submit Resume";
      submitButton.disabled = false;
      cancelButton.disabled = false;
      root.classList.remove("is-dragging");
      root.removeAttribute("aria-busy");
      setProgress(0);
      setState("idle");
      root.dispatchEvent(new CustomEvent("ds-upload:reset", { bubbles: true }));
    }

    function selectFile(file) {
      if (!file) return;

      selectedFile = file;
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      submitButton.textContent = root.dataset.submitLabel || "Submit Resume";
      submitButton.disabled = false;
      cancelButton.disabled = false;
      setProgress(0);
      setState("selected");
      root.dispatchEvent(new CustomEvent("ds-upload:file-selected", {
        bubbles: true,
        detail: { file }
      }));
    }

    function setUploading() {
      if (!selectedFile) return;
      setState("uploading");
      submitButton.textContent = root.dataset.uploadingLabel || "Uploading...";
      submitButton.disabled = true;
      cancelButton.disabled = true;
      setProgress(0);
    }

    function setSuccess(message) {
      window.clearInterval(progressTimer);
      setProgress(100);
      root.removeAttribute("aria-busy");
      fileSize.textContent = message || "Upload complete";
      submitButton.textContent = root.dataset.successLabel || "Upload Another";
      submitButton.disabled = false;
      cancelButton.disabled = false;
      setState("success");
      root.dispatchEvent(new CustomEvent("ds-upload:success", {
        bubbles: true,
        detail: { file: selectedFile }
      }));
    }

    function runDemoUpload() {
      let progress = 0;
      setUploading();
      window.clearInterval(progressTimer);
      progressTimer = window.setInterval(() => {
        progress = Math.min(progress + 14, 100);
        setProgress(progress);
        if (progress >= 100) {
          window.clearInterval(progressTimer);
          window.setTimeout(() => setSuccess(), 220);
        }
      }, 150);
    }

    function submit() {
      if (!selectedFile || root.classList.contains("is-uploading")) return;
      if (root.classList.contains("is-success")) {
        reset();
        return;
      }

      const event = new CustomEvent("ds-upload:submit", {
        bubbles: true,
        cancelable: true,
        detail: { file: selectedFile }
      });
      root.dispatchEvent(event);

      if (root.hasAttribute("data-ds-upload-demo") && !event.defaultPrevented) {
        runDemoUpload();
      }
    }

    dropzone.addEventListener("click", () => input.click());
    dropzone.addEventListener("dragenter", (event) => {
      event.preventDefault();
      dragDepth += 1;
      root.classList.add("is-dragging");
    });
    dropzone.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    });
    dropzone.addEventListener("dragleave", () => {
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) root.classList.remove("is-dragging");
    });
    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      dragDepth = 0;
      root.classList.remove("is-dragging");
      selectFile(event.dataTransfer?.files?.[0]);
    });
    input.addEventListener("change", () => selectFile(input.files?.[0]));
    removeButton.addEventListener("click", reset);
    cancelButton.addEventListener("click", reset);
    submitButton.addEventListener("click", submit);

    const api = { reset, selectFile, setProgress, setState, setSuccess, setUploading };
    root.dsUpload = api;
    instances.set(root, api);
    setState(root.dataset.uploadState || "idle");
    return api;
  }

  function init(scope) {
    const root = scope || document;
    root.querySelectorAll("[data-ds-upload]").forEach(createUpload);
  }

  window.AlignedUpload = { create: createUpload, init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    init();
  }
})();
