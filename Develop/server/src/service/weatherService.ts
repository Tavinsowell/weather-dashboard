import dotenv from 'dotenv';
// import fetch from 'node-fetch';
import moment from 'moment';


dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  icon: string;
  constructor(city: string, temperature: number, humidity: number, windSpeed: number, uvIndex: number, icon: string) {
    this.city = city;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.uvIndex = uvIndex;
    this.icon = icon;
  }
}




// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  constructor() {
    if (!process.env.API_KEY) {
      throw new Error('WEATHER_API_KEY is not defined in the environment variables');
    }
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    return await response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${process.env.WEATHER_API_KEY}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(
      response.name,
      response.main.temp,
      response.main.humidity,
      response.wind.speed,
      response.uvi,
      response.weather[0].icon
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any) {
    const forecastArray = [];
    for (let i = 1; i < 6; i++) {
      forecastArray.push({
        date: moment().add(i, 'days').format('MM/DD/YYYY'),
        icon: weatherData.daily[i].weather[0].icon,
        temp: weatherData.daily[i].temp.day,
        humidity: weatherData.daily[i].humidity,
      });
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecast = this.buildForecastArray(weatherData);
    return { currentWeather, forecast };
  }
}

export default new WeatherService();
