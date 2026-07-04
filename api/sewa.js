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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nominal, noDana, atasNama, noWa, keluhan } = req.body;

  if (!nominal || !noDana || !atasNama || !noWa) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  const data = readData();
  const entry = {
    id: Date.now(),
    nominal,
    noDana,
    atasNama,
    noWa,
    keluhan: keluhan || '',
    waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    bukti: 'uploaded' // Vercel gak bisa simpan file, kita simpan flag aja
  };

  data.push(entry);
  writeData(data);

  res.json({
    success: true,
    message: 'Sewa berhasil! QR akan dikirim ke WhatsApp Anda.',
    id: entry.id
  });
};
