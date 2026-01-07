const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const statusDiv = document.getElementById('status');
const loading = document.getElementById('loading');

// Trigger file input on click
dropZone.onclick = () => fileInput.click();

fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    loading.style.display = 'block';
    statusDiv.style.display = 'none';

    try {
        // 1. Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // 2. Load PDF and extract text
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            fullText += strings.join(" ") + "\n";
        }

        // 3. Send text to your Node.js backend
        const response = await fetch('http://localhost:3000/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: fullText })
        });

        const result = await response.json();
        
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#d4edda';
        statusDiv.innerText = `Success! Indexed ${file.name}`;

    } catch (err) {
        console.error(err);
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#f8d7da';
        statusDiv.innerText = "Error: " + err.message;
    } finally {
        loading.style.display = 'none';
    }
};

async function askQuestion() {
    const query = document.getElementById('queryInput').value;
    const answerDiv = document.getElementById('answer');
    
    if (!query) return;

    answerDiv.style.display = 'block';
    answerDiv.innerText = "Searching...";

    try {
        const response = await fetch('http://localhost:3000/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });

        const data = await response.json();
        
        // Chroma returns an array of documents. We'll show the top match.
        if (data.documents && data.documents[0].length > 0) {
            answerDiv.innerText = "Top Match from PDF:\n\n" + data.documents[0][0];
        } else {
            answerDiv.innerText = "No relevant information found.";
        }
    } catch (err) {
        answerDiv.innerText = "Error: " + err.message;
    }
}