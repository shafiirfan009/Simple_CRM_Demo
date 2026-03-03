const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dbDir, 'leads.db');
const allowedStatuses = ['New', 'Contacted', 'Closed'];

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL CHECK (status IN ('New','Contacted','Closed')),
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL
    )
  `);
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row || null);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

async function createLead(name, notes = '') {
  const now = new Date().toISOString();
  const result = await run(
    `
      INSERT INTO leads (name, notes, status, created_at, updated_at)
      VALUES (?, ?, 'New', ?, ?)
    `,
    [name, notes, now, now]
  );
  return getLeadById(result.id);
}

function getAllLeads() {
  return all('SELECT * FROM leads ORDER BY id DESC');
}

function getLeadById(id) {
  return get('SELECT * FROM leads WHERE id = ?', [id]);
}

async function updateLeadStatus(id, status) {
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid status value');
  }

  const now = new Date().toISOString();
  const result = await run(
    'UPDATE leads SET status = ?, updated_at = ? WHERE id = ?',
    [status, now, id]
  );

  if (result.changes === 0) {
    return null;
  }

  return getLeadById(id);
}

async function updateLead(id, status, notes) {
  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid status value');
  }

  const now = new Date().toISOString();
  let result;

  if (typeof notes === 'string') {
    result = await run(
      'UPDATE leads SET status = ?, notes = ?, updated_at = ? WHERE id = ?',
      [status, notes, now, id]
    );
  } else {
    result = await run(
      'UPDATE leads SET status = ?, updated_at = ? WHERE id = ?',
      [status, now, id]
    );
  }

  if (result.changes === 0) {
    return null;
  }

  return getLeadById(id);
}

module.exports = {
  allowedStatuses,
  createLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  updateLead
};
