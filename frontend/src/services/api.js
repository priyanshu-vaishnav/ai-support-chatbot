import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' }
})

export async function sendChatMessage(message, customerName, customerEmail) {
  try {
    const res = await axiosInstance.post('/api/chat', { message, customerName, customerEmail })
    return res.data
  } catch (err) {
    console.error('sendChatMessage error:', err)
    return { type: 'error', reply: 'Connection error. Please try again.' }
  }
}

export async function fetchTickets() {
  try {
    const res = await axiosInstance.get('/api/tickets')
    return res.data
  } catch (err) {
    console.error('fetchTickets error:', err)
    return []
  }
}
export async function fetchUserTickets(customerEmail) {
  try {
    const res = await axiosInstance.post('/api/usertickets',{customerEmail})
    return res.data
  } catch (err) {
    console.error('fetchTickets error:', err)
    return []
  }
}

export async function resolveTicket(ticketId) {
  try {
    const res = await axiosInstance.patch(`/api/tickets/${ticketId}/resolve`)
    return res.data
  } catch (err) {
    console.error('resolveTicket error:', err)
    return null
  }
}

export async function replyToTicket(ticketId, replyText) {
  try {
    const res = await axiosInstance.patch(`/api/tickets/${ticketId}/reply`, { replyText })
    return res.data
  } catch (err) {
    console.error('replyToTicket error:', err)
    return null
  }
}