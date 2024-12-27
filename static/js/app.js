const socket = new WebSocket('ws://localhost:5000');

const inputField = document.getElementById('inputField');
const outputField = document.getElementById('outputField');

inputField.addEventListener('input', () => {
    const text = inputField.value.trim();
    if (text) {
        socket.send(text);  // Send text to backend
    }
});

socket.onmessage = (event) => {
    outputField.innerText = event.data;  // Display corrected word
};
