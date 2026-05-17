"use client";

const SEARCH_STORAGE_KEY = "pricenova_searches_v2";
const PRO_STORAGE_KEY = "pricenova_pro_v2";
const FREE_LIMIT = 10;

export function getSearchCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(SEARCH_STORAGE_KEY) || "0", 10);
}

export function isUserPro(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PRO_STORAGE_KEY) === "true";
}

/**
 * Increments search count. 
 * Returns true if the limit has been reached and the user needs to upgrade.
 */
export function incrementSearchCount(): boolean {
  if (typeof window === "undefined") return false;
  if (isUserPro()) return false;

  const current = getSearchCount();
  if (current >= FREE_LIMIT) {
    return true;
  }

  localStorage.setItem(SEARCH_STORAGE_KEY, (current + 1).toString());
  return false;
}

export function setProStatus(status: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRO_STORAGE_KEY, status ? "true" : "false");
}

export function getRemainingSearches(): number {
  if (isUserPro()) return Infinity;
  return Math.max(0, FREE_LIMIT - getSearchCount());
}
