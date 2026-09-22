export const preferenceKey = "callhome_readability_preferences";
export const defaultPreferences = {
  textSize: "normal",
  contrast: "standard",
  letterSpacing: "standard",
  motion: "normal",
};
export const preferenceOptions = {
  textSize: ["normal", "large", "largest"],
  contrast: ["standard", "high"],
  letterSpacing: ["standard", "wide"],
  motion: ["normal", "reduced"],
};
export function normalizePreferences(value) {
  return Object.fromEntries(
    Object.entries(defaultPreferences).map(([key, fallback]) => [
      key,
      preferenceOptions[key].includes(value?.[key]) ? value[key] : fallback,
    ]),
  );
}
export function readPreferences() {
  try {
    return normalizePreferences(
      JSON.parse(localStorage.getItem(preferenceKey)),
    );
  } catch {
    return { ...defaultPreferences };
  }
}
export function applyPreferences(value) {
  const preferences = normalizePreferences(value);
  if (typeof document !== "undefined")
    Object.entries(preferences).forEach(([key, setting]) => {
      document.documentElement.dataset[key] = setting;
    });
  return preferences;
}
export function savePreferences(value) {
  const preferences = applyPreferences(value);
  try {
    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
  } catch {
    /* Preferences still work in memory when storage is unavailable. */
  }
  return preferences;
}
