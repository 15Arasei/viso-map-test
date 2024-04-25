/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { TileLayer, MapContainer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { DragEndEvent } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import './map.css'

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

const center = { lat: 49.433421, lng: 24.75224 };

export default function Map() {
  const [markers, setMarkers] = useState<{ id: number; lat: number; lng: number }[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [isClickBlocked, setIsClickBlocked] = useState<boolean>(false);

  const addMarker = (e: L.LeafletMouseEvent) => {
    if (!isClickBlocked) {
      const { lat, lng } = e.latlng;
      const id = markers.length + 1;
      setMarkers([...markers, { id, lat, lng }]);
    }
  };

  const removeMarker = (idToRemove: number) => {
    const updatedMarkers = markers.filter(marker => marker.id !== idToRemove);
    setMarkers(updatedMarkers.map((marker, index) => ({ ...marker, id: index + 1 })));
    setSelectedMarkerId(null);
    setIsClickBlocked(true);
    setTimeout(() => setIsClickBlocked(false), 0.1);
  };

  const removeAllMarkers = () => {
    setMarkers([]);
    setSelectedMarkerId(null);
  };

  const updateMarkerPosition = (idToUpdate: number, newPosition: L.LatLng) => {
    const updatedMarkers = markers.map(marker =>
      marker.id === idToUpdate ? { ...marker, lat: newPosition.lat, lng: newPosition.lng } : marker
    );
    setMarkers(updatedMarkers);
  };

  const handleDragEnd = (e: any, markerId: number) => {
    const newPosition = e.target.getLatLng();
    updateMarkerPosition(markerId, newPosition);
  };

  const handleMarkerClick = (id: number) => {
    setSelectedMarkerId(id);
  };

  useEffect(() => {
    if (isClickBlocked) {
      setTimeout(() => setIsClickBlocked(false), 1000);
    }
  }, [isClickBlocked]);

  return (
    <div className="Screen_Size">
        <MapContainer className="Map_Container"  center={center} zoom={8}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler addMarker={addMarker} isClickBlocked={isClickBlocked} />
        <button className="Button_Remove_AllMarkers" onClick={removeAllMarkers}>Clear map</button>
      <MarkerClusterGroup>
        {markers.map(marker => (
          <DraggableMarker
            key={marker.id}
            marker={marker}
            removeMarker={removeMarker}
            selectedMarkerId={selectedMarkerId}
            handleMarkerClick={handleMarkerClick}
            handleDragEnd={handleDragEnd}
          />
        ))}
        </MarkerClusterGroup>
        </MapContainer>
    </div>
  );
}

function MapClickHandler({
  addMarker,
  isClickBlocked,
}: {
  addMarker: (e: L.LeafletMouseEvent) => void;
  isClickBlocked: boolean;
}) {
  useMapEvents({
    click: (e) => {
      if (!isClickBlocked) {
        addMarker(e);
      }
    },
  });
  return null;
}

function DraggableMarker({
  marker,
  removeMarker,
  selectedMarkerId,
  handleMarkerClick,
  handleDragEnd,
}: {
  marker: { id: number; lat: number; lng: number };
  removeMarker: (id: number) => void;
  selectedMarkerId: number | null;
  handleMarkerClick: (id: number) => void;
  handleDragEnd: (e: any, id: number) => void;
}) {
  return (
    <Marker
      position={[marker.lat, marker.lng]}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          handleDragEnd(e, marker.id);
        },
        click: () => handleMarkerClick(marker.id),
      }}
    >
      <Popup>
        Marker {marker.id}
        <br />
        <button onClick={() => removeMarker(marker.id)} disabled={selectedMarkerId !== marker.id}>
          Delete
        </button>
      </Popup>
    </Marker>
  );
}