import React, { useEffect, useState, useRef } from "react";
import "./NotificationBellSocket.css";
import { toast } from "react-toastify";

// 🔁 Helper lưu ID thông báo đã hiện trong localStorage
const getSeenIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem("seenNotificationIds") || "[]"));
  } catch {
    return new Set();
  }
};

const addSeenId = (id) => {
  const seen = getSeenIds();
  seen.add(id);
  localStorage.setItem("seenNotificationIds", JSON.stringify([...seen]));
};

const NotificationBellSocket = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/notifications/user/${userId}`);
        const data = await res.json();

        const seen = getSeenIds();
        const newNotified = data.filter(n => !n.is_read && !seen.has(n.notification_id));

        newNotified.forEach((n) => {
          const toastId = `notif-${n.notification_id}`;
          if (!toast.isActive(toastId)) {
            toast.info(`🔔 ${n.message}`, { toastId });
            addSeenId(n.notification_id);
          }
        });

        setNotifications(data);
      } catch (err) {
        console.error("❌ Poll lỗi:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
        method: "PUT",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("❌ Không thể đánh dấu đã đọc:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="notification-btn" ref={dropdownRef}>
      <div onClick={() => setShowDropdown((prev) => !prev)}>
        <i className="icon-notification">🔔</i>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="no-notification">Không có thông báo</div>
          ) : (
            notifications.slice(0, 5).map((n) => (
              <div
                key={n.notification_id}
                className={`notification-item ${n.is_read ? "read" : "unread"}`}
                onClick={() => markAsRead(n.notification_id)}
              >
                <div className="message">{n.message}</div>
                <div className="meta">Dự án #{n.project_id}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBellSocket;
