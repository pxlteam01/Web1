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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const password = req.headers['x-admin-password'];
  if (password !== 'rahasia123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const data = readData();
  res.json(data);
};
