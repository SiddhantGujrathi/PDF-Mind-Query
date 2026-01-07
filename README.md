# PDF-Mind-Query 🧠

An intelligent RAG (Retrieval-Augmented Generation) system that lets you chat with your PDF documents using vector embeddings.

## 🚀 Features
- **PDF Text Extraction**: Uses `pdf.js` to parse documents.
- **Vector Search**: Powered by **ChromaDB** for semantic retrieval.
- **Local Embeddings**: Uses `@chroma-core/default-embed` to process text locally.
- **Fast Backend**: Built with Node.js and Express.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript, PDF.js
- **Backend**: Node.js, Express
- **Database**: ChromaDB (Running in Docker)

## 📦 Installation
1. Clone the repo: `git clone https://github.com/SiddhantGujrathi/PDF-Mind-Query.git`
2. Install dependencies: `npm install`
3. Start ChromaDB: `docker run -d -p 8000:8000 chromadb/chroma`
4. Run the server: `nodemon server.js`
