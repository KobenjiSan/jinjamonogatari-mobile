import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type WebMapMarker = {
  id: number;
  lat: number;
  lon: number;
};

type MarkerIcons = {
  defaultUri: string;
  selectedUri: string;
};

type UserLocation = {
  lat: number;
  lon: number;
};

type MapViewWebProps = {
  markers: WebMapMarker[];
  markerIcons: MarkerIcons | null;
  onMarkerPress?: (shrineId: number) => void;
  selectedShrineId: number | null;
  userLocation: UserLocation | null;
  followOn: boolean;
};

export default function MapViewWeb({
  markers,
  markerIcons,
  onMarkerPress,
  selectedShrineId,
  userLocation,
  followOn,
}: MapViewWebProps) {
  const [mapReady, setMapReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedShrineIdRef = useRef<number | null>(null);
  const markerImgByIdRef = useRef<Map<number, HTMLImageElement>>(new Map());

  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    markerImgByIdRef.current.clear();
    selectedShrineIdRef.current = null;

    // render map
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/019c2031-d766-7298-bdc2-c88076ef2f99/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_KEY}`,
      center: [135.7681, 35.0116],
      zoom: 17,
      interactive: true,
      renderWorldCopies: false,
      maxBounds: [
        [128.0, 28.0],
        [148.0, 45.75],
      ],
    });

    mapRef.current = map;

    function addPressScale(img: HTMLImageElement, markerId: number) {
      img.style.transition = "transform 0.12s ease";
      img.style.transformOrigin = "center center";

      function isSelected() {
        return selectedShrineIdRef.current === markerId;
      }

      function down() {
        if (!isSelected()) {
          img.style.transform = "scale(0.92)";
        }
      }

      function up() {
        if (!isSelected()) {
          img.style.transform = "scale(1)";
        }
      }

      img.addEventListener("mousedown", down);
      img.addEventListener("mouseup", up);
      img.addEventListener("mouseleave", up);

      img.addEventListener("touchstart", down);
      img.addEventListener("touchend", up);
      img.addEventListener("touchcancel", up);
    }

    // load markers
    map.on("load", () => {
      markers.forEach((m) => {
        setMapReady(true);

        if (!markerIcons) return;
        if (markers.length === 0) return;

        const wrapper = document.createElement("div");
        wrapper.style.width = "42px";
        wrapper.style.height = "42px";
        wrapper.style.cursor = "pointer";

        const img = document.createElement("img");
        img.src = markerIcons?.defaultUri ?? "";
        img.style.width = "42px";
        img.style.height = "42px";
        img.style.display = "block";
        img.style.userSelect = "none";

        addPressScale(img, m.id);

        wrapper.appendChild(img);
        markerImgByIdRef.current.set(m.id, img);

        new maplibregl.Marker({ element: wrapper })
          .setLngLat([m.lon, m.lat])
          .addTo(map);

        wrapper.addEventListener("click", (e) => {
          e.stopPropagation();
          onMarkerPress?.(m.id);
        });
      });
    });

    return () => {
      map.remove();
      markerImgByIdRef.current.clear();
      selectedShrineIdRef.current = null;
      mapRef.current = null;
      userMarkerRef.current = null;
      setMapReady(false);
    };
  }, [markers, markerIcons, onMarkerPress]);

  useEffect(() => {
    if (!markerIcons) return;

    const icons = markerIcons;

    const prevId = selectedShrineIdRef.current;

    // clear previous
    if (prevId != null) {
      const prevImg = markerImgByIdRef.current.get(prevId);
      if (prevImg) {
        prevImg.src = icons.defaultUri;
        prevImg.style.transform = "scale(1)";
      }
    }

    // set new
    if (selectedShrineId != null) {
      const nextImg = markerImgByIdRef.current.get(selectedShrineId);
      if (nextImg) {
        nextImg.src = icons.selectedUri;
        nextImg.style.transform = "scale(1.18)";
      }
    }

    selectedShrineIdRef.current = selectedShrineId;
  }, [selectedShrineId, markerIcons]);

  useEffect(() => {
    console.log("WEB userLocation:", userLocation);
    console.log("WEB mapRef:", mapRef.current);

    if (!mapReady) return;
    if (!mapRef.current) return;
    if (!userLocation) return;

    const map = mapRef.current;

    // create marker once
    if (!userMarkerRef.current) {
      const dot = document.createElement("div");
      dot.style.width = "12px";
      dot.style.height = "12px";
      dot.style.borderRadius = "999px";
      dot.style.backgroundColor = "#2563EB";
      dot.style.border = "2px solid #FFFFFF";
      dot.style.boxShadow = "0 0 0 6px rgba(37,99,235,0.25)";

      userMarkerRef.current = new maplibregl.Marker({ element: dot })
        .setLngLat([userLocation.lon, userLocation.lat])
        .addTo(map);

      return;
    }

    // update position
    userMarkerRef.current.setLngLat([userLocation.lon, userLocation.lat]);
  }, [userLocation, mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    if (!mapRef.current) return;
    if (!userLocation) return;
    if (!followOn) return;

    mapRef.current.easeTo({
      center: [userLocation.lon, userLocation.lat],
      zoom: Math.max(mapRef.current.getZoom(), 15),
      duration: 450,
    });
  }, [followOn, userLocation, mapReady]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
