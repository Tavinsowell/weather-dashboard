import dotenv from 'dotenv';
import fetch from 'node-fetch';
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
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  iconDescription: string;


  constructor( city: string, temperature: number, humidity: number, windSpeed: number, icon: string, iconDescription: string) {
    this.city = city;
    this.date = moment().format('MM/DD/YYYY');
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
    this.iconDescription = iconDescription;
    

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
  private async fetchLocationData(city: string): Promise<{ lat: number, lon: number }> {
    const apiKey = process.env.API_KEY;  // Make sure API_KEY is defined in your .env file
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
  
    const data: any = await response.json();
    console.log("data " + data);
  
 
    return  data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData.coord;
    console.log("lat " + lat);
    console .log("lon " + lon);
    return { lat, lon};
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.WEATHER_API_KEY}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(city);
    console.log("locationdata " + locationData);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    console.log("fetch coords " + coordinates.lat + " " + coordinates.lon);

    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    // Accessing the first item in the list array for current weather
 
    return new Weather(
      response.city.name || '',
      response.list[0].main.temp || 0,
      response.list[0].main.humidity || 0,
      response.list[0].wind.speed || 0,
      response.list[0].weather[0].icon || '',
      response.list[0].weather[0].description
    );
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any) {
    const forecastArray = [];
    for (let i = 1; i < 6; i++) {
      forecastArray.push({
        date: moment().add(i, 'days').format('MM/DD/YYYY'),
        icon: weatherData.list[i].weather[0].icon,
        temp: weatherData.list[i].main.temp,
        humidity: weatherData.list[i].main.humidity,
        wind: weatherData.list[i].wind.speed,
        description: weatherData.list[i].weather[0].description,
      });
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    console.log("2 " + coordinates.lat + " " + coordinates.lon);
    const weatherData: any = await this.fetchWeatherData(coordinates);
    console.log("3 " +  weatherData);
    const currentWeather = this.parseCurrentWeather(weatherData);
    console.log("4 " + currentWeather);
    const forecast = this.buildForecastArray(weatherData);
    return { currentWeather, forecast };
  }
}

export default new WeatherService();
