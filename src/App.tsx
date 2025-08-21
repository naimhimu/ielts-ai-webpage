import React, { useState, useRef } from "react";

// 1. Define who can send messages and what a Message looks like
type Sender = "user" | "ai";

interface Message {
  sender: Sender;
  text: string;
  image?: string | null;  // optional image field
}

function App() {
  // 2. Tell React this is a Message[]
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! How can I help you with IELTS today?" }
  ]);

  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // 3. Type your ref as any SpeechRecognition instance (or null)
  const recognitionRef = useRef<any>(null);

  const handleSend = () => {
    if (!input.trim() && !image) return;

    // 4. Now this lines up with the Message interface
    setMessages([
      ...messages,
      { sender: "user", text: input, image }
    ]);

    setInput("");
    setImage(null);

    // TODO: trigger AI reply and setMessages([{ sender: "ai", text: reply }])
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser.");
      return;
    }

    // initialize and start recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
    };
    recognitionRef.current.start();
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        border: "1px solid #eee",
        borderRadius: 8,
        boxShadow: "0 2px 8px #ccc",
        padding: 24,
        background: "#fafafa"
      }}
    >
      <h2 style={{ textAlign: "center" }}>IELTS AI Chat</h2>

      <div style={{ minHeight: 300, marginBottom: 16 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "8px 0"
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 16px",
                borderRadius: 16,
                background: msg.sender === "user" ? "#d1e7dd" : "#e2e3e5"
              }}
            >
              {msg.text}

              {msg.image && (
                <div>
                  <img
                    src={msg.image}
                    alt="uploaded"
                    style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }}
                  />
                </div>
              )}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          title="Voice Input"
          style={{
            marginLeft: 4,
            padding: "6px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "#555",
            fontSize: "18px",
            cursor: "pointer"
          }}
          onClick={handleVoiceInput}
        >
          🎤
        </button>

        <label style={{ marginLeft: 4, cursor: "pointer" }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <span
            style={{
              display: "inline-block",
              padding: "6px",
              borderRadius: "50%",
              background: "transparent",
              color: "#555",
              fontSize: "18px"
            }}
          >
            🖼️
          </span>
        </label>

        <button
          style={{
            marginLeft: 4,
            padding: "6px 12px",
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "#0d6efd",
            fontWeight: "bold",
            cursor: "pointer"
          }}
          onClick={handleSend}
        >
          ➤
        </button>
      </div>

      {image && (
        <div style={{ marginTop: 8 }}>
          <img src={image} alt="preview" style={{ maxWidth: 100, borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}

export default App;
