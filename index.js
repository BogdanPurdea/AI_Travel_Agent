import OpenAI from "openai";
import tools from "./tools";
import formatDate from "./utils/date"

const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
});

const startButton = document.getElementById('start-button');
const planButton = document.getElementById('plan-button');
const decrementButton = document.getElementById('decrement-button');
const incrementButton = document.getElementById('increment-button');
const openingSection = document.querySelector('.opening-section');
const inputSection = document.querySelector('.input-section');
const outputSection = document.querySelector('.output-section');
const budgetInput = document.getElementById("budget");
const departureInput = document.getElementById('flying-from')
const destinationInput = document.getElementById('flying-to')

const messages = [
    {
        role: 'system', content: 'You are a helpfull AI travel agent. You will be provided the number of travellers, the departure and destination locations, the departure and return dates, and the budget. You are tasked with providing the current weather of the destination, information on flights that can be booked in order to reach the destination and information on hotels to book at the destination. It is your task aswell to manage the budget when handling flights and hotels information. You will have access to a set of tools to achieve each of these tasks. Prioritize making use of these tools to complete your tasks. Do not make up false information. Respon in a JSON format: { weather: "", flights: "", hotel: ""}.'
    }
];

budgetInput.addEventListener('input', function () {
    if (!budgetInput.value.startsWith("$")) {
        budgetInput.value = "$" + budgetInput.value.replace(/^\$/, "");
    }
});


departureInput.addEventListener('input', capitalizeWord);

destinationInput.addEventListener('input', capitalizeWord);

decrementButton.addEventListener('click', (event) => {
    event.preventDefault();
    const travellerCounter = getTravellerCounter();
    if (travellerCounter.textContent > 1)
        travellerCounter.textContent = parseInt(travellerCounter.textContent) - 1;
});
incrementButton.addEventListener('click', (event) => {
    event.preventDefault();
    const travellerCounter = getTravellerCounter();
    if (travellerCounter.textContent < 10)
        travellerCounter.textContent = parseInt(travellerCounter.textContent) + 1;
});

startButton.addEventListener('click', (event) => {
    const form = document.getElementById("trip-form");
    const submitButton = document.getElementById("plan-button");

    function checkFormValidity() {
        submitButton.disabled = !form.checkValidity();
    }

    // Listen for changes on all required inputs
    form.querySelectorAll("input[required]").forEach(input => {
        input.addEventListener("input", checkFormValidity);
    });

    // Initial check in case the browser pre-fills fields
    checkFormValidity();
    openingSection.style.display = 'none';
    inputSection.style.display = 'flex';
});
planButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const result = await travelAgent(formatQuery());
    renderResults(result);
    inputSection.style.display = 'none';
    outputSection.style.display = 'flex';
});

function capitalizeWord() {
    if (this.value.length > 0) {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1);
    }
}

function getTravellerCounter() {
    return document.querySelector('.counter-value');
}

function formatQuery() {
    return `Number of travellers: ${getTravellerCounter().textContent}, Departure location: ${document.getElementById('flying-from').value}, Destination location: ${document.getElementById('flying-to').value}, Departure date: ${document.getElementById('from-date').value}, Return date: ${document.getElementById('to-date').value}, Budget: ${budgetInput.value}`;
}

function renderResults(info) {
    document.getElementById('start-date').textContent = `→ ${formatDate(document.getElementById('from-date').value)}`;
    document.getElementById('end-date').textContent = `${formatDate(document.getElementById('to-date').value)} ←`;
    document.getElementById('route').textContent = `${document.getElementById('flying-from').value} → ${document.getElementById('flying-to').value}`

    console.log(JSON.parse(info))
    const { weather, flights, hotel } = JSON.parse(info)

    document.getElementById('weather').textContent = weather;
    document.getElementById('flights').textContent = flights;
    document.getElementById('hotel').textContent = hotel;
}

async function travelAgent(query) {

    try {
        messages.push({ role: 'user', content: query });

        const runner = openai.beta.chat.completions.runTools({
            model: 'gpt-3.5-turbo',
            messages,
            tools
        }).on('message', (message) => console.log(message));

        const finalContent = await runner.finalContent();
        console.log();
        console.log('Final content:', finalContent);
        return finalContent;
    } catch (error) {
        console.error(error);
    }
}