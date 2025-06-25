// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements
    const getWeatherButton = document.getElementById('getWeatherButton');
    const weatherDataDiv = document.getElementById('weatherData');

    // --- Configuration for OpenWeatherMap API ---
    // IMPORTANT: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key.
    // Get it from: https://openweathermap.org/api
    const API_KEY = 'YOUR_API_KEY';
    const CITY = 'London'; // The city for which to fetch weather
    
    // Construct the API URL.
    // 'units=metric' requests temperature in Celsius. Use 'units=imperial' for Fahrenheit.
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

    // Add a click event listener to the button
    getWeatherButton.addEventListener('click', async () => {
        // Clear previous data and show a loading message
        weatherDataDiv.textContent = 'Fetching weather data...';
        weatherDataDiv.style.color = '#0056b3'; // Reset color in case of previous error

        try {
            // Perform the API request using the Fetch API
            const response = await fetch(API_URL);

            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                let errorMessage = `Error: ${response.status} - ${response.statusText}.`;

                if (response.status === 401) {
                    errorMessage = 'Invalid API Key. Please check your OpenWeatherMap API key.';
                } else if (response.status === 404) {
                    errorMessage = `City not found: ${CITY}. Please check the city name or API URL.`;
                } else if (response.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
                // Throw an error to be caught by the catch block
                throw new Error(errorMessage);
            }

            // Parse the JSON response body
            const data = await response.json();
            console.log('API Response:', data); // Log the full response for debugging

            // Extract relevant weather information
            // Check if essential data exists to prevent errors if API response structure changes
            if (data && data.weather && data.weather.length > 0 && data.main) {
                const weatherDescription = data.weather[0].description;
                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const humidity = data.main.humidity;
                const windSpeed = data.wind.speed; // Wind speed in meters/sec by default with units=metric

                // Capitalize the first letter of the weather description for better readability
                const formattedDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

                // Update the weatherDataDiv with the retrieved information
                weatherDataDiv.innerHTML = `
                    <p><strong>Current weather in ${CITY}:</strong> ${formattedDescription}</p>
                    <p>Temperature: ${temperature}°C (Feels like: ${feelsLike}°C)</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                `;
                weatherDataDiv.style.color = '#0056b3'; // Set to success color
            } else {
                // Handle cases where expected data is missing from the API response
                weatherDataDiv.textContent = 'Failed to parse weather data. Unexpected API response structure.';
                weatherDataDiv.style.color = '#dc3545'; // Set to error color
                console.error('Unexpected API response structure:', data);
            }

        } catch (error) {
            // Catch any errors that occurred during the fetch operation or parsing
            console.error('Error fetching weather data:', error);
            weatherDataDiv.textContent = `Error: ${error.message}. Please try again or check console for details.`;
            weatherDataDiv.style.color = '#dc3545'; // Set to error color
        }
    });
});