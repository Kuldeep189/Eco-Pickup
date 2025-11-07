import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon path
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const GarbageMap = () => {
  // Example garbage locations
  const garbageReports = [
    { id: 1, lat: 28.6139, lng: 77.2090, description: "Garbage near park" },
    { id: 2, lat: 19.0760, lng: 72.8777, description: "Dump near roadside" },
  ];

  return (
    <div style={{ height: "500px", marginTop: 20 }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {garbageReports.map((report) => (
          <Marker key={report.id} position={[report.lat, report.lng]}>
            <Popup>{report.description}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GarbageMap;
