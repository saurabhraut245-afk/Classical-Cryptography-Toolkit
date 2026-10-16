# 🔐 Classical Cryptography Toolkit

> A fully interactive, browser-based **Classical Cryptography Toolkit** built for the **Network Security** mini project (Final Year ECM 2026-27). No backend required — runs entirely in the browser.



## 📋 Project Details

| Field | Details |
|-------|---------|
| **Course** | Network Security |
| **Class** | Final Year (ECM) 2026-27 |
| **Project Type** | Mini Project 1 |
| **Tech Stack** | HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | ❌ None — Pure Frontend |
| **Deployment** | Netlify (Static Hosting) |

---

## 🎯 Objective

Design and develop a menu-driven software application that implements **classical encryption algorithms** for secure text encryption and decryption with a modern, interactive interface.

---

## ✨ Features

- ✅ **8 Classical Cipher Algorithms** fully implemented
- ✅ **Real-time Encryption & Decryption**
- ✅ **Interactive Visualizers** — Shift Wheel, Step Breakdown, Frequency Analysis
- ✅ **Algorithm Comparison Table** — Security, Key Space, Execution Time
- ✅ **File Encrypt / Decrypt** — Upload `.txt` files and download results
- ✅ **Sample Text Chips** — One-click sample input
- ✅ **Copy to Clipboard** — For encrypted/decrypted output
- ✅ **Session Lock** — Clears sensitive data from memory
- ✅ **Responsive Design** — Works on desktop and tablet
- ✅ **Dark Cyberpunk UI** — Modern, premium design

---

## 🔑 Cipher Algorithms Implemented

### 🔄 Substitution Ciphers

| # | Cipher | Key Format | Security |
|---|--------|-----------|----------|
| 01 | **Caesar Cipher** | Number (0–25) | 🔴 Low |
| 02 | **Monoalphabetic Cipher** | Keyword string | 🟡 Medium |
| 03 | **Playfair Cipher** | Keyword string (5×5 matrix) | 🟡 Medium |
| 04 | **Hill Cipher (Matrix)** | 4 numbers `a b c d` (2×2 matrix) | 🟡 Medium |
| 05 | **Vigenère Cipher** | Keyword string | 🟢 High |
| 06 | **One-Time Pad (Vernam)** | Random key ≥ plaintext length | 🔵 Very High |

### 🔀 Transposition Ciphers

| # | Cipher | Key Format | Security |
|---|--------|-----------|----------|
| 07 | **Rail Fence Cipher** | Number of rails (2–5) | 🔴 Low |
| 08 | **Columnar Transposition** | Keyword string | 🟡 Medium |

### 🛠️ Utility Modules

| # | Module | Description |
|---|--------|-------------|
| 09 | **Compare Algorithms** | Side-by-side comparison table |
| 10 | **Encrypt Text File** | Upload `.txt` → encrypt → download |
| 11 | **Decrypt Text File** | Upload encrypted `.txt` → decrypt → download |
| 12 | **Help & Project Report** | Documentation and quick reference |
| 13 | **Lock Toolkit / Exit** | Session lock, clear memory |

---

## 📁 Project Structure

```
Ns project 1/
│
├── index.html          # Main HTML file — sidebar + layout
├── style.css           # Complete CSS design system (dark theme)
├── ciphers.js          # All 8 cipher algorithm implementations
├── app.js              # UI rendering, event handling, visualizers
└── README.md           # This file
```

---

## 🚀 How to Run Locally

### Option 1 — Direct Browser (Easiest)
1. Download / clone this project
2. Double-click `index.html`
3. Opens directly in your browser ✅

### Option 2 — VS Code Live Server
1. Open folder in VS Code
2. Install **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**

---

## 🌍 How to Deploy on Netlify

### Drag & Drop Method (Recommended)
1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag the **entire project folder** onto the Netlify upload box
4. Wait ~30 seconds → Your site is **live!** 🎉

### CLI Method
```bash
npm install -g netlify-cli
netlify deploy --dir . --prod
```

---

## 💡 Sample Usage

```
Input Plaintext  : NETWORK SECURITY
Selected Cipher  : Caesar Cipher
Key              : 5

Encrypted Text   : SJYBTWP XJHZWNYD
Decrypted Text   : NETWORK SECURITY
```

---

## 🧪 Algorithm Details

### Caesar Cipher
- Shifts each letter by key `k` (0–25)
- Formula: `E(x) = (x + k) mod 26`
- Historical use: Julius Caesar, ~100 BC

### Monoalphabetic Cipher
- Each letter has a fixed unique substitute
- Key space: 26! ≈ 4 × 10²⁶
- Vulnerable to frequency analysis

### Playfair Cipher
- Digraph substitution using 5×5 matrix
- J is treated as I
- Invented by Charles Wheatstone, 1854

### Hill Cipher
- Uses 2×2 matrix multiplication mod 26
- Key matrix must be invertible mod 26
- Invented by Lester Hill, 1929

### Vigenère Cipher
- Polyalphabetic — repeating keyword
- Formula: `C(i) = (P(i) + K(i mod len)) mod 26`
- Considered "unbreakable" for centuries

### One-Time Pad (Vernam)
- Theoretically unbreakable
- Key must be: random, same length, used only once
- Patented by Gilbert Vernam, 1917

### Rail Fence Cipher
- Writes plaintext in zigzag across N rails
- Reads off row by row
- Used in American Civil War

### Columnar Transposition
- Text written in rows, columns read in key-alphabetical order
- Used extensively in WWI and WWII

---

## 🎨 Design System

- **Theme:** Dark Cyberpunk / Glassmorphism
- **Primary Color:** Cyan `#38bdf8`
- **Accent Colors:** Green `#4ade80`, Purple `#a78bfa`, Orange `#fb923c`
- **Fonts:** Inter (UI), JetBrains Mono (code/output), Rajdhani (headings)
- **Background:** Deep dark navy `#0a0d14`

---

## 📄 Deliverables (As per Project Guidelines)

- [x] Source Code (HTML + CSS + JS)
- [ ] Mini Project Report (Word/PDF)
- [ ] Presentation (5–6 slides)
- [ ] Demonstration Video (max 5 minutes)
- [ ] User Manual

---

## 📌 References

- Stallings, W. (2017). *Cryptography and Network Security: Principles and Practice*. Pearson.
- Singh, S. (1999). *The Code Book*. Doubleday.
- [Netlify Docs](https://docs.netlify.com)

---

## 📜 License

This project is created for educational purposes as part of the **Network Security** course mini project.

---

<div align="center">
  Made with ❤️ for Network Security Mini Project | Final Year ECM 2026-27
</div>
