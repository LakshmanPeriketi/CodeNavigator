# CodeNavigator: Project Overview

CodeNavigator is a fully integrated, full-stack AI-powered platform designed to seamlessly index open-source GitHub repositories and expose them to an interactive agentic retrieval-augmented generation (RAG) chat interface. 

This document serves as a comprehensive breakdown of the core systems we built and wired together to accomplish this.

## 🏗️ Architecture & Technology Stack

The project has been cleanly separated into two isolated workspaces:
- **Frontend** (`/frontend`): A modern React Single Page Application (SPA) natively compiled via Vite operating on port `5174`. It utilizes rich Tailwind aesthetics, dynamic state rendering via native React hooks, and strict Server Sent Events (SSE) stream interceptors.
- **Backend** (`/backend`): A heavily modularized Node.js application built with Express operating on port `5000`. It bridges LangChain JS ecosystems with database layers to execute secure state-driven executions.

### External Infrastructure Required:
- **MongoDB**: Runs on `localhost:27017` to persistently manage repository parsing sessions and historical chat threads.
- **ChromaDB**: Runs on `localhost:8000` via Docker natively holding the deeply embedded vector indexes.
- **Groq LLM**: Powers lightning-fast generation inference natively (`llama-3.1-8b-instant`).
- **Local HuggingFace Transformers**: Runs natively entirely in Node removing API limits completely for embedding vectorizations (`Xenova/all-MiniLM-L6-v2`).

---

## 📂 Overall Directory Structure

```text
d:\repomind\
├── frontend/                     # React Vite Application
│   ├── src/
│   │   ├── components/           # UI Layouts (ChatInterface, LandingPage)
│   │   │   ├── IngestionLoader.jsx  # Polling interface for indexing status
│   │   │   ├── MessageBubble.jsx    # Real-time text & markdown formatter handling "Sources" display
│   │   │   └── CodeBlock.jsx        # Abstracted fallback for syntax highlighting
│   │   ├── hooks/
│   │   │   └── useChat.js        # SSE-driven React context logic capturing message threads dynamically
│   │   ├── services/
│   │   │   └── api.js            # Axios & Fetch mappings hooking natively into Express
│   │   ├── App.jsx               # Primary router logic mapped via State conditionals
│   │   └── main.jsx
│   ├── .env                      # Includes VITE_API_URL endpoints
│   └── package.json
│
└── backend/                      # Node.js/Express Native Application
    ├── src/
    │   ├── config/
    │   │   ├── db.js             # Mongoose/Winston Logger Initialization
    │   │   └── env.js            # Strict Environment loader mapping API limits
    │   ├── controllers/
    │   │   ├── chatController.js # Accepts queries, dispatches LangGraph, routes SSE
    │   │   └── ingestController.js
    │   ├── middleware/
    │   │   ├── errorHandler.js   # Global App Safety fallback
    │   │   └── rateLimiter.js    # Prevents aggressive memory overloads natively
    │   ├── models/
    │   │   ├── ChatHistory.js    # Binds conversation sequences to sessionIds
    │   │   └── Session.js        # Tracks ingest metrics (ready, pending, fileCount)
    │   ├── routes/
    │   │   └── api.js            # `/api/ingest`, `/api/chat` router abstractions
    │   ├── services/
    │   │   ├── agentService.js   # Linear Runnable Sequence RAG implementation (retrieve -> format -> generate)
    │   │   ├── embeddingService.js # Initializes local HuggingFace vectors & Groq LLMs securely
    │   │   ├── githubService.js  # GithubRepoLoader scraping logic
    │   │   └── vectorStoreService.js # Embeds matrices directly into Chroma DB namespaces
    │   └── app.js                # Core Express Setup (CORS, body mapping)
    ├── server.js                 # Network execution entry point
    └── .env                      # Private Environment Vault
```

---

## 🛠️ Deep Dive: Core Modalities Built

### 1. Robust Repository Ingestion Pipeline (`githubService.js`)
We abstracted the ability to grab thousands of files dynamically:
- Built around LangChain's `GithubRepoLoader`.
- Explicitly drops generic cache nodes (`node_modules`, `dist`, images, `.git`) implicitly saving processing overhead.
- Includes automatic branch fallbacks correctly mapping ancient legacy repos that use `master` exclusively if `main` returns `404 Not Found`.
- Employs `RecursiveCharacterTextSplitter` splitting codebase logic across strict class/function boundaries cleanly maintaining syntax overlap.
- Explicitly detects empty string dimensionality crashes intercepting them natively before dispatching to the Vector DB to prevent Chroma crashes. 
- Passes stateful UUID-bound background payloads recursively updating progress mapping directly to MongoDB!

### 2. High-Speed Linear RAG Pipeline (`agentService.js`)
We flattened the initial graph architectures strictly into a highly performant linear sequence natively bound using LangChain architectures hooking into Groq:
- **Zero-Latency Retrieval**: Seamlessly fetches exactly the top 8 closest code chunks without executing secondary LLM grades to preserve API token allocations implicitly.
- **Callback Hook Architecture**: Captures context explicitly dropping `metadata` chunks back to our dynamic array triggers triggering `callbacks.onSources()` natively exposing lines of references back to the User interface instantly!
- **State Streaming**: Designed the string outputs to capture nested `.stream()` fragments native to Groq's high-speed buffers explicitly flushing Server Sent Events payload down the TCP stack.

### 3. Local WebAssembly Vectors & Inference Models (`embeddingService.js`)
We completely stripped out remote API vectors natively mapping everything inside device hardware boundaries:
- Implemented `@huggingface/transformers` securely resolving exactly `Xenova/all-MiniLM-L6-v2` down to Native dimensions `(384)`. This guarantees indexing codebases without API limits crashing loops!
- Implemented `llama-3.1-8b-instant` through `ChatGroq` natively masking latency behind token speeds natively achieving lightning-fast generative AI text parsing over massive code blocks securely.

### 4. Interactive Polling Frontend Mechanisms (`frontend/`)
We discarded the previous generic facade implementations replacing them with rigid reactive handlers:
- `IngestionLoader.jsx` cleanly mounts and executes `setInterval` tracking `api.js` polling states over `http://localhost:5000/api/ingest/status` checking exclusively for `ready` states mapped over from Node!
- `MessageBubble.jsx` listens rigorously for `data: {"type": "sources"}` objects cleanly embedding isolated lines of context straight into the DOM cleanly under beautiful Github themed sub-panels exposing the underlying RAG structure elegantly. 

## 🚀 Execution Flow

1. You hit "Ingest Repository" triggering `githubService.js`.
2. The UI switches to `IngestionLoader.jsx` actively looping queries.
3. Code chunks pipe natively to `ChromaDB` while status shifts to `ready`.
4. The UI jumps seamlessly to `ChatInterface.jsx` taking natural language API text.
5. `chatController.js` creates a functional sequence pulling exactly what you sent pulling contexts exclusively related to what you queried embedding Groq tokens back to the user explicitly matching SSE strings cleanly.
