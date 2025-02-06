const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
async function getWeatherAtLocation({ location }) {
    try {
        const coordResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${apiKey}`);
        if (!coordResponse.ok) {
            throw new Error(`HTTPS error! Status: ${coordResponse.status}`);
        }
        const coordinates = await coordResponse.json();

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0].lat}&lon=${coordinates[0].lon}&units=metric&appid=${apiKey}`);
        if (!weatherResponse.ok) {
            throw new Error(`HTTPS error! Status: ${weatherResponse.status}`);
        }
        const weatherInfo = await weatherResponse.json();
        return weatherInfo;
    } catch (error) {
        console.error(error);
    }
}

async function getFlightInformation({ flyingFrom, flyingTo }) {
    return `Flying from ${flyingFrom} to ${flyingTo}`
}

async function getHotelInformation({ location }) {
    return `Hotels in ${location}`
}

const tools = [
    {
        type: 'function',
        function: {
            function: getWeatherAtLocation,
            parse: JSON.parse,
            parameters: {
                type: 'object',
                properties: {
                    location: { type: 'string' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            function: getFlightInformation,
            parse: JSON.parse,
            parameters: {
                type: 'object',
                properties: {
                    flyingFrom: { type: 'string' },
                    flyingTo: { type: 'string' }
                }
            }
        }
    },
    {
        type: 'function',
        function: {
            function: getHotelInformation,
            parse: JSON.parse,
            parameters: {
                type: 'object',
                properties: {
                    location: { type: 'string' }
                }
            }
        }
    },
];

export default tools;