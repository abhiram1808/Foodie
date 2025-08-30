import React, { useState, useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const AiChatbotGemini = () => {
  const { food_list } = useContext(StoreContext);
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  // Send prompt to Gemini API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setMessages(prev => [...prev, { sender: "user", text: input }]);
    try {
      const prompt = `Extract filter criteria from this food search query: "${input}". Return a JSON object with keys: category, maxPrice, minRating, tags. Example: {category: 'Chicken', maxPrice: 300, minRating: 4, tags: ['non-veg']}`;
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );
      // Parse Gemini response
      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let filters = {};
      try {
        filters = JSON.parse(text.match(/{[\s\S]*}/)?.[0] || "{}");
      } catch {
        setError("AI could not understand your query. Try again.");
        setLoading(false);
        setMessages(prev => [...prev, { sender: "bot", text: "AI could not understand your query." }]);
        return;
      }
      // Filter food_list
      const filtered = food_list.filter((item) => {
        const matchesCategory = !filters.category || item.category?.toLowerCase().includes(filters.category.toLowerCase());
        const matchesPrice = !filters.maxPrice || item.price <= filters.maxPrice;
        const matchesRating = !filters.minRating || item.rating >= filters.minRating;
        const matchesTags = !filters.tags || (item.tags && filters.tags.every(tag => item.tags.includes(tag)));
        return matchesCategory && matchesPrice && matchesRating && matchesTags;
      });
      setResults(filtered);
      setMessages(prev => [...prev, { sender: "bot", text: filtered.length ? `Found ${filtered.length} item(s)` : "No items found" }]);
    } catch (err) {
      setError("Error communicating with Gemini API.");
      setMessages(prev => [...prev, { sender: "bot", text: "Error communicating with Gemini API." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h3>AI Menu Chat (Gemini)</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='e.g. "Show chicken under 300 above 4 star"'
          style={{ width: "70%", padding: 8 }}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: 8, padding: "8px 12px" }}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div style={{ marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left", margin: "6px 0" }}>
            <b>{m.sender === "user" ? "You" : "Bot"}: </b>{m.text}
          </div>
        ))}
      </div>
      <div>
        <h4>Results</h4>
        {results.length === 0 && <p>No items to show</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {results.map(item => (
            <div key={item._id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8 }}>
              <img src={item.image ? `${window.location.origin}/images/${item.image}` : ""} alt={item.name} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }} />
              <h4 style={{ margin: "8px 0 4px" }}>{item.name}</h4>
              <div>₹{item.price} • ⭐{item.rating}</div>
              <div style={{ marginTop: 6, color: "#555", fontSize: 13 }}>{item.description}</div>
            </div>
          ))}
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AiChatbotGemini;
