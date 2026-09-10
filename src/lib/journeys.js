// Persists each user's onboarding journey to localStorage, keyed by PAN.
// This is the client-side stand-in for a "journeys.json" file: one JSON
// blob under JOURNEYS_KEY, shaped as { [pan]: journeyRecord }.

const JOURNEYS_KEY = "wealth360-journeys";
const ACTIVE_PAN_KEY = "wealth360-active-pan";

function readAll() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(JOURNEYS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(journeys) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(JOURNEYS_KEY, JSON.stringify(journeys));
}

export function getActivePan() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_PAN_KEY);
}

export function setActivePan(pan) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_PAN_KEY, pan);
}

export function clearActivePan() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACTIVE_PAN_KEY);
}

export function getJourney(pan) {
  if (!pan) return null;
  return readAll()[pan] ?? null;
}

export function saveJourney(pan, answers, onboardingStatus) {
  if (!pan) return;
  const journeys = readAll();
  journeys[pan] = {
    ...answers,
    pan,
    onboardingStatus,
    updatedAt: new Date().toISOString()
  };
  writeAll(journeys);
  setActivePan(pan);
}
