const path = require('path');
const fs = require('fs');
const { getEmbedding } = require('./embeddings');

let faqStore = []; // {vector, question, answer, text}

function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function initVectorStore() {
  const faqs = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/faqs.json'), 'utf-8')
  );

  faqStore = [];
  for (const faq of faqs) {
    const text = `${faq.question} ${faq.answer}`;
    const vector = await getEmbedding(text);
    faqStore.push({ vector, question: faq.question, answer: faq.answer, text });
  }
  console.log(`Loaded ${faqStore.length} FAQs into vector store`);
}

async function searchFaqs(queryVector, limit = 3) {
  if (faqStore.length === 0) throw new Error('Vector store not initialized');

  const scored = faqStore.map(item => ({
    ...item,
    score: cosineSimilarity(queryVector, item.vector)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

module.exports = { initVectorStore, searchFaqs };
