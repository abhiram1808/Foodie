import React, { useState, useEffect } from "react";
import { BsChatDots } from "react-icons/bs";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function FloatingToolbar({ onChatClick }) {
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setShowScrollUp(scrollTop > 50);
      setShowScrollDown(scrollTop + windowHeight < docHeight - 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const chatBtnStyle = {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    transition: "background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease",
  };

  const arrowStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    color: "#007bff",
    fontSize: "26px",
    transition: "color 0.3s ease, transform 0.2s ease",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        zIndex: 2000,
      }}
    >
      {/* Scroll Up */}
      {showScrollUp && (
        <button style={arrowStyle} onClick={scrollToTop} title="Scroll to Top">
          <FiArrowUp />
        </button>
      )}

      {/* Chat Button */}
      <button
        style={chatBtnStyle}
        onClick={onChatClick}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
      >
        <BsChatDots size={22} />
      </button>

      {/* Scroll Down */}
      {showScrollDown && (
        <button style={arrowStyle} onClick={scrollToBottom} title="Scroll to Bottom">
          <FiArrowDown />
        </button>
      )}
    </div>
  );
}
