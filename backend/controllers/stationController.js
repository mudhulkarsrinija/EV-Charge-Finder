const stations = require('../data/stations');

const getAllStations = (req, res) => {
    res.json({
        success: true,
        count: stations.length,
        data: stations
    });
};

const getStationById = (req, res) => {
    const id = Number(req.params.id);
    const station = stations.find(item => item.id === id);

    if (!station) {
        return res.status(404).json({
            success: false,
            message: 'Charging station not found'
        });
    }

    res.json({
        success: true,
        data: station
    });
};

const searchStations = (req, res) => {
    const query = String(req.query.q || '').trim().toLowerCase();

    const results = query
        ? stations.filter(station =>
            station.name.toLowerCase().includes(query) ||
            station.location.toLowerCase().includes(query)
        )
        : stations;

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