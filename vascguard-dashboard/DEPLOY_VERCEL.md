# 🚀 How to Deploy VascGuard AI to Vercel

The VascGuard AI Dashboard is already configured with:
- `vercel.json` (SPA routing & Vite build configuration)
- Direct HiveMQ Cloud MQTT over Secure WebSocket (`wss://broker.hivemq.com:8884/mqtt`) so it connects directly to your **Seeed Studio XIAO ESP32-C6** from the cloud without needing a local bridge server!
- Clean production build tested and verified (`npm run build` passing 100%)

---

## ⚡ Option 1: Deploy with Vercel CLI (Fastest — 1 Minute)

Open your terminal (PowerShell or Command Prompt) and run:

```bash
cd "d:\++Project\2026-VascGuide\VascGaurdAI\vascguard-dashboard"
npx vercel
```

### What to choose during prompts:
1. **Log in to Vercel**: A browser tab will open for you to log in with GitHub/GitLab/Email.
2. **Set up and deploy?**: Type `y` and press Enter.
3. **Which scope?**: Choose your personal account or team.
4. **Link to existing project?**: Type `n`.
5. **What’s your project’s name?**: Press Enter (defaults to `vascguard-dashboard`).
6. **In which directory is your code located?**: Press Enter (`./`).
7. **Want to modify these settings?**: Type `n` (Vercel automatically detects Vite).

To deploy directly to production with a permanent URL:
```bash
npx vercel --prod
```

Your live website URL will be printed in the terminal (e.g. `https://vascguard-dashboard.vercel.app`)!

---

## 🐙 Option 2: Deploy via GitHub (Continuous Deployment)

If you prefer linking your GitHub repository to Vercel for automatic updates on every git commit:

1. Create a new repository on [GitHub](https://github.com/new) named `vascguard-ai`.
2. Push your local project:
   ```bash
   cd "d:\++Project\2026-VascGuide\VascGaurdAI\vascguard-dashboard"
   git remote add origin https://github.com/<YOUR-USERNAME>/vascguard-ai.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new).
4. Click **Import** next to your `vascguard-ai` repository.
5. Framework Preset: **Vite** (automatically detected).
6. Click **Deploy**!

---

## 📡 How Live Hardware Telemetry Works on Vercel:

- When your site is hosted on Vercel (`https://...`), the client connects via encrypted WebSockets (`wss://broker.hivemq.com:8884/mqtt`) directly to topic:
  `tensai/max30102/+/telemetry`
- When your **Seeed Studio XIAO ESP32-C6** connects to Wi-Fi `"the one portfolio"` and publishes to `broker.hivemq.com`, the Vercel-hosted dashboard receives live SpO2, heart rate, and board temperature in real-time from anywhere in the world!

