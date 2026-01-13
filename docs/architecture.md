# Mystica - System Architecture

```mermaid
graph TB
    subgraph Client["🌐 Client Layer"]
        Browser["Browser/Mobile"]
    end

    subgraph Frontend["📱 Frontend Container (Port 3000)"]
        NextJS["Next.js 14 + TypeScript"]
        TailwindCSS["TailwindCSS + Framer Motion"]
    end

    subgraph Backend["⚙️ Backend Container (Port 3001)"]
        NestJS["NestJS + REST API"]
        WebSocket["WebSocket Gateway"]
        AIService["AI Service (Gemini)"]
    end

    subgraph Database["🗄️ Database Layer"]
        MongoDB["MongoDB (Port 27017)"]
    end

    subgraph External["🌍 External Services"]
        GeminiAPI["Google Gemini API"]
    end

    Browser --> NextJS
    NextJS --> NestJS
    NextJS --> WebSocket
    NestJS --> MongoDB
    NestJS --> GeminiAPI
    WebSocket --> MongoDB
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context / Zustand
- **Data Fetching**: Axios / TanStack Query

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Authentication**: Passport.js + JWT
- **Real-time**: Socket.io
- **Database ODM**: Mongoose

### AI & Infrastructure
- **AI**: Google Gemini Pro (via `@google/generative-ai`)
- **Docker**: Docker & Docker Compose
- **Database**: MongoDB
