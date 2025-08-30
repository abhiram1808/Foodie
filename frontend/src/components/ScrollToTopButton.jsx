// ScrollToTopButton.jsx
import React, { useState, useEffect } from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBottomVisible, setIsBottomVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setIsVisible(scrollTop > 300);
      setIsBottomVisible(scrollTop + windowHeight < docHeight - 300);
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

  const buttonStyle = {
    position: "fixed",
    right: "20px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "28px",
    color: "#c5d7eaff",
    zIndex: 2000,
    transition: "opacity 0.3s ease-in-out",
  };

  return (
    <>
      {/* Up Arrow */}
      <button
        onClick={scrollToTop}
        style={{
          ...buttonStyle,
          top: "45%", // vertically centered
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <FiArrowUp />
      </button>

      {/* Down Arrow */}
      <button
        onClick={scrollToBottom}
        style={{
          ...buttonStyle,
          top: "55%", // slightly below center
          opacity: isBottomVisible ? 1 : 0,
          pointerEvents: isBottomVisible ? "auto" : "none",
        }}
      >
        <FiArrowDown />
      </button>
    </>
  );
};

export default ScrollToTopButton;
