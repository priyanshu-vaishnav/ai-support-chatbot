import { useEffect, useState } from "react";
import { fetchTickets, resolveTicket, replyToTicket } from "../services/api";
import { useAuth } from "../services/AuthContext";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("all");
  const { signOut } = useAuth();
  const [replyInputs, setReplyInputs] = useState({});

  const handleReplyChange = (id, text) => {
    setReplyInputs((prev) => ({ ...prev, [id]: text }));
  };

  const handleSendReply = async (id) => {
    const text = replyInputs[id];
    if (!text || !text.trim()) return;
    await replyToTicket(id, text);
    setReplyInputs((prev) => ({ ...prev, [id]: "" }));
    loadTickets();
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await fetchTickets();
    setTickets(data);
  };

  const handleResolve = async (id) => {
    await resolveTicket(id);
    loadTickets();
  };

  const filteredTickets =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const badgeStyle = (status) => ({
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#fff",
    background: status === "open" ? "#f59e0b" : "#16a34a",
  });

  const priorityColor = (p) =>
    p === "high" ? "#dc2626" : p === "medium" ? "#f59e0b" : "#16a34a";

  return (
    <div
      style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Admin Dashboard — Support Tickets</h2>
        <button
          onClick={signOut}
          style={{
            padding: "8px 16px",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginBottom: "16px" }}>
        {["all", "open", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              marginRight: "8px",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: filter === f ? "#4f46e5" : "#fff",
              color: filter === f ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #eee",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f1f1f5" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Issue</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Priority</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Summary</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
          {filteredTickets.map((t) => (
  <tr key={t.id} style={{ borderTop: "1px solid #eee" }}>
    <td style={{ padding: "12px", maxWidth: "200px" }}>
      {t.issue_text}
    </td>
    <td style={{ padding: "12px" }}>{t.category}</td>
    <td style={{ padding: "12px", color: priorityColor(t.priority), fontWeight: "bold" }}>
      {t.priority}
    </td>
    <td style={{ padding: "12px", maxWidth: "200px" }}>
      {t.ai_summary}
    </td>
    <td style={{ padding: "12px" }}>
      <span style={badgeStyle(t.status)}>{t.status}</span>
    </td>
    <td style={{ padding: "12px" }}>
                  {t.status === "open" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        minWidth: "180px",
                      }}
                    >
                      <textarea
                        value={replyInputs[t.id] || ""}
                        onChange={(e) =>
                          handleReplyChange(t.id, e.target.value)
                        }
                        placeholder="Type a reply..."
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          fontSize: "13px",
                        }}
                      />
                      <button
                        onClick={() => handleSendReply(t.id)}
                        style={{
                          background: "#4f46e5",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Send Reply & Resolve
                      </button>
                    </div>
                  )}
                  {t.status === "resolved" && t.admin_reply && (
                    <p style={{ fontSize: "13px", color: "#555" }}>
                      <strong>Replied:</strong> {t.admin_reply}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
