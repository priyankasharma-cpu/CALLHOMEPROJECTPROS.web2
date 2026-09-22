// Small synchronous initializer: apply saved display settings before the first paint.
(() => {
  const options = {
    textSize: ["normal", "large", "largest"],
    contrast: ["standard", "high"],
    letterSpacing: ["standard", "wide"],
    motion: ["normal", "reduced"],
  };
  let saved;
  try {
    saved = JSON.parse(
      localStorage.getItem("callhome_readability_preferences"),
    );
  } catch {
    /* Storage is optional. */
  }
  for (const [key, values] of Object.entries(options))
    document.documentElement.dataset[key] = values.includes(saved?.[key])
      ? saved[key]
      : values[0];
})();
