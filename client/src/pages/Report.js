import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../component/MainLayout";
import "../styles/Report.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [38, 38],
});

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function Report() {
  const [formData, setFormData] = useState({
    location: "",
    address: "",
    description: "",
    image: null,
    lat: null,
    lng: null,
  });

  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  // Get user’s current GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
          setFormData((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        },
        (err) => console.error("GPS error:", err)
      );
    } else {
      alert("Geolocation not supported in this browser.");
    }
  }, []);

  // Handle text change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Camera functions
  const startCamera = async () => {
    setUseCamera(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL("image/png");
      setPreview(imgData);
      setFormData({ ...formData, image: imgData });
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setUseCamera(false);
  };

  // Submit
const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Validate coordinates and image
  if (!formData.lat || !formData.lng) {
    alert("Please select a location on the map.");
    return;
  }

  const data = new FormData();

  // Append all fields
  data.append("location", formData.location);
  data.append("address", formData.address);
  data.append("description", formData.description);
  data.append("lat", formData.lat);
  data.append("lng", formData.lng);

  // 🧍 Include user ID from localStorage if logged in
  const user = JSON.parse(localStorage.getItem("user"));
 if (user?._id || user?.id) {
  data.append("userId", user._id || user.id);
}

  // 📸 Handle image (file or captured base64)
  if (formData.image instanceof File) {
    data.append("image", formData.image);
  } else if (typeof formData.image === "string" && formData.image.startsWith("data:image")) {
    // Convert base64 image to Blob
    const blob = await (await fetch(formData.image)).blob();
    data.append("image", blob, "captured.png");
  }

  try {
    const res = await fetch("http://localhost:5000/api/garbage/report", {
      method: "POST",
      body: data,
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Upload failed");

    console.log("✅ Report submitted:", result);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);

    // Reset form after success
    setFormData({
      location: "",
      address: "",
      description: "",
      image: null,
      lat: null,
      lng: null,
    });
    setPreview(null);
  } catch (err) {
    console.error("❌ Submission failed:", err);
    alert("Error submitting report. Check server logs.");
  }
};


  return (
    <MainLayout active="report">
      <div className="report-page">
        <h2 className="report-title">🗺️ Report Garbage Location</h2>
        <p className="report-subtitle">
          Click on the map or allow GPS to auto-detect your location 🌍
        </p>

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Location Name:</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Near Bus Stand"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address / Landmark:</label>
            <input
              type="text"
              name="address"
              placeholder="e.g. Sector 21, Delhi"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Describe the garbage spot..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* 🌍 Map Section */}
          <div className="form-group">
            <label>Select Location on Map:</label>
            <div className="map-container">
              {currentPosition ? (
                <MapContainer
                  center={currentPosition}
                  zoom={14}
                  style={{ height: "250px", borderRadius: "10px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker
                    position={[formData.lat || currentPosition[0], formData.lng || currentPosition[1]]}
                    icon={markerIcon}
                  />
                  <LocationPicker
                    onLocationSelect={(coords) =>
                      setFormData((prev) => ({
                        ...prev,
                        lat: coords.lat,
                        lng: coords.lng,
                      }))
                    }
                  />
                </MapContainer>
              ) : (
                <p>Loading map...</p>
              )}
            </div>
            {formData.lat && (
              <p className="coords">
                📍 Selected: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* 📸 Image Capture / Upload */}
          <div className="form-group">
            <label>Attach Photo:</label>
            {!useCamera ? (
              <div className="upload-options">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImage}
                />
                <button type="button" className="camera-btn" onClick={startCamera}>
                  📷 Open Camera
                </button>
              </div>
            ) : (
              <div className="camera-container">
                <video ref={videoRef} autoPlay className="camera-view" />
                <div className="camera-actions">
                  <button type="button" onClick={captureImage}>✅ Capture</button>
                  <button type="button" onClick={stopCamera}>❌ Cancel</button>
                </div>
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>
            )}

            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn">
            🚀 Submit Report
          </button>
        </form>

        {submitted && (
          <div className="submit-popup">
            ✅ Report submitted successfully with location & image! 💚
          </div>
        )}
      </div>
    </MainLayout>
  );
}
