<div align="center">
  <h1>🚀 CodeNavigator</h1>
  <p>Agentic Retrieval-Augmented Generation (RAG) platform to interactively chat with entire GitHub codebases!</p>
</div>

---

## 📌 Overview

**CodeNavigator** is a full-stack, AI-powered repository intelligence interface. You simply drop a GitHub repository link into the portal, and the backend will recursively clone, parse, and embed the repository code context directly into a Vector database.  Once fully mapped, you can instantly ask granular questions about the codebase architecture, file structures, logic loops, and authentication flows, getting highly accurate citations linked directly to the repository files without hallucinations.

We've specifically eliminated all API rate limits and token costs for massive vectorizations by bringing the embedding process **completely native and local** using WebAssembly HuggingFace transformers, allowing you to index hundreds of files securely and infinitely!

## 🛠️ Technology Stack

* **Frontend Engine:** React.js compiled natively via Vite (Running on port `5174`). Responsive glassmorphism aesthetics handled natively via TailwindCSS.
* **Backend Executor:** Node.js over modular nested Express clusters (Running on port `5000`). Utilizing Server Sent Events (SSE) TCP stacks for chunked payload streaming.
* **Intelligent Framework:** `langchain` sequences.
* **Vector Model (Zero-cost):** `@huggingface/transformers` running `Xenova/all-MiniLM-L6-v2` locally on your CPU (384 Dimensions).
* **Generation Model (Free Tier):** Lightning-fast contextual generative inference via **Groq** (`llama-3.1-8b-instant`).
* **Databases:**
  * **ChromaDB:** Stores the structural matrix embeddings (Runs securely via Docker).
  * **MongoDB:** Tracks dynamic ingestion logs globally.

---

## 💻 Prerequisites

To run this tool natively on your computer, you must have the following infrastructure installed smoothly:

1. **[Node.js](https://nodejs.org/en/)** (v20+ recommended)
2. **[MongoDB](https://www.mongodb.com/try/download/community)** (Ensure the community engine is actively mapping port `27017` locally).
3. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Used to initialize the isolated vector database).
4. **[Groq API Key](https://console.groq.com/keys)** (Generates your chat predictions blazingly fast. Completely free!).
5. **[GitHub Personal Access Token](https://github.com/settings/tokens)** (Classic Token to prevent rate limits while grabbing repositories).

---

## 🚀 Setup & Execution

### 1. Initialize the Chroma Vector Database
Open your target terminal, verify Docker is running gracefully in your desktop tray, and spawn the primary database server:
```bash
docker run -p 8000:8000 chromadb/chroma
```

### 2. Launch the Backend API
Open a secondary terminal bound to the backend workspace map:
```bash
cd backend
npm install
```

Create a new file named `.env` locally in the `/backend` scope seamlessly defining your parameters:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codenavigator

LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_groq_api_key_here
GITHUB_TOKEN=github_pat_your_token_here

VECTOR_STORE=chroma
CHROMA_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5174
```

Kickstart the Node abstraction pipeline natively:
```bash
npm run dev
```

### 3. Launch the Frontend Interface
Open a third overarching terminal bound directly hitting the UI workspace:
```bash
cd frontend
npm install
```

Boot the interface locally to compile layouts cleanly:
```bash
npm run dev
```

---

## 🧠 Usage Guides
1. Click through natively to your browser at **`http://localhost:5174/`**.
2. Target a generic repository string cleanly (`octocat/Spoon-Knife`).
3. Behind the curtains, CodeNavigator will actively intercept the Github repository, split the logic bounds by Javascript/Typescript native classes natively, structure them over CPU, and dump them into Chroma effortlessly. Ensure you respect wait bounds! Huge frameworks (like `javascript-algorithms`) take massive time constraints on CPU while generating index bounds entirely for free!
4. Query naturally! *"Where is the root authentication hook executed?"* The UI will drop open the exact references cleanly nested via markdown code blocks dynamically parsed!
