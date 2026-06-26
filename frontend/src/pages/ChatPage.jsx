import { useEffect, useState } from "react";
import { sendChatMessage } from "../services/api";
import { useAuth } from "../services/authContext";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
<<<<<<< Updated upstream
  const { user, signOut } = useAuth();
=======
  
  const { user, signOut,role } = useAuth();
  const [usertickets, setUserTickets] = useState([]);

>>>>>>> Stashed changes
  const navigate = useNavigate();

  // 1. इनिशियल स्टेट को खाली [] रखें ताकि रिफ्रेश पर क्रैश न हो
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
<<<<<<< Updated upstream
=======
  const messagesRef = useRef(null);
  console.log(role)
>>>>>>> Stashed changes

  // 2. यूज़र लोड होने पर ही पहला वेलकम मैसेज दिखाएं
  useEffect(() => {
    if (user && user.id && user.user_metadata?.username) {
      setMessages([
        { 
          sender: "ai", 
          text: `Hi! ${user.user_metadata.username}, How can I help you today?` 
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [user]);

<<<<<<< Updated upstream
=======
  useEffect(() => {
    async function getTickets() {
      if (!user?.email) return;
      try {
        const data = await fetchUserTickets(user.email);
        setUserTickets(data || []);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    }
    getTickets();
  }, [user?.email,messages]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

>>>>>>> Stashed changes
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "customer", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // 3. बिना किसी स्टेट के झंझट के सीधे यहाँ से यूज़रनेम भेजें ताकि API को तुरंत सही नाम मिले
      const currentUsername = user?.user_metadata?.username || "Guest";
      const currentEmail = user?.email || "";
      const result = await sendChatMessage(userMessage, currentUsername,currentEmail);

      if (result.type === "answer") {
        setMessages((prev) => [...prev, { sender: "ai", text: result.reply }]);
      } else if (result.type === "ticket_created") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `I've created a support ticket for this (Priority: ${result.ticket.priority}). Our team will follow up soon.`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Something went wrong, please try again." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Connection error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  // 4. यहाँ 'Navigate' की स्पेलिंग 'navigate' की गई है
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Signout failed:", err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      {user && user.id ? (
        <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial" }}>
          <h2>Customer Support Chat</h2>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              height: "400px",
              overflowY: "auto",
              padding: "16px",
              marginBottom: "12px",
              background: "#f9f9f9",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.sender === "customer" ? "right" : "left",
                  margin: "8px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background: msg.sender === "customer" ? "#4f46e5" : "#e5e7eb",
                    color: msg.sender === "customer" ? "#fff" : "#000",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <p style={{ color: "#888" }}>AI is typing...</p>}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your issue..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "10px 20px",
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
            {/* 5. बटन का नाम बदलकर 'Sign Out' कर दिया गया है */}
            <button
              onClick={handleSignOut}
              style={{
                padding: "10px 20px",
                background: "#c70c0c",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', textAlign: 'center', marginTop: "50px", fontFamily: "Arial" }}>
          "No user found. Please log in first."
        </div>
      )}
    </div>
  );
}
