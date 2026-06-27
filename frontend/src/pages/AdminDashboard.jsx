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

  const loadTickets = async () => {
    const data = await fetchTickets();
    setTickets(data);
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

  const handleResolve = async (id) => {
    await resolveTicket(id);
    loadTickets();
  };

  const filteredTickets =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const badgeStyle = (status) => ({
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#fff",
    background: status === "open" ? "#f59e0b" : "#16a34a",
  });

  const priorityColor = (p) =>
    p === "high" ? "#dc2626" : p === "medium" ? "#f59e0b" : "#16a34a";

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Admin Control Center</p>
          <h1>Support tickets</h1>
          <p>Review incoming requests and respond quickly.</p>
        </div>
        <button className="btn btn-danger" onClick={signOut}>
          Logout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{totalTickets}</strong>
          <span>Total tickets</span>
        </div>
        <div className="stat-card">
          <strong>{openTickets}</strong>
          <span>Open</span>
        </div>
        <div className="stat-card">
          <strong>{resolvedTickets}</strong>
          <span>Resolved</span>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="toolbar">
          <div className="filter-group">
            {['all', 'open', 'resolved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip ${filter === f ? "chip-active" : ""}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <span className="muted">{filteredTickets.length} tickets shown</span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="empty-state">No tickets match this view right now.</div>
        ) : (
          <div className="table-wrap">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Summary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.issue_text}</td>
                    <td>{t.category}</td>
                    <td>
                      <span style={{ color: priorityColor(t.priority), fontWeight: 700 }}>
                        {t.priority}
                      </span>
                    </td>
                    <td>{t.ai_summary}</td>
                    <td>
                      <span className="status-badge" style={badgeStyle(t.status)}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      {t.status === "open" && (
                        <div className="action-cell">
                          <textarea
                            value={replyInputs[t.id] || ""}
                            onChange={(e) => handleReplyChange(t.id, e.target.value)}
                            placeholder="Type a reply..."
                          />
                          <div className="action-buttons">
                            <button
                              onClick={() => handleSendReply(t.id)}
                              className="btn btn-small"
                            >
                              Send reply
                            </button>
                            <button
                              onClick={() => handleResolve(t.id)}
                              className="btn btn-secondary btn-small"
                            >
                              Resolve
                            </button>
                          </div>
                        </div>
                      )}
                      {t.status === "resolved" && t.admin_reply && (
                        <p className="reply-text">
                          <strong>Replied:</strong> {t.admin_reply}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
