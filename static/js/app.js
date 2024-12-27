const socket = new WebSocket('ws://localhost:5000');

const inputField = document.getElementById('inputField');
const outputField = document.getElementById('outputField');

// Event listener for WebSocket connection open
socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
});

// Event listener for WebSocket connection error
socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

// Event listener for text input field
inputField.addEventListener('input', () => {
    const text = inputField.value.trim();
    if (text) {
        socket.send(text);  // Send text to backend
    }
});

socket.onmessage = (event) => {
    outputField.innerText = event.data;  // Display corrected word
};
