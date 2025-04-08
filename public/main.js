const socket = io();

const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTone = new Audio('/message-tone.mp3');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total clients: ${data}`;
});

function sendMessage() {
    if (messageInput.value === '') return;

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    };

    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

function addMessageToUI(isOwnMessage, data) {
    const messageElement = document.createElement('li');
    messageElement.classList.add(isOwnMessage ? 'message-right' : 'message-left');
    messageElement.innerHTML = `
        <p class="message">${data.message}
            <span>${data.name} ⚪ ${new Date(data.dateTime).toLocaleTimeString()}</span>
        </p>
    `;
    messageContainer.appendChild(messageElement);
    scrollToBottom();
}

socket.on('chat-message', (data) => {
    messageTone.play();
    addMessageToUI(false, data);
});

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', () => {
    socket.emit('feedback', { feedback: `${nameInput.value} is typing a message...` });
});

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', { feedback: `${nameInput.value} is typing a message...` });
});

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', { feedback: '' });
});

socket.on('feedback', (data) => {
    const feedbackContainer = document.getElementById('feedback-container');
    
    if (data.feedback) {
        // Check if there is already a feedback message and update it
        let feedbackElement = document.querySelector('.message-feedback');
        
        if (!feedbackElement) {
            feedbackElement = document.createElement('li');
            feedbackElement.classList.add('message-feedback');
            feedbackContainer.appendChild(feedbackElement);
        }
        
        feedbackElement.innerHTML = `<p class="feedback">${data.feedback}</p>`;
    } else {
        // Remove typing feedback
        const feedbackElement = document.querySelector('.message-feedback');
        if (feedbackElement) {
            feedbackElement.remove();
        }
    }
});

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    });
}
socket.on('chat-history', (messages) => {
    messages.forEach((message) => {
        addMessageToUI(false, message);
    });
});
