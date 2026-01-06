# Bimo Tech RFQ Backend

FastAPI backend for the Bimo Tech RFQ (Request for Quote) system.

## Features

- **Chat API**: AI-powered material assistant using OpenAI/Claude
- **RFQ Processing**: Submit and track quote requests
- **Supplier Matching**: Automatic matching of RFQ items to suppliers
- **Email System**: Anonymized RFQ emails to suppliers
- **Firebase Integration**: Firestore for data, Storage for files

## Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `FIREBASE_CREDENTIALS_PATH`: Path to Firebase service account JSON
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`: LLM API key
- `SENDGRID_API_KEY`: For sending emails

### 3. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Cloud Storage
4. Generate a service account key and save as `firebase-credentials.json`

### 4. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### Chat
- `POST /api/v1/chat/` - Send a message to the AI assistant
- `GET /api/v1/chat/materials/{id}` - Get material details
- `GET /api/v1/chat/search?q={query}` - Search materials

### RFQ
- `POST /api/v1/rfq/submit` - Submit an RFQ
- `GET /api/v1/rfq/{rfq_id}` - Get RFQ status
- `POST /api/v1/rfq/upload-design` - Upload design files

## Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── routers/
│   │   ├── chat.py          # Chat endpoints
│   │   └── rfq.py           # RFQ endpoints
│   ├── services/
│   │   ├── firebase.py      # Firebase integration
│   │   ├── llm.py           # LLM integration
│   │   ├── materials.py     # Material data
│   │   ├── matching.py      # Supplier matching
│   │   └── email.py         # Email sending
│   └── models/
│       ├── chat.py          # Chat data models
│       ├── rfq.py           # RFQ data models
│       └── supplier.py      # Supplier models
├── requirements.txt
└── .env.example
```

## Supplier Matching Algorithm

The matching algorithm scores suppliers based on:
1. **Capability match**: % of required materials/capabilities matched
2. **Certifications**: Bonus for EN9100, ISO9001
3. **Lead time**: Adjusted based on urgency
4. **Reliability score**: Historical performance

## Anonymous RFQ Flow

1. Customer submits RFQ (no supplier sees customer info)
2. System matches to suppliers based on capabilities
3. Suppliers receive anonymized RFQ with reference number
4. Quotes come back to Bimo Tech
5. Bimo Tech presents consolidated quote to customer
6. Customer never sees supplier names

## Development

Run tests:
```bash
pytest
```

## Deployment

The backend is designed to run on Google Cloud Run:

```bash
gcloud run deploy bimotech-backend \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated
```


