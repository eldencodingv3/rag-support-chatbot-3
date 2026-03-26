# RAG Support Chatbot

A Node.js RAG chatbot that answers customer support questions using FAQ documents, LanceDB vector search, and OpenAI GPT-3.5-turbo.

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file or set environment variables:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `PORT` - Server port (default: 3000)
   - `NODE_ENV` - Environment (production/development)
4. Run `npm start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| OPENAI_API_KEY | OpenAI API key for embeddings and chat | Yes |
| PORT | Server port | No (default: 3000) |
| NODE_ENV | Environment mode | No |

## Dataset Updates

FAQ data is stored in `data/faqs.json`. To update:
1. Edit `data/faqs.json` - each entry needs `question` and `answer` fields
2. Restart the server - embeddings are regenerated on startup
3. The vector store is rebuilt automatically from the FAQ data

## Architecture

- **Backend**: Express.js server
- **Vector DB**: LanceDB (embedded, serverless)
- **AI**: OpenAI text-embedding-3-small (embeddings) + GPT-3.5-turbo (chat)
- **Frontend**: Static HTML/CSS/JS chat interface
