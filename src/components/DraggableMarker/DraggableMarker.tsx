import { Marker, Popup } from "react-leaflet";
import "./DraggableMarker.css";

type Props = {
  marker: { id: number; lat: number; lng: number };
  removeMarker: (id: number) => void;
  selectedMarkerId: number | null;
  handleMarkerClick: (id: number) => void;
  handleDragEnd: (e: L.DragEndEvent, id: number) => void;
};

export function DraggableMarker({
  marker,
  removeMarker,
  selectedMarkerId,
  handleMarkerClick,
  handleDragEnd,
}: Props) {
  const handleRemoveMarker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeMarker(marker.id);
  };
  return (
    <Marker
      position={[marker.lat, marker.lng]}
      draggable
      eventHandlers={{
        dragend: (e) => {
          handleDragEnd(e, marker.id);
        },
        click: () => handleMarkerClick(marker.id),
      }}
    >
      <Popup>
        <span>Marker {marker.id}</span>
        <button
          className="Marker_DeleteButton"
          onClick={handleRemoveMarker}
          disabled={selectedMarkerId !== marker.id}
        >
          Delete
        </button>
      </Popup>
    </Marker>
  );
}
