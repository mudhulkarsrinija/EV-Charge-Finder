const express = require('express');

const {
  getAllStations,
  getStationById,
  searchStations
} = require('../controllers/stationController');

const router = express.Router();

router.get('/', getAllStations);
router.get('/search', searchStations);
router.get('/:id', getStationById);

module.exports = router;