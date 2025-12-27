import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../component/MainLayout";
import "../styles/Report.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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


function RecenterOnMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16); // 16 = zoom level
    }
  }, [position, map]);

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
  
  const [mapType, setMapType] = useState("street"); // "street" | "sat"
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [currentPosition, setCurrentPosition] = useState(null);
  const mapRef = useRef(null); // 👉 to control map (setView)

  // Get user’s current GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const coords = [latitude, longitude];
          setCurrentPosition(coords);
          setFormData((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        },
        (err) => {
          console.error("GPS error:", err);
          // fallback coordinate (India center) if GPS denied
          const fallback = [20.5937, 78.9629];
          setCurrentPosition(fallback);
        }
      );
    } else {
      alert("Geolocation not supported in this browser.");
    }
  }, []);

  // Handle text change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setUseCamera(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
      toast.error("Unable to access camera.");
    }
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
      setFormData((prev) => ({ ...prev, image: imgData }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setUseCamera(false);
  };

  // 👉 NEW: Search typed location/address and move map
  const handleSearchLocation = async () => {
    const query = (formData.location || formData.address || "").trim();
    if (!query) {
      toast.error("Please enter a location or address first.");
      return;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;

      const res = await fetch(url, {
        headers: {
          // polite header (optional, but good for Nominatim usage policy)
          "Accept-Language": "en",
        },
      });

      const data = await res.json();

      if (!data || data.length === 0) {
        toast.error("No matching location found on the map.");
        return;
      }

      const { lat, lon } = data[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);

      // Update marker + map center
      setCurrentPosition([latNum, lonNum]);
      setFormData((prev) => ({
        ...prev,
        lat: latNum,
        lng: lonNum,
      }));

      if (mapRef.current) {
        mapRef.current.setView([latNum, lonNum], 16);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      toast.error("Error finding location on map.");
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.lat === null || formData.lng === null) {
      alert("Please select a location on the map.");
      return;
    }

    const data = new FormData();

    data.append("location", formData.location);
    data.append("address", formData.address);
    data.append("description", formData.description);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?._id || storedUser?.id) {
      data.append("userId", storedUser._id || storedUser.id);
    }

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    } else if (
      typeof formData.image === "string" &&
      formData.image.startsWith("data:image")
    ) {
      try {
        const blob = await (await fetch(formData.image)).blob();
        data.append("image", blob, "captured.png");
      } catch (err) {
        console.error("Base64 to Blob error:", err);
        toast.error("Error processing captured image.");
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:5000/api/garbage/report", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      console.log("Server response:", res.status, result);

      if (!res.ok) {
        throw new Error(result.error || "Upload failed");
      }

      console.log("✅ Report submitted:", result);
      toast.success(
        `+5 Eco Points added! 🌱 Your total is now ${result.updatedPoints} pts.`,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );

      if (storedUser) {
        storedUser.points = result.updatedPoints;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

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
          Type a place or click on the map to select the garbage spot 🌍
        </p>

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Location Name:</label>
            <div className="inline-input">
              <input
                type="text"
                name="location"
                placeholder="e.g. Near Bus Stand"
                value={formData.location}
                onChange={handleChange}
                required
              />
              {/* 👉 Button to search & move map */}
              <button
                type="button"
                className="search-map-btn"
                onClick={handleSearchLocation}
              >
               Find on Map
              </button>
            </div>
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
                (() => {
                  // Decide where the marker is
                  const markerPosition =
                    formData.lat !== null && formData.lng !== null
                      ? [formData.lat, formData.lng]
                      : currentPosition;

                  return (
                    <MapContainer
                      center={currentPosition}
                      zoom={14}
                      style={{ height: "250px", borderRadius: "10px" }}
                    >
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="Tiles © Esri — Source: Esri, Earthstar Geographics, and the GIS User Community"
                      />

                      {/* Marker at either selected or current position */}
                      <Marker position={markerPosition} icon={markerIcon} />

                      {/* Click-on-map handler */}
                      <LocationPicker
                        onLocationSelect={(coords) =>
                          setFormData((prev) => ({
                            ...prev,
                            lat: coords.lat,
                            lng: coords.lng,
                          }))
                        }
                      />

                      {/* 👉 This will recenter the map whenever markerPosition changes */}
                      <RecenterOnMarker position={markerPosition} />
                    </MapContainer>
                  );
                })()
              ) : (
                <p>Loading map...</p>
              )}
            </div>

            {formData.lat !== null && formData.lng !== null && (
              <p className="coords">
               Selected: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
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
                <button
                  type="button"
                  className="camera-btn"
                  onClick={startCamera}
                >
                  📷 Open Camera
                </button>
              </div>
            ) : (
              <div className="camera-container">
                <video ref={videoRef} autoPlay className="camera-view" />
                <div className="camera-actions">
                  <button type="button" onClick={captureImage}>
                    ✅ Capture
                  </button>
                  <button type="button" onClick={stopCamera}>
                    ❌ Cancel
                  </button>
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
      <ToastContainer />
    </MainLayout>
  );
}
