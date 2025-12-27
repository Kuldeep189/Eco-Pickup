import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const ref = useRef(null);

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Create socket WITH auth (THIS IS THE KEY FIX)
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;

    socketRef.current = io("http://localhost:5000", {
      auth: {
        userId: user.id
      }
    });

    // 🔔 Listen for notifications
    socketRef.current.on("notification", (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ❌ Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    setNotifications(n =>
      n.map(item => ({ ...item, read: true }))
    );
  };

  return (
    <div className="notif-wrapper" ref={ref}>
      <button
        className={`notif-bell ${unreadCount ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead}>Mark all read</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="notif-empty">No notifications</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`notif-item ${n.read ? "read" : "unread"}`}
              >
                {n.text}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
