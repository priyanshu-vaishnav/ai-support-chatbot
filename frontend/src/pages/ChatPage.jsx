import { useEffect, useState, useRef } from "react";
import { sendChatMessage } from "../services/api";
import { useAuth } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchUserTickets } from "../services/api";
import TicketList from "../components/TicketList";
import "./ChatPage.css";

export default function ChatPage() {
  const { user, signOut } = useAuth();
  const [usertickets, setUserTickets] = useState([]);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (user && user.id && user.user_metadata?.username) {
      setMessages([
        {
          sender: "ai",
          text: `Hi! ${user.user_metadata.username}, How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [user]);

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
  }, [user?.email]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      { sender: "customer", text: userMessage, timestamp: now },
    ]);
    setInput("");
    setLoading(true);

    try {
      const currentUsername = user?.user_metadata?.username || "Guest";
      const currentEmail = user?.email || "";
      const result = await sendChatMessage(
        userMessage,
        currentUsername,
        currentEmail,
      );

      if (result?.type === "answer") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: result.reply,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else if (result?.type === "ticket_created") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `I've created a support ticket for this (Priority: ${result.ticket.priority}). Our team will follow up soon. Ticket ID: ${result.ticket.id}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Something went wrong, please try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Connection error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Signout failed:", err?.message || err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  

  return (
    <div>
      {user && user.id ? (
        <div className="chat-page">
          <aside className="sidebar">
            <div className="sidebar-top">
              <h3>Support Tickets</h3>
              <button className="signout-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
            <TicketList tickets={usertickets} />
          </aside>

          <main className="chat-area">
            <header className="chat-header">
              <h2>Customer Support Chat</h2>
              <div className="user-info">
                {user.user_metadata?.username || user.email}
              </div>
            </header>

            <div className="messages" ref={messagesRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message-row ${msg.sender === "customer" ? "msg-right" : "msg-left"}`}
                >
                  <div
                    className={`message-bubble ${msg.sender === "customer" ? "bubble-customer" : "bubble-ai"}`}
                  >
                    <div className="message-text">{msg.text}</div>
                    <div className="message-meta">
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              ))}
              {loading && <div className="typing">AI is typing...</div>}
            </div>

            <div className="composer">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your issue briefly..."
                className="composer-input"
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </main>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "20px",
            textAlign: "center",
            marginTop: "50px",
            fontFamily: "Arial",
          }}
        >
          No user found. Please log in first.
        </div>
      )}
    </div>
  );
}
