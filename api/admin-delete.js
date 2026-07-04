const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join('/tmp', 'qr_sewa_data.json');

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch {}
  return [];
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const password = req.headers['x-admin-password'];
  if (password !== 'rahasia123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID required' });

  let data = readData();
  const filtered = data.filter(item => item.id !== parseInt(id));

  if (data.length === filtered.length) {
    return res.status(404).json({ error: 'Data not found' });
  }

  writeData(filtered);
  res.json({ success: true });
};
