const express = require('express');
const path = require('path');
const { initVectorStore } = require('./vectorStore');
const { chat } = require('./rag');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let vectorStoreReady = false;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', vectorStore: vectorStoreReady });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!vectorStoreReady) {
      return res.status(503).json({ error: 'Vector store is still initializing. Please try again in a moment.' });
    }
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initialize vector store in background
  initVectorStore()
    .then(() => {
      vectorStoreReady = true;
      console.log('Vector store initialized successfully');
    })
    .catch((err) => {
      console.error('Failed to initialize vector store:', err.message);
      console.error('Chat will not work until vector store is initialized');
    });
});
