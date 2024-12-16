const messagesDiv = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Establish WebSocket connection
const ws = new WebSocket('ws://localhost:3000');

// Listen for incoming messages
ws.onmessage = (event) => {
    // Check if the received data is a Blob
    if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
            displayMessage(reader.result, 'incoming');
        };
        reader.readAsText(event.data); // Convert Blob to text
    } else {
        displayMessage(event.data, 'incoming');
    }
};

// Handle sending messages
sendButton.addEventListener('click', () => {
    const message = input.value.trim(); // Trim to remove extra spaces
    if (message) {
        ws.send(message); // Send as plain text
        displayMessage(message, 'outgoing');
        input.value = ''; // Clear the input field
    }
});

// Helper function to display a message
function displayMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}
