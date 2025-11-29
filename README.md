# VERA_ai_RAG_Chatbot

Address common limitations of LLMs, such as outdated knowledge and the tendency to "hallucinate" answers. By first retrieving relevant information before generating a response, we ensure higher accuracy and user trust.

## 🏗️ Project Structure

```
VERA_ai_RAG_Chatbot/
├── vera/
│   ├── backend/          # FastAPI backend
│   │   ├── core/         # Core configuration and clients
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   ├── main.py       # FastAPI application entry point
│   │   └── requirements.txt
│   ├── frontend/         # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/      # Next.js app directory
│   │   │   ├── components/  # React components
│   │   │   ├── lib/      # API client and utilities
│   │   │   └── types/    # TypeScript types
│   │   └── package.json
│   └── pdfs_/            # Sample PDF documents
```

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.8+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **Qdrant** vector database (can run locally or use cloud)
- **Google Gemini API Key** (for LLM and embeddings)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VERA_ai_RAG_Chatbot
```

### 2. Backend Setup

#### 2.1. Install Python Dependencies

```bash
cd vera/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 2.2. Set Up Qdrant Vector Database

**Option A: Run Qdrant Locally (Docker)**

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

**Option B: Use Qdrant Cloud**

Sign up at [Qdrant Cloud](https://cloud.qdrant.io/) and get your cluster URL and API key.

#### 2.3. Configure Environment Variables

Create a `.env` file in the `vera/backend/` directory:

```bash
cd vera/backend
touch .env
```

Add the following environment variables to `.env`:

```env
# Qdrant Configuration
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key_here  # Optional for local Qdrant
QDRANT_COLLECTION=vera_docs

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=your_gemini_model_here
GEMINI_EMBEDDING_MODEL=your_embedding_model_here
```

**To get a Gemini API Key:**
1. Go to Google AI Studio
2. Create a new API key
3. Copy and paste it into your `.env` file

#### 2.4. Run the Backend Server

```bash
# Make sure you're in the backend directory with venv activated
cd vera/backend
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

#### 3.1. Install Node Dependencies

Open a new terminal and navigate to the frontend directory:

```bash
cd vera/frontend
npm install
```

#### 3.2. Configure API Endpoint (if needed)

If your backend is running on a different URL, update the API configuration in:
- `src/lib/api.ts` or `src/lib/axios.ts`

By default, the frontend expects the backend at `http://localhost:8000`

#### 3.3. Run the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Verify Installation

1. **Check Backend Health:**
   ```bash
   curl http://localhost:8000/api/v1/health
   ```
   Should return: `{"status": "VERA[backend]: Legal AI Assistant is running 🚀"}`

2. **Check Frontend:**
   - Open `http://localhost:3000` in your browser
   - You should see the VERA chatbot interface

## 📚 Usage

### Ingesting Documents

You can upload PDF documents to the system through:

1. **API Endpoint:**
   ```bash
   curl -X POST "http://localhost:8000/api/v1/upload" \
     -F "file=@path/to/your/document.pdf" \
     -F "domain_form=legal"
   ```

2. **Frontend UI:**
   - Use the upload interface in the frontend application

### Querying the Assistant

1. **API Endpoint:**
   ```bash
   curl -X POST "http://localhost:8000/api/v1/chat" \
     -H "Content-Type: application/json" \
     -d '{"question": "What is the Indian Constitution?"}'
   ```

2. **Frontend UI:**
   - Type your question in the chat interface

## 🔧 Available API Endpoints

- `GET /api/v1/health` - Health check
- `POST /api/v1/upload` or `/api/v1/ingest` - Upload and ingest documents
- `POST /api/v1/chat` - Query the assistant
- `GET /api/v1/docs` - Get list of indexed documents
- `GET /api/v1/collections` - List all collections
- `GET /api/v1/collections/{collection_id}` - Get specific collection
- `DELETE /api/v1/collections` - Delete collections

## 🛠️ Development

### Backend Development

```bash
cd vera/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Frontend Development

```bash
cd vera/frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd vera/frontend
npm run build
npm start
```

**Backend:**
```bash
cd vera/backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📝 Notes

- The system uses **Gemini embeddings** which return 3072-dimensional vectors
- Documents are chunked and stored in Qdrant for efficient retrieval
- The default collection name is `vera_docs` but can be configured via environment variables
- Supported file formats: PDF (via pdfplumber and unstructured libraries)

## 🐛 Troubleshooting

1. **Backend won't start:**
   - Check if Qdrant is running: `curl http://localhost:6333/health`
   - Verify all environment variables are set correctly
   - Ensure Python dependencies are installed

2. **Frontend can't connect to backend:**
   - Verify backend is running on port 8000
   - Check CORS settings in `main.py`
   - Verify API endpoint configuration in frontend

3. **Document ingestion fails:**
   - Check if Qdrant collection exists
   - Verify Gemini API key is valid
   - Check file format (PDF supported)

## 📄 License

See [LICENSE](LICENSE) file for details.
