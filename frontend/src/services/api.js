const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function sendChatMessage(message, customerName, customerEmail) {
  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, customerName, customerEmail })
  });
  return res.json();
}

export async function fetchTickets() {
  const res = await fetch(`${BACKEND_URL}/api/tickets`);
  return res.json();
}

export async function resolveTicket(ticketId) {
  const res = await fetch(`${BACKEND_URL}/api/tickets/${ticketId}/resolve`, {
    method: 'PATCH'
  });
  return res.json();
}
export async function replyToTicket(ticketId, replyText) {
  const res = await fetch(`${BACKEND_URL}/api/tickets/${ticketId}/reply`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyText })
  });
  return res.json();
}