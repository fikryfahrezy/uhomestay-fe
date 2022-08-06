import type { Marker, MapMouseEvent, EventData } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useEffect } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import { RiMapPinFill } from "react-icons/ri";
import IconButton from "@/components/iconbutton";
import styles from "./Styles.module.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESSTOKEN ?? "";

const defaultFunc = () => {};

type MapLayoutProps = {
  lng: number;
  lat: number;
  isEditable?: boolean;
  onClick?: (e: MapMouseEvent & EventData) => void;
};

const MapLayout = ({
  lng,
  lat,
  onClick = defaultFunc,
  isEditable = true,
}: MapLayoutProps) => {
  const zoom = 9;

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const mapMarker = useRef<Marker | null>(null);

  const onLocateMapPin = () => {
    if (!map.current) return;

    map.current.flyTo({
      center: [lng, lat],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once

    if (mapContainer.current === null) return;

    const center: [number, number] = [lng, lat];
    const newMap = new mapboxgl.Map({
      center,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: zoom,
    });

    // Create a default Marker and add it to the map.
    const newMarker = new mapboxgl.Marker({}).setLngLat(center).addTo(newMap);

    // Add zoom and rotation controls to the map.
    newMap.addControl(new mapboxgl.NavigationControl());

    map.current = newMap;
    mapMarker.current = newMarker;
  });

  useEffect(() => {
    if (!map.current || !isEditable) return; // wait for map to initialize

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      mapMarker.current?.setLngLat([lng, lat]);

      if (typeof onClick === "function") {
        onClick(e);
      }
    });
  });

  useEffect(() => {
    if (!map.current) return;

    mapMarker.current?.setLngLat([lng, lat]);
    map.current.flyTo({
      center: [lng, lat],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  }, [lat, lng]);

  return (
    <div className={styles.mapOuter}>
      <IconButton
        type="button"
        className={styles.mapMarkerBtn}
        onClick={() => onLocateMapPin()}
      >
        <RiMapPinFill />
      </IconButton>
      <div ref={mapContainer} className={styles.mapContainer} />
    </div>
  );
};

export default MapLayout;
