# Fleet ZeroAI by Kamandaka Jalan

### ⭐️ Top 20 Solution of [Shell.ai Hackathon 2024 General Edition](https://www.hackerearth.com/challenges/new/competitive/shellai-hackathon-2024/)

This repository contains Kamandaka Jalan official prototype for [Shell.ai Hackathon phase 2](https://shellaihackathon2024level2.hackerearth.com/).

The solution is a web-based calculator which prepopulated with the official demand, carbon emission target, vehicles, fuels, and cost profiles data. Fleet owners as the user can adjust the value for each field especially the demand and carbon emission reduction target according to their own needs.

After all the value is confirmed, user can click "Calculate" button and the web-app will execute our optimization function to find the best list of actions that user can do to achieve their target with the least cost. We provide key metrics such as the emission trend and cost breakdown showcased in an interactive chart.

User can also download or export the result in CSV or JSON format to keep or share the planning result obtained. Please give it a try and let us know if your have any feedback! Thank you.

## 💫 Demo

We also share the live demo and all related content to our protoype!

- [LIVE Demo] [Try me Here](https://shell-ai-web.vercel.app/)
- [Pitch Video](https://www.youtube.com/watch?v=PvfuHVSO77I)
- [Pitch Deck](https://www.canva.com/design/DAGM6aj_FgU/3g5LJKThqgOekfUR3rj6PA/edit?utm_content=DAGM6aj_FgU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## ⚙️ Local Setup

Install pnpm, the prototype was developed using version 9.5.0

```bash
pnpm install
pnpm dev
```

## 👨‍💻 Usage

Open [http://localhost:3000](http://localhost:3000) or the [Live Demo](https://shell-ai-web.vercel.app) with your browser. We would recommend to use PC/Laptop and Chrome.

Calculator page with default value
https://shell-ai-web.vercel.app
http://localhost:3000

Upload your own data
https://shell-ai-web.vercel.app/upload
http://localhost:3000/upload
