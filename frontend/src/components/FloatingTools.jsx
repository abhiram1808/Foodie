import React, { useState, useEffect } from "react";
import { FiMessageCircle, FiArrowUp } from "react-icons/fi";

export default function FloatingTools() {
  const [showChat, setShowChat] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  // Show scroll button only after some scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 2000,
        }}
      >
        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FiMessageCircle size={20} />
        </button>
      </div>

      {/* Scroll to Top Button */}
      <div
        style={{
          position: "fixed",
          bottom: 80, // 👈 above chatbot
          right: 20,
          zIndex: 2000,
          opacity: showScroll ? 1 : 0,
          pointerEvents: showScroll ? "auto" : "none",
          transition: "opacity 0.4s ease-in-out",
        }}
      >
        <button
          onClick={scrollToTop}
          style={{
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FiArrowUp size={20} />
        </button>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 80,
            width: "300px",
            height: "400px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            zIndex: 3000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            Chatbot
            <span
              style={{
                float: "right",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setShowChat(false)}
            >
              ✖
            </span>
          </div>
          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {/* Chat content here */}
            <p>Hi! How can I help you today?</p>
          </div>
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              placeholder="Type a message..."
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
