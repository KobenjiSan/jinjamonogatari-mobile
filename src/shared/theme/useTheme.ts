import { useSyncExternalStore } from "react";

import { lightTheme } from "./lightTheme";
import { darkTheme } from "./darkTheme";
import { sacredTheme } from "./sacredTheme";
import { forestTheme } from "./forestTheme";
import { indigoTheme } from "./indigoTheme";

import { obsidianInkTheme } from "./obsidianInkTheme";
import { lanternVermilionTheme } from "./lanternVermilionTheme";
import { cedarNightTheme } from "./cedarNightTheme";

// Theme Types

export type ThemeMode =
  | "light"
  | "dark"
  | "sacred"
  | "forest"
  | "indigo"
  | "obsidian"
  | "lantern"
  | "cedar";

// Internal Theme Store

let activeTheme: ThemeMode = "light";

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}


// Public API

export function setTheme(mode: ThemeMode) {
  activeTheme = mode;
  emitChange();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return activeTheme;
}

// Theme Resolver

function resolveTheme(mode: ThemeMode) {
  switch (mode) {
    case "light":
      return lightTheme;

    case "dark":
      return darkTheme;

    case "sacred":
      return sacredTheme;

    case "forest":
      return forestTheme;

    case "indigo":
      return indigoTheme;

    case "obsidian":
      return obsidianInkTheme;

    case "lantern":
      return lanternVermilionTheme;

    case "cedar":
      return cedarNightTheme;

    default:
      return lightTheme;
  }
}

// Hooks

export function useTheme() {
  const mode = useSyncExternalStore(subscribe, getSnapshot);
  return resolveTheme(mode);
}

export function useThemeMode() {
  return useSyncExternalStore(subscribe, getSnapshot);
}