const express = require('express');
const cors = require('cors');

const stationRoutes = require('./routes/stationRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EV Charge Finder API!',
    status: 'Running'
  });
});

app.use('/api/stations', stationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`EV Charge Finder API running at http://localhost:${PORT}`);
});