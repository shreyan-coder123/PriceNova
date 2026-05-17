
"use client";

const LIMIT = 10;
const STORAGE_KEY = "pricenova_searches";

export function getSearchCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
}

export function incrementSearchCount(): boolean {
  if (typeof window === "undefined") return false;
  const current = getSearchCount();
  localStorage.setItem(STORAGE_KEY, (current + 1).toString());
  return current + 1 >= LIMIT;
}

export function isUserPro(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("pricenova_pro") === "true";
}

export function setProStatus(status: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pricenova_pro", status.toString());
}
