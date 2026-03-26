const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Send on Enter key
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to chat
  appendMessage(message, 'user');
  userInput.value = '';
  sendBtn.disabled = true;

  // Show typing indicator
  const typingDiv = appendMessage('Thinking...', 'bot', true);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    typingDiv.remove();
    appendMessage(data.reply || data.error || 'Sorry, something went wrong.', 'bot');
  } catch (err) {
    typingDiv.remove();
    appendMessage('Sorry, I could not reach the server. Please try again.', 'bot');
  }

  sendBtn.disabled = false;
  userInput.focus();
}

function appendMessage(text, sender, isTyping = false) {
  const div = document.createElement('div');
  div.className = `message ${sender}-message${isTyping ? ' typing' : ''}`;
  div.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return div;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
