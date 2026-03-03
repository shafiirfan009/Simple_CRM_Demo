const path = require('path');
const express = require('express');
const {
  allowedStatuses,
  createLead,
  getAllLeads,
  getLeadById,
  updateLead
} = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'add', 'index.html'));
});

app.get('/edit', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'edit', 'index.html'));
});

app.post('/api/leads', async (req, res) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const notes = typeof req.body.notes === 'string' ? req.body.notes.trim() : '';

    if (!name) {
      res.status(400).json({ error: 'Name is required.' });
      return;
    }

    const lead = await createLead(name, notes);
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create lead.' });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const leads = await getAllLeads();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads.' });
  }
});

app.get('/api/leads/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid lead id.' });
      return;
    }

    const lead = await getLeadById(id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found.' });
      return;
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lead.' });
  }
});

app.put('/api/leads/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const status = typeof req.body.status === 'string' ? req.body.status.trim() : '';
    const notes =
      typeof req.body.notes === 'string'
        ? req.body.notes.trim()
        : undefined;

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid lead id.' });
      return;
    }

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({
        error: 'Invalid status. Allowed values: New, Contacted, Closed.'
      });
      return;
    }

    const lead = await updateLead(id, status, notes);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found.' });
      return;
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead.' });
  }
});

app.listen(PORT, () => {
  console.log(`SimpleCRM Demo running at http://localhost:${PORT}`);
});
