       document.getElementById('getWeatherBtn').addEventListener('click', function() {
            const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
            const city = 'London';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    const weatherDescription = data.weather[0].description;
                    document.getElementById('weatherData').innerText = `Current weather in ${city}: ${weatherDescription}`;
                })
                .catch(error => {
                    document.getElementById('weatherData').innerText = 'Error fetching weather data: ' + error.message;
                });
        });