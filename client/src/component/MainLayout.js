import React from "react";
import Sidebar from "../component/sidebar";
import "../styles/Layout.css"; 

export default function MainLayout({ children, active }) {
  return (
    <div className="layout">
      <Sidebar active={active} />
      <div className="content">{children}</div>
    </div>
  );
}
