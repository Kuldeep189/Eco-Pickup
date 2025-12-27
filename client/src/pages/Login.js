import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
                  const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Invalid credentials!");
      setIsError(true);
    }
  };
  return (
    <div className="glass-form">
      <h2 className="glass-title">Welcome Back 👋</h2>

      {message && (
        <p className={`glass-msg ${isError ? "glass-error" : "glass-success"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="glass-form-inner">
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          className="glass-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          className="glass-input"
          required
        />

        <button type="submit" className="glass-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
