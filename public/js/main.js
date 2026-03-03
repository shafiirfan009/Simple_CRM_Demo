const STATUS_OPTIONS = ['New', 'Contacted', 'Closed'];
const STORAGE_KEY = 'simplecrm_demo_leads';
let fallbackMode = false;

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
    const err = new Error(payload.error || 'Request failed.');
    err.status = response.status;
    throw err;
  }

  return payload;
}

function getStoredLeads() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setStoredLeads(leads) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function nextLeadId(leads) {
  return leads.reduce((maxId, lead) => Math.max(maxId, Number(lead.id) || 0), 0) + 1;
}

function localFetchLeads() {
  return getStoredLeads().sort((a, b) => b.id - a.id);
}

function localFetchLead(id) {
  const lead = getStoredLeads().find((entry) => Number(entry.id) === Number(id));
  if (!lead) {
    const err = new Error('Lead not found.');
    err.status = 404;
    throw err;
  }
  return lead;
}

function localCreateLead(name, notes) {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';
  if (!trimmedName) {
    const err = new Error('Name is required.');
    err.status = 400;
    throw err;
  }

  const leads = getStoredLeads();
  const now = new Date().toISOString();
  const lead = {
    id: nextLeadId(leads),
    name: trimmedName,
    notes: trimmedNotes,
    status: 'New',
    created_at: now,
    updated_at: now
  };

  leads.push(lead);
  setStoredLeads(leads);
  return lead;
}

function localUpdateLead(id, status, notes) {
  if (!STATUS_OPTIONS.includes(status)) {
    const err = new Error('Invalid status. Allowed values: New, Contacted, Closed.');
    err.status = 400;
    throw err;
  }

  const leads = getStoredLeads();
  const index = leads.findIndex((entry) => Number(entry.id) === Number(id));
  if (index === -1) {
    const err = new Error('Lead not found.');
    err.status = 404;
    throw err;
  }

  const now = new Date().toISOString();
  const updated = {
    ...leads[index],
    status,
    updated_at: now
  };

  if (typeof notes === 'string') {
    updated.notes = notes.trim();
  }

  leads[index] = updated;
  setStoredLeads(leads);
  return updated;
}

function shouldFallback(err) {
  if (!err) {
    return false;
  }

  if (err.name === 'TypeError') {
    return true;
  }

  return [404, 405, 500, 501, 502, 503, 504].includes(err.status);
}

async function withFallback(apiCall, localCall) {
  if (fallbackMode) {
    return localCall();
  }

  try {
    return await apiCall();
  } catch (err) {
    if (shouldFallback(err)) {
      fallbackMode = true;
      return localCall();
    }
    throw err;
  }
}

function getLeadIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = Number.parseInt(params.get('id') || '', 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

window.SimpleCRM = {
  STATUS_OPTIONS,
  formatDate,
  fetchLeads: () =>
    withFallback(
      () => fetchJson('/api/leads'),
      () => localFetchLeads()
    ),
  fetchLead: (id) =>
    withFallback(
      () => fetchJson(`/api/leads/${id}`),
      () => localFetchLead(id)
    ),
  createLead: (name, notes) =>
    withFallback(
      () =>
        fetchJson('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, notes })
        }),
      () => localCreateLead(name, notes)
    ),
  updateLead: (id, status, notes) =>
    withFallback(
      () =>
        fetchJson(`/api/leads/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, notes })
        }),
      () => localUpdateLead(id, status, notes)
    ),
  updateLeadStatus: (id, status) =>
    withFallback(
      () =>
        fetchJson(`/api/leads/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        }),
      () => localUpdateLead(id, status)
    ),
  getLeadIdFromUrl
};
