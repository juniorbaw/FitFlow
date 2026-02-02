const API_BASE = '';

// Leads
export async function fetchLeads(userId: string, filters?: { status?: string; minScore?: number }) {
  const params = new URLSearchParams({ user_id: userId });
  if (filters?.status) params.append('status', filters.status);
  if (filters?.minScore) params.append('min_score', filters.minScore.toString());

  const res = await fetch(`${API_BASE}/api/leads?${params}`);
  return res.json();
}

export async function updateLead(leadId: string, data: any) {
  const res = await fetch(`${API_BASE}/api/leads/${leadId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Analytics
export async function fetchAnalytics(userId: string) {
  const res = await fetch(`${API_BASE}/api/analytics?user_id=${userId}`);
  return res.json();
}

// Send DM
export async function sendDM(leadId: string, userId: string, customMessage?: string) {
  const res = await fetch(`${API_BASE}/api/ghl/send-dm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lead_id: leadId, user_id: userId, custom_message: customMessage }),
  });
  return res.json();
}

// Instagram
export async function connectInstagram(userId: string) {
  window.location.href = `${API_BASE}/api/auth/instagram`;
}

export async function refreshComments(userId: string) {
  const res = await fetch(`${API_BASE}/api/instagram/comments?user_id=${userId}`);
  return res.json();
}

// Stripe
export async function createCheckout(plan: string, userId: string, email: string) {
  const res = await fetch(`${API_BASE}/api/stripe/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, user_id: userId, email }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  }
  return data;
}

// AI Analysis
export async function analyzeComment(commentText: string, postCaption?: string, username?: string) {
  const res = await fetch(`${API_BASE}/api/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      comment_text: commentText, 
      post_caption: postCaption,
      instagram_username: username 
    }),
  });
  return res.json();
}
