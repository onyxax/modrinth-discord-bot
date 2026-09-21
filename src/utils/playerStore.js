const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'players.json');
let players = [];

const load = () => {
  try {
    if (fs.existsSync(filePath)) {
      players = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to load players:', err);
  }
};

const save = () => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
  } catch (err) {
    console.error('Failed to save players:', err);
  }
};

const axios = require('axios');

load();

const syncWithMCTiers = async () => {
  try {
    const { data } = await axios.get('https://mctiers.com/api/v2/mode/overall?count=50', { timeout: 5000 });
    if (Array.isArray(data)) {
      data.forEach(p => {
        if (p.name && !players.some(existing => existing.toLowerCase() === p.name.toLowerCase())) {
          players.push(p.name);
        }
      });
      // Keep last 100 for safety
      if (players.length > 100) players = players.slice(0, 100);
      save();
    }
  } catch (err) {
    console.error('Failed to sync with MCTiers:', err.message);
  }
};

// Add some default popular names if empty
if (players.length === 0) {
  players = ['Notch', 'Dream', 'Technoblade', 'GeorgeNotFound', 'Sapnap', 'Philza', 'CaptainSparklez', 'TommyInnit'];
  save();
}

// Initial sync
syncWithMCTiers();

module.exports = {
  addPlayer(username) {
    if (!username) return;
    // Remove if exists to move to top
    players = players.filter(p => p.toLowerCase() !== username.toLowerCase());
    players.unshift(username);
    // Keep last 50
    if (players.length > 50) players = players.slice(0, 50);
    save();
  },
  getPlayers(query = '') {
    if (!query) return players.slice(0, 25);
    return players
      .filter(p => p.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 25);
  }
};
