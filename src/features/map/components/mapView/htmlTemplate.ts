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
      const initialUserLocation = ${userLocationJson};

      const JAPAN_BOUNDS = [
        [128.0, 28.0],
        [148.0, 45.75],
      ];

      function sendToRN(payload) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      }

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
        style: "https://api.maptiler.com/maps/019c2031-d766-7298-bdc2-c88076ef2f99/style.json?key=${apiKey}",
        center: [${center.lng}, ${center.lat}],
        zoom: ${zoom},
        interactive: true,
        maxBounds: JAPAN_BOUNDS,
        renderWorldCopies: false
      });

      let mapLoaded = false;

      let followUser = true;           
      let userIsGesturing = false;     
      let cameraIntervalId = null;

      function disableFollow() {
        followUser = false;
      }
      function enableFollow() {
        followUser = true;
      }

      map.on("movestart", (e) => {
        if (e && e.originalEvent) {
          userIsGesturing = true;
          disableFollow();
        }
      });
      map.on("moveend", (e) => {
        if (e && e.originalEvent) {
          userIsGesturing = false;
        }
      });
      map.on("zoomstart", (e) => {
        if (e && e.originalEvent) {
          userIsGesturing = true;
          disableFollow();
        }
      });
      map.on("zoomend", (e) => {
        if (e && e.originalEvent) {
          userIsGesturing = false;
        }
      });

      let selectedShrineId = null;
      const markerImgById = new Map();

      function setSelectedMarker(id) {
        if (selectedShrineId != null) {
          const prevImg = markerImgById.get(selectedShrineId);
          if (prevImg) {
            prevImg.src = markerIcons.defaultUri;
            prevImg.style.transform = "scale(1)";
          }
        }

        selectedShrineId = (typeof id === "number") ? id : null;

        if (selectedShrineId != null) {
          const nextImg = markerImgById.get(selectedShrineId);
          if (nextImg) {
            nextImg.src = markerIcons.selectedUri;
            nextImg.style.transform = "scale(1.18)";
          }
        }
      }

      function addPressScale(img, markerId) {
        img.style.transition = "transform 0.12s ease";
        img.style.transformOrigin = "center center";

        function isSelected() { return selectedShrineId === markerId; }
        function down() { if (!isSelected()) img.style.transform = "scale(0.92)"; }
        function up() { if (!isSelected()) img.style.transform = "scale(1)"; }

        img.addEventListener("mousedown", down);
        img.addEventListener("mouseup", up);
        img.addEventListener("mouseleave", up);

        img.addEventListener("touchstart", down);
        img.addEventListener("touchend", up);
        img.addEventListener("touchcancel", up);
      }

      let userMarker = null;
      let pendingUserLoc = null;

      let targetUserLoc = null;   
      let renderedUserLoc = null; 

      const DOT_SMOOTHING = 0.18; 
      const SNAP_METERS = 20;

      function ensureUserMarker() {
        if (userMarker) return userMarker;

        const dot = document.createElement("div");
        dot.style.width = "12px";
        dot.style.height = "12px";
        dot.style.borderRadius = "999px";
        dot.style.backgroundColor = "#2563EB";
        dot.style.border = "2px solid #FFFFFF";
        dot.style.boxShadow = "0 0 0 6px rgba(37,99,235,0.25)";

        userMarker = new maplibregl.Marker({ element: dot });
        return userMarker;
      }

      function metersBetween(a, b) {
        const dLat = (a.lat - b.lat);
        const dLon = (a.lon - b.lon);
        return Math.sqrt(dLat * dLat + dLon * dLon) * 111000;
      }

      function setUserLocationTarget(lat, lon) {
        if (typeof lat !== "number" || typeof lon !== "number") return;

        if (!mapLoaded) {
          pendingUserLoc = { lat, lon };
          return;
        }

        targetUserLoc = { lat, lon };

        if (!renderedUserLoc) {
          renderedUserLoc = { lat, lon };
          ensureUserMarker().setLngLat([lon, lat]).addTo(map);

          map.jumpTo({ center: [lon, lat], zoom: Math.max(map.getZoom(), 20) });
          return;
        }

        const jumpMeters = metersBetween(targetUserLoc, renderedUserLoc);
        if (jumpMeters > SNAP_METERS) {
          renderedUserLoc = { lat, lon };
          ensureUserMarker().setLngLat([lon, lat]).addTo(map);
        }
      }

      function tickDot() {
        if (!mapLoaded) return;

        if (targetUserLoc && renderedUserLoc) {
          const rl = renderedUserLoc;
          const tl = targetUserLoc;

          renderedUserLoc = {
            lat: rl.lat + (tl.lat - rl.lat) * DOT_SMOOTHING,
            lon: rl.lon + (tl.lon - rl.lon) * DOT_SMOOTHING,
          };

          ensureUserMarker()
            .setLngLat([renderedUserLoc.lon, renderedUserLoc.lat])
            .addTo(map);
        }

        requestAnimationFrame(tickDot);
      }

      function startCameraFollowLoop() {
        if (cameraIntervalId) clearInterval(cameraIntervalId);

        cameraIntervalId = setInterval(() => {
          if (!mapLoaded) return;
          if (!followUser) return;
          if (userIsGesturing) return;
          if (!renderedUserLoc) return;

          map.easeTo({
            center: [renderedUserLoc.lon, renderedUserLoc.lat],
            duration: 300
          });
        }, 150); 
      }

      function handleRNMessage(event) {
        try {
          const raw = (typeof event.data === "string") ? event.data : "";
          const msg = JSON.parse(raw);

          if (msg.type === "CLEAR_SELECTED_SHRINE") {
            setSelectedMarker(null);
            return;
          }

          if (msg.type === "SET_SELECTED_SHRINE") {
            setSelectedMarker(msg.shrineId);
            return;
          }

          if (msg.type === "USER_LOCATION_UPDATE") {
            setUserLocationTarget(msg.lat, msg.lon);
            return;
          }

          if (msg.type === "RECENTER_USER") {
            enableFollow();
            userIsGesturing = false;
            setUserLocationTarget(msg.lat, msg.lon);

            if (typeof msg.lat === "number" && typeof msg.lon === "number") {
              map.easeTo({ center: [msg.lon, msg.lat], duration: 450 });
            }
            return;
          }

          if (msg.type === "FOLLOW_ON") {
            enableFollow();
            userIsGesturing = false;
            return;
          }

          if (msg.type === "FOLLOW_OFF") {
            disableFollow();
            return;
          }
        } catch (e) {}
      }

      window.addEventListener("message", handleRNMessage);
      document.addEventListener("message", handleRNMessage);

      markers.forEach((m) => {
        const wrapper = document.createElement("div");
        wrapper.style.width = "42px";
        wrapper.style.height = "42px";
        wrapper.style.cursor = "pointer";

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

      map.on("load", () => {
        mapLoaded = true;
        map.setMaxBounds(JAPAN_BOUNDS);

        if (pendingUserLoc) {
          setUserLocationTarget(pendingUserLoc.lat, pendingUserLoc.lon);
          pendingUserLoc = null;
        }

        if (
          initialUserLocation &&
          typeof initialUserLocation.lat === "number" &&
          typeof initialUserLocation.lon === "number"
        ) {
          setUserLocationTarget(initialUserLocation.lat, initialUserLocation.lon);
        }

        requestAnimationFrame(tickDot);
        startCameraFollowLoop();

        sendToRN({ type: "MAP_READY" });
      });
    </script>
  </body>
</html>`;
}