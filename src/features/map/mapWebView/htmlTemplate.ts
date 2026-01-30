import type { MapMarker } from "../useTestMarkers";

type WebMapMarker = {
  id: number;
  lat: number;
  lon: number;
};

type BuildMapHtmlParams = {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  markers: WebMapMarker[];
  userLocation?: { lat: number; lon: number };
};

export function buildMapHtml({
  apiKey,
  center,
  zoom,
  markers,
  userLocation,
}: BuildMapHtmlParams): string {
  // Embed markers directly into the HTML as JSON for now (fastest path).
  // Later, we can push markers via postMessage using the bridge.
  const markersJson = JSON.stringify(markers);

  

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <style>
      html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
    </style>
  </head>

  <body>
    <div id="map"></div>

    <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
    <script>
      const map = new maplibregl.Map({
        container: "map",
        style: "https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}",
        center: [${center.lng}, ${center.lat}],
        zoom: ${zoom}
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      // --- Markers (from React Native) ---
      const markers = ${markersJson};
      const userLocation = ${JSON.stringify(userLocation ?? null)};

      function sendToRN(payload) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      }

      markers.forEach((m) => {
        const marker = new maplibregl.Marker().setLngLat([m.lon, m.lat]).addTo(map);

        const el = marker.getElement();
        el.style.cursor = "pointer";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          sendToRN({ type: "MARKER_PRESS", shrineId: m.id });
        });
      });

      if (userLocation && typeof userLocation.lat === "number" && typeof userLocation.lon === "number") {
        const dot = document.createElement("div");
        dot.style.width = "12px";
        dot.style.height = "12px";
        dot.style.borderRadius = "999px";
        dot.style.backgroundColor = "#2563EB";       // blue
        dot.style.border = "2px solid #FFFFFF";      // white ring
        dot.style.boxShadow = "0 0 0 6px rgba(37, 99, 235, 0.25)"; // soft aura

        new maplibregl.Marker({ element: dot })
          .setLngLat([userLocation.lon, userLocation.lat])
          .addTo(map);
      }
    </script>
  </body>
</html>`;
}