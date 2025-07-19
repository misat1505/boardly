export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => console.log("Copied to clipboard!"),
      (err) => console.error("Failed to copy text:", err)
    );
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
      console.log("Copied to clipboard!");
    } catch (err) {
      console.error("Fallback: Failed to copy text", err);
    }

    document.body.removeChild(textarea);
  }
}
