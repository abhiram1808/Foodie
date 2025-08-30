// src/components/AiChat/AiChat.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";

export default function AiChat({ messages, setMessages }) {
  const { food_list } = useContext(StoreContext);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const send = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const resp = await axios.post("http://localhost:5000/api/chatbot/query", {
        query: userText,
        food_list,
      });

      if (resp.data.success) {
        const { results: items } = resp.data;
        const botText = items.length
          ? `Found ${items.length} item(s) for your request`
          : "No matching items found";

        setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
        setResults(items);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: resp.data.message || "No response" },
        ]);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error searching — check server connection." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 10, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              margin: "6px 0",
            }}
          >
            <b>{m.sender === "user" ? "You" : "Bot"}: </b>
            {m.text}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder='e.g. "Show chicken under 300 above 4 star"'
          style={{ width: "70%", padding: 8 }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{ marginLeft: 8, padding: "8px 12px" }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
