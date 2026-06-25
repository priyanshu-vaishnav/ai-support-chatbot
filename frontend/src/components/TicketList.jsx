import './Ticket.css'; // CSS File Import karein

export default function TicketList({ tickets }) {
  return (
    <div className="ticket-container">
      {tickets.map((ticket) => {
        // Check kar rahe hain ki admin ne reply kiya hai ya nahi
        const isReplied = ticket.admin_reply !== null && ticket.admin_reply !== undefined && ticket.admin_reply.trim() !== "";

        return (
          <div key={ticket.id} className={`ticket-card ${isReplied ? 'card-replied' : 'card-pending'}`}>
            
            {/* Header Row */}
            <div className="ticket-header">
              <span className="category-tag">{ticket.category}</span>
              <div className="status-tags-group">
                {/* Admin Reply Status Tag */}
                <span className={`reply-status-tag ${isReplied ? 'reply-done' : 'reply-wait'}`}>
                  {isReplied ? '✓ Replied' : '⏳ Pending'}
                </span>
                <span className={`priority-tag ${ticket.priority === 'high' ? 'priority-high' : 'priority-normal'}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>

            {/* User & Issue Details */}
            <div>
              <h4 className="customer-info">
                {ticket.customer_name} <span className="customer-email">({ticket.customer_email})</span>
              </h4>
              <p className="issue-box">"{ticket.issue_text}"</p>
            </div>

            {/* AI Summary Box */}
            {ticket.ai_summary && (
              <div className="ai-box">
                <strong>✨ AI Summary:</strong> {ticket.ai_summary}
              </div>
            )}

            {/* New: Admin Reply Text Box (Sirf tabhi dikhega jab null nahi hoga) */}
            {isReplied && (
              <div className="admin-reply-box">
                <strong>💬 Admin Reply:</strong>
                <p>{ticket.admin_reply}</p>
              </div>
            )}

            {/* Footer Row */}
            <div className="ticket-footer">
              <span>
                {new Date(ticket.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </span>
              
              <span className={`status-badge ${ticket.status === 'open' ? 'status-open' : 'status-closed'}`}>
                <span className={`status-dot ${ticket.status === 'open' ? 'dot-open' : 'dot-closed'}`}></span>
                {ticket.status}
              </span>
            </div>

          </div>
        );
      })}
    </div>
  );
}
