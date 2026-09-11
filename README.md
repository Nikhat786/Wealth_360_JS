# Mirae Asset WealthVerse — Personal Wealth Operating System

> **Grow. Protect. Transfer.** Your complete financial life, in one intelligent universe.
> 
> 📄 **Business & Features Specification:** For a comprehensive overview of the business model, unit economics, 5 diversified revenue streams, customer personas, and deep feature breakdowns, see [BUSINESS_AND_FEATURES.md](file:///c:/Nikhat/Roarathon/Wealth_360_JS/BUSINESS_AND_FEATURES.md).

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![LLM](https://img.shields.io/badge/LLM-qwen3--4b--instruct-FF6B35)](https://mcpuat.sharekhan.com)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routes & Pages](#routes--pages)
- [Core Architecture](#core-architecture)
- [SHERU AI — LLM Integration](#sheru-ai--llm-integration)
- [Design System](#design-system)
- [Getting Started](#getting-started)
- [Environment & Proxy](#environment--proxy)
- [Subscription Tiers](#subscription-tiers)
- [Data Model](#data-model)

---

## Overview

**WealthVerse** is a full-stack personal wealth management application built for the Mirae Asset Sharekhan ecosystem. It gives users a 360° view of their financial life across five pillars:

| Pillar | What it covers |
|---|---|
| **Grow** | Portfolio, equity, mutual funds, SIP planner |
| **Protect** | Life & health insurance coverage analysis |
| **Plan** | Goals, FIRE calculator, debt optimisation |
| **Transfer** | Nominees, will, estate & vault |
| **Know** | Financial DNA, behaviour & risk profile |

The application is powered by **SHERU** — an AI Wealth Guide backed by the `qwen3-4b-instruct` LLM hosted on the Sharekhan MCP platform — and supports **Account Aggregator (AA)** integration for real-time, PAN-linked financial data sync.

---

## Key Features

### 🤖 SHERU — AI Wealth Coach
- Powered by **Sharekhan LLM API** (`qwen3-4b-instruct`)
- Personalized system prompt injected with live financial context (score, income, EMI, goals, protection, tax headroom)
- Multi-turn conversation memory (last 6 turns)
- Graceful **offline fallback** to deterministic rule engine if API is unreachable
- Rich response rendering: **score cards**, **star ratings**, **alert/action boxes**, **follow-up pill buttons**
- Auto-growing multi-line textarea (`Enter` = send, `Shift+Enter` = new line)
- Animated typing indicator while LLM is responding

### 📊 Wealth Health Score
- Composite 0–100 score across 5 pillars
- Live recalculation as user updates their profile
- What-If simulator to model scenario changes
- Grade (A–F) with pillar-level breakdown

### 🏦 Account Aggregator
- Simulated AA flow with PAN-based journey lookup
- Aggregates Demat, Mutual Funds, Bank, EPF, Loans & Insurance
- Auto-populates all five WealthVerse pillars from a single AA consent

### 🎯 Goals & FIRE
- Create and track financial goals (education, retirement, travel, emergency)
- Projections with shortfall detection
- FIRE (Financial Independence, Retire Early) calculator
- Monthly contribution slider with on-track/off-track visual

### 🛡️ Protection Analyser
- Life, health, critical illness & personal accident gap analysis
- Recommended cover vs. actual holdings
- One-click top-up simulation

### 📋 Debt Optimiser
- Waterfall & avalanche repayment strategies
- Loan prepayment simulator
- EMI ratio health check

### 🗂️ Transfer & Vault
- Nominee coverage map across all financial accounts
- Digital will & estate planning checklist
- Document vault (ABHA, PAN, Aadhaar, Will)

### 👤 RM (Relationship Manager) Portal
- Separate RM login session gated by `wealth360-rm-session`
- Client summary dashboard
- RM-only internal screens (business model, revenue analytics)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Routing** | React Router DOM v7 (file-based) |
| **Styling** | Tailwind CSS v4 + custom design tokens |
| **UI Components** | Radix UI primitives + shadcn/ui |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Data Fetching** | TanStack React Query v5 |
| **LLM** | Sharekhan MCP API (`qwen3-4b-instruct`) via Vite proxy |
| **Icons** | Lucide React |
| **Animations** | tw-animate-css + custom CSS keyframes |
| **Date Utils** | date-fns |

---

## Project Structure

```
Wealth_360_JS/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, logos, coach-mark avatar
│   ├── components/
│   │   ├── ui/                 # Radix/shadcn base components
│   │   └── wealth/             # Domain-specific components
│   │       ├── app-shell.jsx       # Nav sidebar + top-bar layout
│   │       ├── chat-bubble.jsx     # Rich LLM response renderer
│   │       ├── score-gauge.jsx     # Animated wealth health gauge
│   │       ├── stat-tile.jsx       # KPI summary tiles
│   │       ├── goal-card.jsx       # Goal progress card
│   │       ├── holdings-table.jsx  # Asset/liability table
│   │       ├── rm-modal.jsx        # RM booking modal
│   │       └── ...
│   ├── context/
│   │   └── app-context.jsx     # Global state + sendMessage (LLM)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── sheru-api.js        # Sharekhan LLM API client + proxy
│   │   ├── coach.js            # Offline rule engine (fallback)
│   │   ├── derived.js          # Protection/transfer score calculators
│   │   ├── score.js            # Wealth Health Score engine
│   │   ├── goal-math.js        # Goal projection & FIRE math
│   │   ├── wealth360.js        # Simulation & DNA engine
│   │   ├── wealthverse-intelligence.js  # Dynamic advisory items
│   │   ├── mock-data.js        # Demo financial data
│   │   └── journeys.js         # PAN-based journey persistence
│   ├── routes/                 # File-based pages (React Router)
│   │   ├── __root.jsx          # App shell + providers
│   │   ├── index.jsx           # Dashboard (/)
│   │   ├── coach.jsx           # SHERU AI chat (/coach)
│   │   ├── wealth360.jsx       # Landing page (/wealth360)
│   │   ├── onboarding.jsx      # Onboarding wizard (/onboarding)
│   │   ├── portfolio.jsx       # Grow / portfolio (/portfolio)
│   │   ├── goals.index.jsx     # Goals & FIRE (/goals)
│   │   ├── protect.jsx         # Protection (/protect)
│   │   ├── debt.jsx            # Debt optimiser (/debt)
│   │   ├── transfer.jsx        # Transfer & vault (/transfer)
│   │   ├── know.jsx            # Financial DNA (/know)
│   │   ├── insights.jsx        # AI insights (/insights)
│   │   ├── plans.jsx           # Subscription plans (/plans)
│   │   ├── account-aggregator.jsx   # AA flow (/account-aggregator)
│   │   ├── score.jsx           # Score detail (/score)
│   │   ├── profile.jsx         # User profile (/profile)
│   │   ├── rm.dashboard.jsx    # RM dashboard (/rm/dashboard)
│   │   └── ...
│   ├── styles.css              # Global CSS + design tokens
│   └── main.jsx                # React entry point
├── vite.config.js              # Vite config + LLM proxy
├── components.json             # shadcn/ui config
└── package.json
```

---

## Routes & Pages

| Route | Page | Access |
|---|---|---|
| `/wealth360` | Landing / marketing page | Public |
| `/welcome` | Welcome screen | Public |
| `/onboarding` | 7-step financial onboarding wizard | Public |
| `/account-aggregator` | AA consent & data sync flow | Public |
| `/` | Main dashboard (score, pillars, actions) | Authenticated |
| `/know` | Financial DNA & risk profile | Authenticated |
| `/portfolio` | Portfolio & holdings (Grow) | Authenticated |
| `/debt` | Debt optimiser & EMI planner | Authenticated |
| `/goals` | Goals, FIRE calculator | Authenticated |
| `/goals/:goalId` | Individual goal deep-dive | Authenticated |
| `/life-events` | Life events planner | Authenticated |
| `/protect` | Insurance & protection gaps | Authenticated |
| `/transfer` | Nominee & estate planning | Authenticated |
| `/coach` | SHERU AI Wealth Chat | Authenticated |
| `/insights` | AI-generated wealth insights | Authenticated |
| `/score` | Wealth Health Score detail | Authenticated |
| `/plans` | WealthVerse subscription plans | Authenticated |
| `/profile` | User profile & settings | Authenticated |
| `/analysis` | Portfolio analysis | Authenticated |
| `/rm/dashboard` | RM internal dashboard | RM Session Only |
| `/rm/client` | RM client view | RM Session Only |
| `/rm/login` | RM login | Public |

---

## Core Architecture

### State Management — `AppContext`

All application state lives in a single React Context (`src/context/app-context.jsx`). Key state slices:

```
AppContext
├── answers          – User's complete financial profile (income, assets, liabilities, goals)
├── score            – Live Wealth Health Score (0-100, grade, pillar breakdown)
├── messages         – SHERU chat history
├── isTyping         – LLM in-flight indicator
├── cover            – Insurance cover (base + extra)
├── nominations      – Nominee map by account
├── goals            – Enriched goals with live projections
├── contributions    – Monthly SIP per goal
├── sim              – What-If simulation state
├── subscriptionTier – Basic / Premium / Elite / Enterprise
└── isRmSession      – RM portal mode flag
```

### Wealth Health Score Engine

The score is a weighted composite across 5 pillars, computed in `src/lib/score.js`:

```
Score (0–100)
├── Cash Flow        (income - expenses - EMI ratio)
├── Investments      (SIP rate, goal funding %)
├── Protection       (life cover multiple, health cover)
├── Goals            (on-track %, shortfall)
└── Transfer         (nominee coverage, doc vault)
```

### SHERU AI — LLM Integration

```
User message (Enter key)
        │
        ▼
sendMessage() [async, app-context.jsx]
        │
        ├─► Optimistic UI: user bubble appears instantly
        ├─► setIsTyping(true) → animated typing dots
        │
        ▼
callSheruLLM() [sheru-api.js]
        │
        ├─► Build system prompt with live financial context
        ├─► POST /api/sharekhan (Vite proxy)
        │         └─► https://mcpuat.sharekhan.com/api/v1/chat/completions
        │              model: qwen3-4b-instruct
        │              max_tokens: 512
        │              stream: false
        │
        ├─► SUCCESS → render LLM reply via RichAssistantMessage
        └─► FAIL    → coachReply() offline rule engine (silent fallback)
```

---

## SHERU AI — LLM Integration

### API Details

| Property | Value |
|---|---|
| **Endpoint** | `https://mcpuat.sharekhan.com/api/v1/chat/completions` |
| **Dev Proxy** | `/api/sharekhan` → rewrites to above (avoids CORS) |
| **Model** | `qwen3-4b-instruct` |
| **Max tokens** | `512` |
| **Stream** | `false` |

### System Prompt Context

Every request includes a live-generated system prompt with:
- Wealth Health Score + grade
- Net worth, monthly income, expenses, EMI
- Emergency fund months
- Life & health cover amounts
- Tax headroom
- Idle surplus
- Goals off-track count
- Protection & transfer scores
- Top priority action

### Response Rendering (`chat-bubble.jsx`)

The `RichAssistantMessage` component parses raw LLM markdown into structured UI:

| LLM Output | Rendered As |
|---|---|
| `57/100 (Grade B)` | Score hero card with vertical bar |
| Score card | ★★★ Star rating (half-star, amber) |
| `**Next steps:**` | Section heading with TrendingUp icon |
| `- action item` | ✅ Green check card |
| `- low / gap / risk` | ⚠️ Amber alert card |
| `**bold text**` | Inline `<strong>` |
| `**Follow-up questions:**` | "Ask me next" pill buttons |

### Offline Fallback — Rule Engine (`coach.js`)

If the LLM API is unavailable, 10 keyword-based rules handle common intents:
`score`, `retire`, `loan`, `transfer`, `tax`, `insur`, `idle`, `fire`, `aggregator`, `rm`

---

## Design System

### Color Palette

```css
--background: oklch(...)   /* Deep navy: #0c182b */
--primary:    oklch(...)   /* Sharekhan gold/blue */
--gold:       #C9A84C      /* Warm gold accent */
--success:    emerald-500
--warning:    amber-500
```

### Typography

| Font | Usage |
|---|---|
| **Sora** (`font-display`) | Headings, scores, hero text |
| **Manrope** (`font-sans`) | Body, UI labels |

### Custom Utilities

```css
.surface-card    – Glassmorphic card surface
.gradient-navy   – Navy gradient background  
.gradient-gold   – Gold shimmer gradient
.num             – Tabular numeric figures
```

### Animations

- `sheru-bounce` — 3-dot typing indicator (staggered 0 / 150 / 300ms)
- `slide-in-from-*` — tw-animate-css entry animations
- Score bar fill — CSS height transition 700ms

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone <repo-url>
cd Wealth_360_JS
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` (or next available port).

### Production Build

```bash
npm run build
npm run preview
```

---

## Environment & Proxy

The Sharekhan LLM API is proxied through Vite to avoid browser CORS restrictions.

**`vite.config.js`**
```js
server: {
  proxy: {
    "/api/sharekhan": {
      target: "https://mcpuat.sharekhan.com",
      changeOrigin: true,
      secure: true,
      rewrite: () => "/api/v1/chat/completions",
    },
  },
},
```

In production, configure your reverse proxy (Nginx / Vercel / Cloudflare) to forward `/api/sharekhan` to the Sharekhan endpoint.

---

## Subscription Tiers

| Tier | Features |
|---|---|
| **Basic** | Full WealthVerse, SHERU AI, no RM access |
| **Premium** | + Shared Relationship Manager |
| **Elite** | + Dedicated RM, Estate Planning, Advanced Vault |
| **Enterprise** | + Private Wealth Desk |

Tier is stored in `localStorage` as `wealthverse-subscription-tier` and controls RM access, feature gating, and upgrade prompts.

---

## Data Model

### `answers` — User Financial Profile

```js
{
  // Identity
  name, age, mobile, email, pan, gender, city,
  
  // Income
  salary, businessIncome, annualBonus, rentalIncome,
  
  // Expenses
  household, schoolFees, emiExpenses, insuranceExpenses, lifestyle,
  
  // Assets (array)
  assets: [{ id, name, type, investedValue, currentValue, ... }],
  
  // Liabilities (array)
  liabilities: [{ id, provider, type, outstandingAmount, emi, ... }],
  
  // Insurance (array)
  insurancePolicies: [{ id, insurer, type, sumAssured, premium, ... }],
  
  // Goals (array)
  goals: [{ id, name, target, saved, monthlyContribution, ... }],
  
  // Risk Profile
  riskAppetite, horizon, reactionToDrop, liquidityPreference,
  
  // Life Events
  lifeEvents, futureEvents
}
```

### Message Schema (SHERU Chat)

```js
{
  id:        "m42",
  role:      "user" | "assistant",
  text:      "What is my FIRE timeline?",
  
  // Assistant-only (offline rule engine path)
  bullets:   ["Point 1", "Point 2"],
  followUps: ["Am I on track?", "How to save tax?"]
}
```

---

## Key Files Reference

| File | Purpose |
|---|---|
| [`src/lib/sheru-api.js`](src/lib/sheru-api.js) | Sharekhan LLM API client |
| [`src/lib/coach.js`](src/lib/coach.js) | Offline rule-engine fallback |
| [`src/lib/score.js`](src/lib/score.js) | Wealth Health Score calculator |
| [`src/lib/derived.js`](src/lib/derived.js) | Protection & transfer scores |
| [`src/lib/goal-math.js`](src/lib/goal-math.js) | Goal projection & FIRE math |
| [`src/lib/wealth360.js`](src/lib/wealth360.js) | Simulation & DNA engine |
| [`src/context/app-context.jsx`](src/context/app-context.jsx) | Global state, sendMessage |
| [`src/components/wealth/chat-bubble.jsx`](src/components/wealth/chat-bubble.jsx) | LLM response renderer |
| [`src/components/wealth/app-shell.jsx`](src/components/wealth/app-shell.jsx) | Layout, sidebar, top-bar |
| [`src/routes/coach.jsx`](src/routes/coach.jsx) | SHERU chat page |
| [`vite.config.js`](vite.config.js) | Vite build + LLM proxy |

---

## Contributing

1. Branch from `main`
2. Follow the existing file-based routing conventions (`src/routes/`)
3. Use design-system tokens — no hardcoded colours in components
4. Keep components in `src/components/wealth/` or `src/components/ui/`
5. All LLM calls must go through `callSheruLLM()` in `sheru-api.js`

---

*Built for Roarathon 2026 · Mirae Asset Sharekhan WealthVerse*
