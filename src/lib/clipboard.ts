/** Copy only on a user action. Success is reported only if the browser accepts it. */
export async function copyText(value: string): Promise<void> {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    throw new Error("Clipboard is unavailable");
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch {
    // Some browsers deny the async API but still permit user-initiated legacy copy.
  }
  const focused =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  const selection = window.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, i) =>
        selection.getRangeAt(i).cloneRange(),
      )
    : [];
  const field =
    focused instanceof HTMLInputElement ||
    focused instanceof HTMLTextAreaElement
      ? focused
      : null;
  const cursor = field
    ? {
        start: field.selectionStart,
        end: field.selectionEnd,
        direction: field.selectionDirection,
      }
    : null;
  const input = document.createElement("textarea");
  input.value = value;
  input.readOnly = true;
  input.tabIndex = -1;
  input.setAttribute("aria-label", "Contract copy buffer");
  // A rendered, selectable element is needed by Safari; no offscreen scrolling.
  input.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;font-size:16px;pointer-events:none;";
  document.body.appendChild(input);
  let copied = false;
  try {
    input.focus({ preventScroll: true });
    input.select();
    input.setSelectionRange(0, value.length);
    copied =
      typeof document.execCommand === "function" &&
      document.execCommand("copy");
  } finally {
    input.remove();
    focused?.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      for (const range of ranges) selection.addRange(range);
    }
    if (field && cursor?.start !== null && cursor?.end !== null && cursor) {
      try {
        field.setSelectionRange(
          cursor.start,
          cursor.end,
          cursor.direction || undefined,
        );
      } catch {}
    }
  }
  if (!copied) throw new Error("Clipboard permission denied");
}
