document.addEventListener('DOMContentLoaded', () => {
    const getWeatherButton = document.getElementById('getWeatherButton');
    const weatherDataDiv = document.getElementById('weatherData');

    // IMPORTANT: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
    // You can get one from: https://openweathermap.org/api
    const API_KEY = 'YOUR_API_KEY'; 
    const CITY = 'London';
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`; // &units=metric for Celsius

    getWeatherButton.addEventListener('click', async () => {
        weatherDataDiv.textContent = 'Fetching weather data...'; // Provide immediate feedback

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                if (response.status === 401) {
                    errorMessage = 'Invalid API Key. Please check your API key on OpenWeatherMap and ensure it is active.';
                } else if (response.status === 404) {
                    errorMessage = `City not found: ${CITY}. Please check the city name.`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log(data); // Log the full API response for debugging

            if (data.weather && data.weather.length > 0 && data.main) {
                const weatherDescription = data.weather[0].description;
                const temperature = data.main.temp;
                const humidity = data.main.humidity;
                const feelsLike = data.main.feels_like;

                // Capitalize the first letter of the description
                const formattedWeatherDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

                weatherDataDiv.textContent = `Current weather in London: ${formattedWeatherDescription}. Temperature: ${temperature}°C (feels like ${feelsLike}°C). Humidity: ${humidity}%.`;
            } else {
                weatherDataDiv.textContent = 'Could not parse weather data. API response missing expected fields.';
                console.error('API response structure unexpected:', data);
            }

        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherDataDiv.textContent = `Failed to retrieve weather data: ${error.message}`;
        }
    });
});