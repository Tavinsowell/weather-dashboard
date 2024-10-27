import { Router } from 'express';
import WeatherService from '../../service/weatherService.js';
const router = Router();

import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // Access the city name correctly from req.body
  const cityName = req.body.cityName;
  console.log("1 " + cityName);
  
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Fetch weather data
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    
    // Save city to history
    const history = await HistoryService.addCity(cityName);

    // Send both weather data and history in a single response
    return res.json({ weatherData, history });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data or save to history' });
  }
});

// TODO: GET search history
router.get('/history', async (_, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const history = await HistoryService.removeCity(id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
