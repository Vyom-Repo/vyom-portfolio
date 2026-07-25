# Vyom Prajapati — Portfolio

A premium, high-performance personal portfolio built using **Apple Spatial UI** design principles.

## Tech Stack
- **Frontend**: Pure HTML, CSS (Glassmorphism, CSS Grid), Vanilla JavaScript
- **Backend (API)**: Vercel Serverless Function (Node.js)
- **External API**: GitHub GraphQL API

---

## 🔒 GitHub Contribution Graph Architecture

This portfolio features a live GitHub Contribution Graph. To ensure maximum security, **the GitHub Personal Access Token (PAT) is never exposed to the frontend browser**. 

Instead, the frontend makes a request to a Vercel Serverless Function, which then securely handles the authentication and fetches the data from GitHub.

### How it works:
1. `script.js` calls `fetch('/api/github?username=Vyom-Repo')`.
2. Vercel routes `/api/github` to the serverless function `api/github.js`.
3. The serverless function securely reads the `GITHUB_TOKEN` from Vercel's Environment Variables.
4. The serverless function makes a `POST` request to `https://api.github.com/graphql`.
5. It receives the data, minimizes the JSON payload, and sends it back to the frontend.

---

## 🚀 Deployment Guide (Vercel)

This project is built to be deployed seamlessly on **Vercel**. Since there is no build step (no React/Next.js), Vercel will automatically host the static files and compile the `api/` directory into Serverless Functions.

### 1. Generate a GitHub PAT
You need a Fine-grained Personal Access Token to fetch your contribution data.
1. Go to [GitHub Developer Settings](https://github.com/settings/tokens?type=beta).
2. Click **Generate new token**.
3. Name it: `Portfolio Graph Token`.
4. Expiration: Set it to a long duration (e.g., 1 year).
5. Repository Access: **Public Repositories (read-only)**.
6. Permissions: Ensure you have read-only access to **Public Data**.
7. Click **Generate token** and **copy it** immediately.

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Import this GitHub repository.
3. Leave the Framework Preset as **Other** (it will auto-detect static files).
4. Do NOT click Deploy yet.

### 3. Add Environment Variable
1. Open the **Environment Variables** section before deploying.
2. Add a new variable:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: *(Paste the token you copied from GitHub)*
3. Click **Deploy**.

*If you already deployed, go to your Vercel Project Settings > Environment Variables, add the token, and then trigger a **Redeploy** from the Deployments tab.*

---

## ⚙️ Configuration

### Changing the GitHub Username
If you want to change the GitHub username that the graph pulls from, open `script.js` and locate this line near the bottom:
```javascript
const GITHUB_USERNAME = 'Vyom-Repo';
```
Change it to your target username, save, and commit.

---

## ✨ Features
- **Spatial UI**: Advanced glassmorphism, soft depth, backdrop filters, and glowing borders.
- **Micro-interactions**: 60fps spring animations, staggered entry transitions, and mouse-parallax tooltips.
- **Dynamic Data**: Real-time project fetching and contribution graphing.
- **Responsive**: Fluid typography and flex/grid layouts adapting to mobile and desktop screens.
