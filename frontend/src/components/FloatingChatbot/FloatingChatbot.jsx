// src/components/FloatingChatbot/FloatingChatbot.jsx
import React, { useState, useEffect } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { MessageCircle } from "lucide-react";

import AiChat from "../AiChatbot/AiChatbot";
import "./FloatingChatbot.css";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // Add missing state

  // Load saved messages when component mounts
  useEffect(() => {
    const savedChat = localStorage.getItem("aiChatHistory");
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("aiChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <>
      {!isOpen && ( // Fix variable name
        <div className="chatbot-icon" onClick={toggleChat}>
          <MessageCircle size={28} color="white" />
        </div>
      )}

      {/* Chat Drawer */}
      <div className={`chatbot-drawer ${isOpen ? "open" : ""}`}> {/* Fix variable name */}
        <div className="chatbot-header">
          <span>AI Chatbot</span>
          <button onClick={toggleChat}>✖</button>
        </div>
        <div className="chatbot-body">
          {/* Pass messages and setter to AiChat */}
          <AiChat messages={messages} setMessages={setMessages} />
        </div>
      </div>
    </>
  );
}