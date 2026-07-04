const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join('/tmp', 'qr_sewa_data.json');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const password = req.headers['x-admin-password'];
  if (password !== 'rahasia123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  res.json({ success: true });
};
