import "./setup.js";
import express from "express";
import { ChromaClient } from "chromadb";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

// Start Chroma client (Docker mode)
const embedder = new DefaultEmbeddingFunction();
const client = new ChromaClient({ path: "http://localhost:8000" });

app.get("/", (req, res) => {
  res.send("🔥 Node RAG API running!");
});

app.post("/ingest", async (req, res) => {
  try {
    const { text } = req.body;
    // FIX: Pass the embeddingFunction here
    const collection = await client.getOrCreateCollection({ 
      name: "docs",
      embeddingFunction: embedder 
    });

    await collection.add({
      ids: [Date.now().toString()],
      documents: [text]
    });

    res.json({ status: "indexed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Query document
app.post("/query", async (req, res) => {
  try {
    const { query } = req.body;
    // FIX: Pass the embeddingFunction here as well
    const collection = await client.getOrCreateCollection({ 
      name: "docs",
      embeddingFunction: embedder 
    });

    const result = await collection.query({
      queryTexts: [query],
      nResults: 3
    });

    res.json(result);
  } catch (err) {
    console.error("Query Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
