# 🌐 ConnectMe — A Simple Social Media App (C++ + Crow)

ConnectMe is a lightweight social media web app built using C++ for backend logic with the Crow web framework, and HTML/CSS for the frontend. It allows user registration, login, posting content, commenting, friendships, and notifications — all powered by a file-based data system.

## 🚀 Features

- 👤 User registration and login (with sessions)
- 📝 Post creation, deletion, and viewing
- 💬 Commenting on posts
- 👥 Friend system (send/request/accept friends)
- 🔔 Notification system
- 📁 File-based database (no SQL)
- 📦 Organized OOP structure using C++ classes

## 🧱 Tech Stack

- 💻 Backend: C++20, Crow Web Framework
- 🌐 Frontend: HTML5, CSS3, JavaScript
- 📂 Storage: File I/O (.txt for users, posts, comments, etc.)

## 📁 Folder Structure

```
/project-root
│
├── src/                # C++ source files
│   └── *.cpp           # Logic files (User, Post, etc.)
│
├── headers/            # Header files (.h)
│   └── *.h
│
├── html/
│   └── index.html
│
├── js/
│   └── script.js
│
├── css/
│   └── styles.css
│
├── data/           # Text-based database
│   ├── users.txt
│   ├── posts.txt
│   ├── comments.txt
│   └── ...
│
├── crow_all.h          # Crow header
├── main.cpp		 # Crow server entry point
└── README.md
```

## 🛠️ Build & Run Instructions

### Prerequisites

- C++17 or higher
- Crow (header-only) — include crow_all.h or install via vcpkg
- Boost & OpenSSL (required by Crow)
- A C++ compiler like g++, clang++, or MSVC

### Compilation (example using g++)

```bash
g++ -std=c++20 -O2 -Iheaders src/main.cpp -o server -lpthread
```

### Run

```bash
./server
```

Then open http://localhost:18080 in your browser.

## 📌 Notes

- Crow handles routing and JSON serialization.
- JavaScript is used for client-side interactivity.