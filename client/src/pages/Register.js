import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar") {
      const file = files[0];
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file)); // ✅ live preview
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    if (formData.avatar) data.append("avatar", formData.avatar);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", data);

      setMessage(res.data.message || "✅ Registered successfully!");
      setIsSuccess(true);
      setFormData({ fullName: "", email: "", phone: "", password: "", avatar: null });
      setPreview(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong!");
      setIsSuccess(false);
    }
  };

  return (
    <div className="glass-form">
      <h2 className="glass-title">Create Account 🚀</h2>

      {message && (
        <p className={`glass-msg ${isSuccess ? "glass-success" : "glass-error"}`}>
          {message}
        </p>
      )}

      {/* Preview image */}
      {preview && <img src={preview} alt="Preview" className="avatar-preview" />}

      <form onSubmit={handleSubmit} className="glass-form-inner">
        <input
          className="glass-input"
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          className="glass-input"
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="glass-input"
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          className="glass-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label className="upload-label">Upload Profile Picture 📷</label>
        <input className="file-input" type="file" name="avatar" accept="image/*" onChange={handleChange} />

        <button className="glass-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
