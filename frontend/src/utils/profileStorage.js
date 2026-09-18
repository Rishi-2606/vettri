const KEY = "vettri.profile";

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
}

export const EMPTY_PROFILE = {
  // personal
  fullName: "",
  age: "",
  gender: "",
  category: "",
  // location
  district: "",
  // financial
  annualIncome: "",
  education: "",
  // business
  businessStatus: "",       // new | existing
  businessIdea: "",
  businessCategory: "",
  projectCost: "",
  fundingRequired: "",
};