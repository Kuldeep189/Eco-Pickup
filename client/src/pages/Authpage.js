import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/Authpage.css";

const AuthPage = ({ defaultTab = "login" }) => {
  const [isLogin, setIsLogin] = useState(defaultTab === "login");

  useEffect(() => {
    setIsLogin(defaultTab === "login");
  }, [defaultTab]);

  return (
    <div className="auth-glass-bg">
      <div className="auth-glass-card">
        
        {/* Toggle Buttons */}
        <div className="auth-toggle">
          <button
            className={isLogin ? "active-tab" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active-tab" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form Section */}
        <div className="auth-content">
          {isLogin ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
