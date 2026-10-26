# ⚽ TeApuesto Assistant (`teapuesto-agent`)

> An AI-powered agent built with **Mastra**, **Gemma**, and **SerpApi** that transforms daily sports-betting odds images into engaging customer sales speeches and concise daily performance reports.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-teapuesto.juanhuanaco.tech-brightgreen?style=for-the-badge&logo=render)](https://teapuesto.juanhuanaco.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Framework: Mastra](https://img.shields.io/badge/Framework-Mastra-purple?style=for-the-badge)](https://mastra.ai)
[![Hosted on Render](https://img.shields.io/badge/Hosted%20on-Render-informational?style=for-the-badge&logo=render)](https://render.com)

---

## 📌 Problem & Context

Every morning, sports-betting booth operators need to review the day's odds board, search for team stats and standings, and draft pitch speeches to engage customers. At night, they must compile sales reports. 

**TeApuesto Assistant** solves this by offering a zero-friction mobile PWA:
1. The user uploads or takes a photo of the odds board.
2. The agent analyzes the matches, queries real-time web statistics via **SerpApi**, and processes the reasoning through **Gemma**.
3. It instantly outputs an engaging pitch speech in the morning or a structured sales report at night.

---

## ✨ Key Features

- 📸 **Image-to-Speech Generation**: Extracts matches from uploaded odds board images and generates customer-facing sports betting pitches.
- 📊 **Daily Sales Report Summarization**: Formats daily betting summaries in seconds.
- 🌐 **Real-Time Sports Grounding**: Queries live team standings, streaks, and statistics using SerpApi tools within Mastra.
- 📱 **Mobile-First PWA**: Designed for non-tech-savvy users with tabbed navigation, Base64 processing, and one-tap clipboard copying.
- ⚡ **Express 5 + Vite Architecture**: Minimalist full-stack setup with seamless static asset delivery and API routes.

---

## 🛠️ Tech Stack

- **Frontend**: Vite, React/TypeScript, Tailwind CSS, PWA support.
- **Backend**: Node.js, Express 5.
- **Agent Framework**: [Mastra](https://mastra.ai) (`@mastra/core`).
- **LLM / Open-Weight Model**: Google's **Gemma** served via [Featherless.ai](https://featherless.ai).
- **Web Search Tool**: [SerpApi](https://serpapi.com) for real-time sports statistics.
- **Deployment**: [Render](https://render.com) Web Service with custom domain configuration (`.tech`).

---

## 📂 Project Structure

```text
teapuesto-agent/
├── dist/                   # Compiled client and server assets
├── src/
│   ├── client/             # Frontend PWA (Vite + React/Tailwind)
│   │   ├── src/
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── server/             # Express 5 backend & Mastra configuration
│       ├── mastra/
│       │   ├── agents/     # Mastra agents (Speech & Daily Report)
│       │   ├── tools/      # SerpApi integration tool
│       │   └── index.ts    # Mastra instance definition
│       └── index.ts        # Express server entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started
### Prerequisites
Node.js v20+pnpm (recommended package manager)
### Environment Variables
Create a .env file in the root directory:
```text
# LLM Provider (Featherless.ai or Groq)
FEATHERLESS_API_KEY=your_featherless_api_key_here

# SerpApi
SERPAPI_API_KEY=your_serpapi_api_key_here
```

## 📡 API Endpoints
|Method|Endpoint|Description|Payload|
|---|---|---|---|
|GET|/api/health|Service health check|None
|POST|/api/agents/speech|Generates morning pitch speech|Plaintext Base64 image string
|POST|/api/agents/dailyreport|Generates nightly sales report|Plaintext Base64 image string

## 📄 License
Distributed under the MIT License. See LICENSE for more information.
