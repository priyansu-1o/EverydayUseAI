<h1 align="center">Event Feedback Form Generator ⚡</h1>

<p align="center"><em>An automated system that turns any event description into a customized Google Form using Gemini AI.</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Google%20Apps%20Script-4285F4?logo=google&logoColor=white" alt="Google Apps Script">
  <img src="https://img.shields.io/badge/AI-Gemini%203.8%20Flash-8E75B2?logo=google&logoColor=white" alt="Gemini AI">
  <img src="https://img.shields.io/badge/UI-Glassmorphism-EC4899" alt="UI Design">
</p>

---

## 📌 Overview

**Event Feedback Form Generator** is a serverless Google Apps Script web application. You simply type or paste an event description (e.g., "A 2-day AI hackathon with coding sessions and catering"), and the app uses the **Gemini API** and **Google Forms API** to instantly generate a highly customized feedback survey.

It features a premium, responsive frontend built with modern web technologies (glassmorphism, dark mode, smooth animations) while requiring **zero backend hosting**—it runs entirely inside your Google Workspace account.

## ✨ Features

- **🧠 AI-Powered Form Generation**: Analyzes event context, purpose, and activities to create tailored questions (linear scales, paragraphs, multiple-choice).
- **🎨 Premium UI**: A stunning, modern interface with glassmorphic cards, gradient buttons, and micro-animations.
- **🔄 Robust API Handling**: Built-in exponential backoff retry logic to handle temporary Gemini API rate limits and high demand.
- **☁️ Serverless Architecture**: Hosted entirely on Google Apps Script. No Node.js or separate servers required.
- **🔗 Instant Links**: Provides immediate access to both the "Edit Form" link (for the creator) and the "Share" link (for attendees).

## 🚀 Setup & Deployment (5 Minutes)

Because this runs on Google Apps Script, you don't need traditional hosting.

### 1. Get a Free Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Click **Create API Key** and copy it.

### 2. Create the Project
1. Go to [script.google.com](https://script.google.com) and click **New Project**.
2. Go to **Project Settings** (gear icon ⚙️) and check **"Show 'appsscript.json' manifest file in editor"**.
3. Under **Script Properties**, click **Add script property**:
   - Property: `GEMINI_API_KEY`
   - Value: *(paste your API key here)*

### 3. Add the Code
Return to the editor (`< >` icon) and copy the contents from this repository into the project:
- Replace `appsscript.json` with the contents of [`appsscript.json`](appsscript.json).
- Delete the default `Code.gs` and create a new script file named `Code` with the contents of [`Code.gs`](Code.gs).
- Create a new script file named `Prompts` with the contents of [`Prompts.gs`](Prompts.gs).
- Create a new **HTML file** named `Index` with the contents of [`Index.html`](Index.html).

### 4. Deploy as a Web App
1. Click **Deploy** -> **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the deployment settings:
   - **Execute as:** `Me` *(If you want the forms saved to your drive)* OR `User accessing the web app` *(If you want users to log in and save forms to their own drives)*.
   - **Who has access:** `Anyone` *(or restrict to anyone with a Google Account depending on the previous setting)*.
4. Click **Deploy**, authorize the app, and open the generated Web App URL!

## 💻 Local Development (Optional)

If you prefer using your terminal to manage the code, you can use Google's `clasp` tool:

```bash
# Install clasp globally
npm install -g @google/clasp

# Login to your Google account
clasp login

# Initialize the project
clasp create --type webapp --title "Event Form Generator"

# Push the local files to Google Apps Script
clasp push

# Deploy
clasp deploy
```

## 📂 Project Structure

- `Index.html`: The single-page frontend application containing HTML, CSS (Vanilla + modern variables), and client-side JavaScript.
- `Code.gs`: The backend Apps Script logic for routing, Google Forms API interactions, and calling the Gemini API.
- `Prompts.gs`: The highly tuned system instructions for Gemini.
- `appsscript.json`: The manifest file handling OAuth scopes and runtime configurations.

## 🛠️ Built With
- **Google Apps Script**
- **Google Forms API**
- **Gemini 3.8 Flash**
- **Feather Icons**
- **Google Fonts (Inter)**

## 📜 License
MIT License. Do whatever you want with it!
