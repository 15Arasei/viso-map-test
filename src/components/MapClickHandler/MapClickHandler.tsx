import { useMapEvents } from "react-leaflet";
import L from "leaflet";

type Props = {
  addMarker: (e: L.LeafletMouseEvent) => void;
};

export function MapClickHandler({ addMarker }: Props) {
  useMapEvents({
    click: (e) => {
      addMarker(e);
    },
  });

  return null;
}
