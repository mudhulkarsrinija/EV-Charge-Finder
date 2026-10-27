const stations = require('../data/stations');

// GET /api/stations
const getAllStations = (req, res) => {
  res.json({
    success: true,
    count: stations.length,
    data: stations
  });
};

// GET /api/stations/:id
const getStationById = (req, res) => {
  const id = Number(req.params.id);

  const station = stations.find(item => item.id === id);

  if (!station) {
    return res.status(404).json({
      success: false,
      message: 'Charging station not found'
    });
  }

  return res.json({
    success: true,
    data: station
  });
};

// GET /api/stations/search?q=hyderabad
const searchStations = (req, res) => {
  const query = String(req.query.q || '')
    .trim()
    .toLowerCase();

  const results = stations.filter(station => {
    return (
      station.name.toLowerCase().includes(query) ||
      station.location.toLowerCase().includes(query) ||
      station.chargerType.toLowerCase().includes(query)
    );
  });

  res.json({
    success: true,
    count: results.length,
    data: results
  });
};

module.exports = {
  getAllStations,
  getStationById,
  searchStations
};