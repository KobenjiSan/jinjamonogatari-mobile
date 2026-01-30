// Messages sent FROM the WebView TO React Native
export type MapWebViewEvent =
  | { type: "MAP_READY" }
  | { type: "MARKER_PRESS"; shrineId: number }
  | { type: "VIEWPORT_CHANGED"; bounds: unknown };

// Messages sent FROM React Native TO the WebView
export type MapWebViewCommand =
  | { type: "SET_MARKERS"; payload: unknown }
  | { type: "FOCUS_SHRINE"; shrineId: number };