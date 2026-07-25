(() => {
  const readyEditors = new WeakSet();

  function writeText(target, text) {
    target.append(document.createTextNode(text));
  }

  function appendInline(target, source) {
    const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|_([^_]+)_)/g;
    let cursor = 0;
    let match;

    while ((match = pattern.exec(source))) {
      writeText(target, source.slice(cursor, match.index));

      if (match[2] && match[3]) {
        const link = document.createElement("a");
        const href = match[3].trim();
        link.textContent = match[2];
        if (/^https?:\/\//i.test(href)) {
          link.href = href;
          link.rel = "noreferrer";
          link.target = "_blank";
        }
        target.append(link);
      } else if (match[4]) {
        const strong = document.createElement("strong");
        strong.textContent = match[4];
        target.append(strong);
      } else if (match[5]) {
        const emphasis = document.createElement("em");
        emphasis.textContent = match[5];
        target.append(emphasis);
      }

      cursor = pattern.lastIndex;
    }

    writeText(target, source.slice(cursor));
  }

  function renderMarkdown(preview, markdown) {
    preview.replaceChildren();
    if (!markdown.trim()) {
      const empty = document.createElement("span");
      empty.className = "ds-markdown-editor__empty";
      empty.textContent = "Nothing to preview yet.";
      preview.append(empty);
      return;
    }

    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    let paragraph = [];
    let list = null;

    const flushParagraph = () => {
      if (!paragraph.length) return;
      const element = document.createElement("p");
      appendInline(element, paragraph.join(" "));
      preview.append(element);
      paragraph = [];
    };

    const flushList = () => {
      if (!list) return;
      preview.append(list);
      list = null;
    };

    lines.forEach((line) => {
      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      const unordered = line.match(/^\s*[-*]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+\.\s+(.+)$/);

      if (heading) {
        flushParagraph();
        flushList();
        const element = document.createElement(`h${heading[1].length}`);
        appendInline(element, heading[2]);
        preview.append(element);
        return;
      }

      if (unordered || ordered) {
        flushParagraph();
        const tag = unordered ? "ul" : "ol";
        if (!list || list.tagName.toLowerCase() !== tag) {
          flushList();
          list = document.createElement(tag);
        }
        const item = document.createElement("li");
        appendInline(item, (unordered || ordered)[1]);
        list.append(item);
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        flushList();
        return;
      }

      flushList();
      paragraph.push(line.trim());
    });

    flushParagraph();
    flushList();
  }

  function replaceSelection(input, before, after = before, fallback = "text") {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = input.value.slice(start, end) || fallback;
    input.setRangeText(`${before}${selected}${after}`, start, end, "select");
    input.setSelectionRange(start + before.length, start + before.length + selected.length);
  }

  function prefixLines(input, prefix) {
    const start = input.value.lastIndexOf("\n", input.selectionStart - 1) + 1;
    const nextBreak = input.value.indexOf("\n", input.selectionEnd);
    const end = nextBreak === -1 ? input.value.length : nextBreak;
    const replacement = input.value
      .slice(start, end)
      .split("\n")
      .map((line, index) => `${typeof prefix === "function" ? prefix(index) : prefix}${line}`)
      .join("\n");

    input.setRangeText(replacement, start, end, "select");
    input.setSelectionRange(start, start + replacement.length);
  }

  function dispatchInput(input) {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  }

  function updateCount(root, input) {
    const count = root.querySelector("[data-ds-markdown-count]");
    if (!count) return;
    const maximum = input.maxLength > 0 ? input.maxLength : Number(root.dataset.maxLength) || 20000;
    count.textContent = `${input.value.length.toLocaleString()} / ${maximum.toLocaleString()} characters`;
  }

  function setPreviewing(root, previewing) {
    const input = root.querySelector("[data-ds-markdown-input]");
    const preview = root.querySelector("[data-ds-markdown-preview]");
    const previewButton = root.querySelector('[data-ds-markdown-action="preview"]');
    if (!input || !preview || !previewButton) return;

    if (previewing) {
      const previewEvent = new CustomEvent("ds-markdown:preview", {
        bubbles: true,
        cancelable: true,
        detail: { markdown: input.value, preview }
      });
      if (root.dispatchEvent(previewEvent)) renderMarkdown(preview, input.value);
    }

    input.hidden = previewing;
    preview.hidden = !previewing;
    root.dataset.previewing = String(previewing);
    previewButton.classList.toggle("is-active", previewing);
    previewButton.setAttribute("aria-pressed", String(previewing));
    previewButton.textContent = previewing ? "Continue editing" : "Preview";
    root.querySelectorAll('[data-ds-markdown-action]:not([data-ds-markdown-action="preview"])')
      .forEach((button) => {
        button.disabled = previewing;
      });

    if (!previewing) input.focus();
  }

  function runAction(root, action) {
    const input = root.querySelector("[data-ds-markdown-input]");
    if (!input) return;

    switch (action) {
      case "heading":
        prefixLines(input, "## ");
        break;
      case "bold":
        replaceSelection(input, "**");
        break;
      case "italic":
        replaceSelection(input, "_");
        break;
      case "bullet-list":
        prefixLines(input, "- ");
        break;
      case "numbered-list":
        prefixLines(input, (index) => `${index + 1}. `);
        break;
      case "link":
        replaceSelection(input, "[", "](https://)", "link text");
        break;
      case "preview":
        setPreviewing(root, root.dataset.previewing !== "true");
        return;
      case "import":
        root.querySelector("[data-ds-markdown-file]")?.click();
        return;
      default:
        return;
    }

    dispatchInput(input);
  }

  function initEditor(root) {
    if (readyEditors.has(root)) return;
    readyEditors.add(root);

    const input = root.querySelector("[data-ds-markdown-input]");
    if (!input) return;

    root.dataset.previewing = "false";
    updateCount(root, input);

    root.addEventListener("click", (event) => {
      const button = event.target.closest("[data-ds-markdown-action]");
      if (!button || !root.contains(button)) return;
      runAction(root, button.dataset.dsMarkdownAction);
    });

    input.addEventListener("input", () => updateCount(root, input));

    const fileInput = root.querySelector("[data-ds-markdown-file]");
    fileInput?.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const maximum = input.maxLength > 0 ? input.maxLength : 100000;
      input.value = (await file.text()).slice(0, maximum);
      fileInput.value = "";
      dispatchInput(input);
    });
  }

  function init(scope = document) {
    const editors = [];
    if (scope instanceof Element && scope.matches("[data-ds-markdown-editor]")) editors.push(scope);
    scope.querySelectorAll("[data-ds-markdown-editor]").forEach((editor) => editors.push(editor));
    editors.forEach(initEditor);
  }

  window.AlignedMarkdownEditor = { init, renderMarkdown };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    init();
  }
})();
