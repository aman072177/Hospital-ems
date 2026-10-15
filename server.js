const express = require('express');
const path = require('path');
const { PatientList, TriageQueue } = require('./structures');

const app = express();
const records = new PatientList();
const triage = new TriageQueue();
let nextId = 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const view = () => {
  const byId = (id) => records.find(id);
  return {
    waiting: triage.order().map(byId),
    records: records.toArray(),
    stats: {
      waiting: triage.emergency.size + triage.normal.size,
      emergency: triage.emergency.size,
      treated: records.toArray().filter(p => p.status === 'treated').length,
    },
  };
};

app.get('/api/state', (_req, res) => res.json(view()));

// Register a patient (priority: "emergency" | "normal")
app.post('/api/patients', (req, res) => {
  const { name, age, complaint, priority } = req.body || {};
  if (!name?.trim() || !complaint?.trim() || !['emergency', 'normal'].includes(priority))
    return res.status(400).json({ error: 'Name, complaint and priority are required.' });
  const patient = records.add({
    id: nextId++, name: name.trim(), age: Number(age) || null,
    complaint: complaint.trim(), priority, status: 'waiting',
    arrivedAt: new Date().toISOString(), treatedAt: null,
  });
  triage.enqueue(patient.id, priority);
  res.status(201).json(patient);
});

// Treat the next patient: emergency first, then normal in arrival order
app.post('/api/treat-next', (_req, res) => {
  const id = triage.dequeue();
  if (id === null) return res.status(404).json({ error: 'No patients are waiting.' });
  const p = records.find(id);
  p.status = 'treated'; p.treatedAt = new Date().toISOString();
  res.json(p);
});

// Change priority (re-queues the patient at the back of the new level)
app.patch('/api/patients/:id/priority', (req, res) => {
  const p = records.find(Number(req.params.id));
  const { priority } = req.body || {};
  if (!p || p.status !== 'waiting' || !['emergency', 'normal'].includes(priority))
    return res.status(400).json({ error: 'Only waiting patients can change priority.' });
  triage.remove(p.id); p.priority = priority; triage.enqueue(p.id, priority);
  res.json(p);
});

// Delete a record
app.delete('/api/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  triage.remove(id);
  res.json({ removed: records.remove(id) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hospital EMS running on port ${PORT}`));
