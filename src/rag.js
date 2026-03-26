const OpenAI = require('openai');
const { getEmbedding } = require('./embeddings');
const { searchFaqs } = require('./vectorStore');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(userMessage) {
  // 1. Embed the user's question
  const queryVector = await getEmbedding(userMessage);

  // 2. Search for relevant FAQs
  const results = await searchFaqs(queryVector);

  // 3. Build context from results
  const context = results
    .map((r) => `Q: ${r.question}\nA: ${r.answer}`)
    .join('\n\n');

  // 4. Generate response using GPT-3.5-turbo
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a helpful customer support assistant. Answer the user's question based on the following FAQ context. If the answer is not in the context, say you don't have that information and suggest contacting support directly.\n\nContext:\n${context}`,
      },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content;
}

module.exports = { chat };
