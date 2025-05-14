# C++ Social Media Web App

## Description
This is a simple social media app backend written in C++ using object-oriented programming principles. It is integrated with HTML/CSS front-end through CGI (Common Gateway Interface). JavaScript is used minimally for form submission and dynamic post loading.

## Features
- User registration and login
- Create and view posts
- Friend system with privacy for posts
- Notifications for friend posts
- Basic comment functionality

## Directory Structure

```
project-root/
├── cgi-bin/              # Compiled CGI binaries
│   ├── register.cgi
│   ├── login.cgi
│   └── getposts.cgi
├── src/                  # C++ source files
│   ├── main.cpp
│   ├── User.cpp
│   └── ...
├── headers/              # C++ header files
│   ├── User.h
│   └── ...
├── html/                 # HTML pages
│   ├── register.html
│   └── ...
├── js/                   # JavaScript files
│   ├── register.js
│   └── ...
├── database/             # Flat-file database
│   ├── users.txt
│   └── posts.txt
```

## Compilation Instructions

Run the following commands inside your terminal (adjust the file names as needed):

```bash
g++ -std=c++17 -o cgi-bin/register.cgi src/register.cpp src/User.cpp -Iheaders
g++ -std=c++17 -o cgi-bin/login.cgi src/login.cpp src/User.cpp -Iheaders
g++ -std=c++17 -o cgi-bin/getposts.cgi src/getposts.cpp src/Post.cpp -Iheaders
```

Make the binaries executable:

```bash
chmod +x cgi-bin/*.cgi
```

## Usage

1. Open Visual Studio Code.
2. Use the "Live Server" extension to host `html/register.html`.
3. Register a new user.
4. Log in and navigate to `home.html` to create/view posts.

## Requirements

- Visual Studio Code
- Live Server extension
- g++ compiler

## Notes

- This project does not use any external server like Apache. It uses a local environment only.
- Passwords are stored as plain strings for simplicity. DO NOT use in production.
- Can be extended with session handling and improved security.
