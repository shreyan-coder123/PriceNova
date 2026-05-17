"use client";

const STORAGE_KEY = "pricenova_searches";

export function getSearchCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
}

export function incrementSearchCount(): boolean {
  if (typeof window === "undefined") return false;
  const current = getSearchCount();
  localStorage.setItem(STORAGE_KEY, (current + 1).toString());
  // Unlimited searches - never returns true for "limit reached"
  return false;
}

export function isUserPro(): boolean {
  // Everyone is Pro now for unlimited access
  return true;
}

export function setProStatus(status: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pricenova_pro", "true");
}
