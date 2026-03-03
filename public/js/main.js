const STATUS_OPTIONS = ['New', 'Contacted', 'Closed'];

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload;
}

function getLeadIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = Number.parseInt(params.get('id') || '', 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

window.SimpleCRM = {
  STATUS_OPTIONS,
  formatDate,
  fetchLeads: () => fetchJson('/api/leads'),
  fetchLead: (id) => fetchJson(`/api/leads/${id}`),
  createLead: (name, notes) =>
    fetchJson('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, notes })
    }),
  updateLead: (id, status, notes) =>
    fetchJson(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    }),
  updateLeadStatus: (id, status) =>
    fetchJson(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }),
  getLeadIdFromUrl
};
