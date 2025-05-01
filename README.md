# 🧠 MediBot — AI Medical Assistant Powered by Google Gemini

MediBot is an intelligent, empathetic AI-powered medical chatbot that uses **Google Gemini Pro** for natural language responses and the **Gale Encyclopedia of Medicine** as its knowledge base. It leverages document clustering and retrieval-augmented generation (RAG) to deliver reliable, safe, and clear answers to health-related queries — all within a ChatGPT-style modern UI.

---

## 🌟 Features

- 🧬 **LLM Powered by Google Gemini Pro**
- 📚 **Medical Knowledge from Gale Encyclopedia**
- 🧠 **Topic Clustering for Efficient Retrieval**
- 💬 **ChatGPT-Style Interface with History & Markdown**
- 🩺 **Symptom Checker (Optional UI Panel)**
- 🌙 **Dark/Light Mode Support**
- 📦 **Frontend: React + Tailwind | Backend: FastAPI/Flask**

---

## 🛠️ Tech Stack

| Layer       | Tech Used             |
|-------------|------------------------|
| Frontend    | React, Tailwind CSS, Framer Motion |
| Backend     | FastAPI / Flask (configurable)     |
| LLM         | Google Gemini Pro via API |
| Embeddings  | OpenAI / Cohere (optional) |
| Clustering  | K-Means / DBSCAN |
| Storage     | JSON / Firebase / MongoDB (optional) |

---

## ⚙️ How It Works

1. **Data Ingestion**  
   Upload and preprocess the Gale Encyclopedia data (PDF/CSV/Text).

2. **Semantic Clustering**  
   Use embedding + clustering (e.g., K-Means) to organize content by topic.

3. **RAG Pipeline**  
   - Convert user query into embedding.
   - Retrieve top matching cluster.
   - Select relevant docs.
   - Inject into prompt and call Gemini API.

4. **Frontend Interaction**  
   - Clean, modern UI mimicking ChatGPT.
   - Sidebar with topic suggestions & recent queries.
   - Answers appear with typing animation and markdown rendering.

---
⚠️ Disclaimer
MediBot does not provide medical advice, diagnosis, or treatment. Always consult a licensed healthcare provider for any health concerns.


