const express = require('express');
const path = require('path');
const { initVectorStore } = require('./vectorStore');
const { chat } = require('./rag');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const reply = await chat(message);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = process.env.PORT || 3000;

async function start() {
  await initVectorStore();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(console.error);
