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
  markerIcons: { defaultUri: string; selectedUri: string };
};

export function buildMapHtml({
  apiKey,
  center,
  zoom,
  markers,
  userLocation,
  markerIcons,
}: BuildMapHtmlParams): string {
  const markersJson = JSON.stringify(markers);
  const markerIconsJson = JSON.stringify(markerIcons);
  const userLocationJson = JSON.stringify(userLocation ?? null);

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
      html, body, #map {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>

  <body>
    <div id="map"></div>

    <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
    <script>
      const markers = ${markersJson};
      const markerIcons = ${markerIconsJson};
      const userLocation = ${userLocationJson};

      function sendToRN(payload) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      }

      // Debug errors back to RN
      window.onerror = function (message, source, lineno, colno, error) {
        sendToRN({
          type: "WEB_ERROR",
          message: String(message),
          source: String(source),
          line: lineno,
          col: colno,
          stack: error && error.stack ? String(error.stack) : null
        });
      };

      const map = new maplibregl.Map({
        container: "map",
        // style: "https://api.maptiler.com/maps/dataviz/style.json?key=${apiKey}",
        style: "https://api.maptiler.com/maps/019c2031-d766-7298-bdc2-c88076ef2f99/style.json?key=${apiKey}",
        center: [${center.lng}, ${center.lat}],
        zoom: ${zoom}
      });

      // ---- Selection state ----
      let selectedShrineId = null;

      // Store the INNER img so we can scale safely without breaking MapLibre positioning
      const markerImgById = new Map();

      function setSelectedMarker(id) {
        // revert previous
        if (selectedShrineId != null) {
          const prevImg = markerImgById.get(selectedShrineId);
          if (prevImg) {
            prevImg.src = markerIcons.defaultUri;
            prevImg.style.transform = "scale(1)";
          }
        }

        selectedShrineId = (typeof id === "number") ? id : null;

        // apply new
        if (selectedShrineId != null) {
          const nextImg = markerImgById.get(selectedShrineId);
          if (nextImg) {
            nextImg.src = markerIcons.selectedUri;
            nextImg.style.transform = "scale(1.18)";
          }
        }
      }

      // ---- Press scale (applied to INNER img, not wrapper) ----
      function addPressScale(img, markerId) {
        img.style.transition = "transform 0.12s ease";
        img.style.transformOrigin = "center center";

        function isSelected() {
          return selectedShrineId === markerId;
        }

        function down() {
          if (!isSelected()) img.style.transform = "scale(0.92)";
        }

        function up() {
          if (!isSelected()) img.style.transform = "scale(1)";
        }

        img.addEventListener("mousedown", down);
        img.addEventListener("mouseup", up);
        img.addEventListener("mouseleave", up);

        img.addEventListener("touchstart", down);
        img.addEventListener("touchend", up);
        img.addEventListener("touchcancel", up);
      }

      // ---- RN → WebView messages ----
      function handleRNMessage(event) {
        try {
          const raw = (typeof event.data === "string") ? event.data : "";
          const msg = JSON.parse(raw);

          if (msg.type === "CLEAR_SELECTED_SHRINE") {
            setSelectedMarker(null);
          }

          if (msg.type === "SET_SELECTED_SHRINE") {
            setSelectedMarker(msg.shrineId);
          }
        } catch (e) {}
      }

      window.addEventListener("message", handleRNMessage);
      document.addEventListener("message", handleRNMessage);

      // ---- Create markers ----
      markers.forEach((m) => {
        // Wrapper: MapLibre owns this element's transform (positioning)
        const wrapper = document.createElement("div");
        wrapper.style.width = "42px";
        wrapper.style.height = "42px";
        wrapper.style.cursor = "pointer";

        // Inner image: WE own transform here (scale animations)
        const img = document.createElement("img");
        img.src = markerIcons.defaultUri;
        img.style.width = "42px";
        img.style.height = "42px";
        img.style.userSelect = "none";
        img.style.webkitUserSelect = "none";
        img.style.display = "block";

        addPressScale(img, m.id);

        wrapper.appendChild(img);
        markerImgById.set(m.id, img);

        new maplibregl.Marker({ element: wrapper })
          .setLngLat([m.lon, m.lat])
          .addTo(map);

        wrapper.addEventListener("click", (e) => {
          e.stopPropagation();
          setSelectedMarker(m.id);
          sendToRN({ type: "MARKER_PRESS", shrineId: m.id });
        });
      });

      // ---- User location dot ----
      if (
        userLocation &&
        typeof userLocation.lat === "number" &&
        typeof userLocation.lon === "number"
      ) {
        const dot = document.createElement("div");
        dot.style.width = "12px";
        dot.style.height = "12px";
        dot.style.borderRadius = "999px";
        dot.style.backgroundColor = "#2563EB";
        dot.style.border = "2px solid #FFFFFF";
        dot.style.boxShadow = "0 0 0 6px rgba(37,99,235,0.25)";

        new maplibregl.Marker({ element: dot })
          .setLngLat([userLocation.lon, userLocation.lat])
          .addTo(map);
      }

      map.on("load", () => {
        sendToRN({ type: "MAP_READY" });
      });
    </script>
  </body>
</html>`;
}
