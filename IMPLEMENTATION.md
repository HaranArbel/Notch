# Implementation Notes

## How to run

```bash
# 1. Copy the env template and fill in your OpenAI key
cp backend/local.env.example backend/local.env
# Edit backend/local.env and set OPENAI_API_KEY=<your-key>

# 2. Backend (port 3000)
cd backend && npm install && npm start

# 3. Frontend (new terminal, Vite dev server)
cd frontend && npm install && npm run dev
```

---

## Architecture

```
frontend/          React + Vite + TypeScript
  src/
    api/           Fetch wrappers — all HTTP logic isolated here
    pages/         One component per route (Part C)
    ChatMessage/   Reusable chat bubble component

backend/           Express + TypeScript
  src/
    bl/            Business logic — no HTTP knowledge, pure functions
    controller/    HTTP layer — validates input, calls bl/, sends response
    config.ts      Zod-validated env config (fails fast on missing keys)
```

**Key principle:** the controller knows about `req`/`res`; `bl/` does not. This makes the business logic easy to test and reason about independently.

---

## Decisions

### Environment config (A2)

- `local.env` is gitignored — secrets never touch git history
- `local.env.example` is committed as a template
- Config is parsed and validated with **Zod** at startup — the server crashes immediately with a clear message if a required variable is missing, rather than failing silently at runtime

### Frontend API base URL (A6)

- Hardcoding `localhost:3000` would break in any non-local environment
- Using Vite's `import.meta.env.VITE_API_BASE` means local dev, staging, and production each set their own value without code changes

### Emoji signing (A3 / Part A requirement)

The requirement says *"the bot always signs each message with a different emoji"*. Two approaches considered:

**Option A — Instruct the LLM via system prompt**
The LLM appends its own emoji. Simple to implement, but unreliable: the model may repeat an emoji, forget the instruction for long conversations, or produce inconsistent formatting.

**Option B — Append the emoji server-side (chosen)**
An infinite generator shuffles the full emoji pool and cycles through it. The server appends the emoji after receiving the LLM's response. This is:
- **Deterministic** — guaranteed non-repeat until the full pool is exhausted (20 messages)
- **Decoupled** — the LLM focuses on answering; emoji logic is a separate concern
- **Simple** — no prompt engineering, no conversation history inspection needed

One trade-off: the generator is a module-level singleton, so all conversations share the same emoji sequence. In a multi-user production system, each conversation would get its own generator instance.

### Parallel OpenAI calls (Part B)

Sentiment extraction (Part B) requires a second OpenAI call using function calling. Running it in `Promise.all` alongside the chat completion means both calls happen concurrently — the total latency is `max(completion, sentiment)` rather than the sum. Since neither result depends on the other, parallelism is free here.

---

## What's next

1. **`POST /chat/message` route** — controller validates the incoming message array with Zod and calls `getChatCompletion` from `bl/chat.ts`
2. **Sentiment extraction** — a second function in `bl/chat.ts` using OpenAI tool calling to score the user's sentiment (0–100) and log it to the console
3. **Parallel calls** — both the chat completion and sentiment extraction run in `Promise.all` inside the route handler so latency is `max(completion, sentiment)` rather than the sum
4. **Frontend wired up** — `App.tsx` calls the backend on submit, maintains conversation history in state, and renders the real assistant replies
5. **Conversations feature** — in-memory store on the backend, CRUD routes, and a conversations list page with routing on the frontend
