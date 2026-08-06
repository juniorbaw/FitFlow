# FitFlow — AI-Powered Acquisition Pipeline 🤖🏋️‍♂️

> **🇫🇷 Résumé (FR) :** Système d'automatisation IA pour les professionnels du fitness. Il capture les prospects via les réseaux sociaux, qualifie leurs besoins de manière conversationnelle avec l'IA (Gemini), et stocke les données structurées dans une base de données.

**An automated lead generation and qualification pipeline combining social messaging, Generative AI, and relational databases.**

---

## 🎯 The Problem
Fitness coaches and gym owners lose countless hours answering repetitive DMs (Direct Messages) on Instagram/Facebook. Moreover, potential leads drop off because they don't get immediate, personalized responses when inquiring about coaching programs.

## 💡 The Solution
FitFlow automates the top of the funnel. It intercepts inbound messages, uses a Large Language Model to converse naturally with the prospect, extracts their fitness goals, and saves this qualified profile into a database for the coach to close the sale.

### Architecture & Data Flow
1. **Trigger:** User sends a DM on Instagram/Messenger (handled by **ManyChat**).
2. **Orchestration:** **Make.com** catches the webhook and routes the data.
3. **AI Processing:** **Google Gemini** analyzes the conversation context, replies naturally, and extracts key data points (Age, Goal, Current Weight).
4. **Storage:** Structured data is pushed securely into **Supabase** (PostgreSQL) for the coach's CRM.

---

## 🛠 Tech Stack

| Component | Tool |
| :--- | :--- |
| **Social API** | ManyChat |
| **Automation** | Make.com (Integromat) |
| **AI Engine** | Google Gemini |
| **Database/Backend** | Supabase (PostgreSQL) |

---

## 🚀 Skills Demonstrated
* **Prompt Engineering:** Designing system prompts that keep the AI strictly within the bounds of a fitness sales agent.
* **API Integrations & Webhooks:** Connecting disparate systems seamlessly.
* **Data Modeling:** Structuring NoSQL/JSON outputs from LLMs into clean relational database tables.
