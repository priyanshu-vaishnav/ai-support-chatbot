const supabase = require('../config/supabaseClient');

async function createTicket({ issueText, category, priority, summary, customerName, customerEmail }) {
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      issue_text: issueText,
      category,
      priority,
      ai_summary: summary,
      customer_name: customerName || null,
      customer_email: customerEmail || null,
      status: 'open'
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function getAllTickets() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

async function updateTicketStatus(id, status) {
  const { data, error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function replyToTicket(id, replyText) {
  const { data, error } = await supabase
    .from('tickets')
    .update({ admin_reply: replyText, status: 'resolved' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
module.exports = { createTicket, getAllTickets, updateTicketStatus ,replyToTicket};