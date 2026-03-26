const lancedb = require('vectordb');
const path = require('path');
const fs = require('fs');
const { getEmbedding } = require('./embeddings');

const DB_PATH = path.join(__dirname, '../data/lancedb');
const TABLE_NAME = 'faqs';
let table = null;

async function initVectorStore() {
  const faqs = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/faqs.json'), 'utf-8')
  );
  const db = await lancedb.connect(DB_PATH);

  // Generate embeddings for all FAQs
  const records = [];
  for (const faq of faqs) {
    const text = `${faq.question} ${faq.answer}`;
    const vector = await getEmbedding(text);
    records.push({ vector, question: faq.question, answer: faq.answer, text });
  }

  // Drop table if exists, then create
  try {
    await db.dropTable(TABLE_NAME);
  } catch (e) {
    // Table may not exist yet, ignore
  }
  table = await db.createTable(TABLE_NAME, records);
  console.log(`Loaded ${records.length} FAQs into vector store`);
}

async function searchFaqs(queryVector, limit = 3) {
  if (!table) throw new Error('Vector store not initialized');
  const results = await table.search(queryVector).limit(limit).execute();
  return results;
}

module.exports = { initVectorStore, searchFaqs };
