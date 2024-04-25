import { useState } from "react";
import L from "leaflet";
import { TileLayer, MapContainer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { DraggableMarker } from "../DraggableMarker/DraggableMarker";
import { MapClickHandler } from "../MapClickHandler/MapClickHandler";
import "leaflet/dist/leaflet.css";
import "./Map.css";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

const INITIAL_COORDINATES = { lat: 49.433421, lng: 24.75224 };

type Marker = { id: number; lat: number; lng: number };

export default function Map() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  const addMarker = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const id = markers.length + 1;
    const newMarker = { id, lat, lng };

    setMarkers([...markers, newMarker]);
  };

  const removeMarker = (idToRemove: number) => {
    const updatedMarkers = markers.filter((marker) => marker.id !== idToRemove);
    setMarkers(
      updatedMarkers.map((marker, index) => ({ ...marker, id: index + 1 }))
    );
    setSelectedMarkerId(null);
  };

  const removeAllMarkers = () => {
    setMarkers([]);
    setSelectedMarkerId(null);
  };

  const updateMarkerPosition = (idToUpdate: number, newPosition: L.LatLng) => {
    const updatedMarkers = markers.map((marker) =>
      marker.id === idToUpdate
        ? { ...marker, lat: newPosition.lat, lng: newPosition.lng }
        : marker
    );
    setMarkers(updatedMarkers);
  };

  const handleDragEnd = (e: L.DragEndEvent, markerId: number) => {
    const newPosition = e.target.getLatLng();
    updateMarkerPosition(markerId, newPosition);
  };

  const handleMarkerClick = (id: number) => {
    setSelectedMarkerId(id);
  };

  return (
    <MapContainer className="Map" center={INITIAL_COORDINATES} zoom={8}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler addMarker={addMarker} />
      <button className="Map_ClearButton" onClick={removeAllMarkers}>
        Remove all markers
      </button>
      <MarkerClusterGroup>
        {markers.map((marker) => (
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
  );
}
