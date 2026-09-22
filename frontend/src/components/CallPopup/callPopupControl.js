export const DISMISSAL_KEY = "callHomeCallPopupDismissedAt";
export const COOLDOWN_MS = 90_000;
const OPEN_EVENT = "callhome:open-call-popup";
let memoryDismissedAt = null;

export function isWithinCooldown(now = Date.now()) {
  let timestamp = memoryDismissedAt;
  try {
    const saved = sessionStorage.getItem(DISMISSAL_KEY);
    if (saved !== null && Number.isFinite(Number(saved)))
      timestamp = Number(saved);
  } catch {
    /* Keep the in-memory cooldown when storage is restricted. */
  }
  return timestamp !== null && now - timestamp < COOLDOWN_MS;
}

export function recordDismissal() {
  memoryDismissedAt = Date.now();
  try {
    sessionStorage.setItem(DISMISSAL_KEY, String(memoryDismissedAt));
  } catch {
    /* In-memory protection remains active. */
  }
}

// Existing telephone links remain direct. Use this only for a popup-specific action.
export function openCallPopup() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(OPEN_EVENT));
}
export { OPEN_EVENT };
