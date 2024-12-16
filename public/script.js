const messagesDiv = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Function to get current time in HH:MM AM/PM format
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 AM/PM case
    const minuteStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minuteStr} ${ampm}`;
}

// Determine WebSocket URL based on the environment
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = window.location.hostname === 'localhost' ? '192.168.1.42:3000' : 'message.up.railway.app';
const ws = new WebSocket(`${protocol}//${host}`);

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

// Handle WebSocket errors
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// Handle WebSocket connection close
ws.onclose = () => {
    console.warn('WebSocket connection closed');
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

// Helper function to display a message with timestamp
function displayMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.innerHTML = content;

    // Create and append timestamp
    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = getCurrentTime();
    messageDiv.appendChild(timestamp);

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}
