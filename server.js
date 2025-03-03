const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;
const GEO_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'

app.use(express.json());

// In-memory storage for subscribers
const subscribers = [];

// Subscribe endpoint
app.post('/subscribe', (req, res) => {
  const { phone, city } = req.body;
  if (!phone || !city) {
    return res.status(400).json({ error: 'Phone number and city are required' });
  }

  subscribers.push({ phone, city });
  res.status(200).json({ message: 'Subscription successful', subscriber: { phone, city } });
});

// Fetch weather and send alerts
app.get('/weather-alerts', async (req, res) => {
  if (subscribers.length === 0) {
    return res.status(200).json({ message: 'No subscribers to alert' });
  }

  for (const { phone, city } of subscribers) {
    try {

      const loc = await axios.get(GEO_API_URL, {
        params: {
          q: city,
          appid: API_KEY,
          limit: 5
        }
      });

      const { lat, lon } = loc.data[0];

      const weather_res = await axios.get(WEATHER_API_URL, {
        params: {
          lat: lat,
          lon: lon,
          appid: API_KEY
        }

      });

      const weather = weather_res.data.weather[0].description;
      console.log(`Weather Alert for ${phone}: It's ${weather} in ${city}.`);
    } catch (error) {
      console.error(`Failed to fetch weather for ${city}:`, error.message);
    }


  }

  res.status(200).json({ message: 'Weather alerts sent (logged in console)' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
