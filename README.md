# 🗺️ GeoJournal

A geo-social journal web app where you can drop photo posts and journal entries on a world map, connect with friends, and explore each other's lives through locations.

> Built from scratch as a full-stack resume project — REST APIs, maps, photo uploads, auth, and a friends system.

---

## ✨ Features

- 📍 **Drop posts on a map** — every journal entry is pinned to a real location
- 📸 **Photo uploads** — attach images to your posts (stored on Cloudinary)
- 🔐 **Auth** — register and login with JWT-based authentication
- 👥 **Friends system** — send, accept, and reject friend requests
- 🌍 **Shared map** — see your own posts and your friends' posts on one map
- 📌 **Color-coded pins** — your posts show in pink, friends' in blue
- 📍 **Auto location** — uses browser geolocation or enter coordinates manually

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Leaflet.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens), bcrypt |
| File Storage | Cloudinary + Multer |
| Maps | OpenStreetMap via Leaflet |

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- A Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/Moningi-Srija/geojournal.git
cd geojournal
```

### 2. Set up the server
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
PORT=3000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3001
```

Start the server:
```bash
npm run dev
```

### 3. Set up the client
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```
REACT_APP_API_URL=http://localhost:3000
```

Start the frontend:
```bash
npm start
```

---

## 📁 Project Structure

```
geojournal/
├── client/               # React frontend
│   └── src/
│       └── components/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Map.jsx
│           ├── CreatePost.jsx
│           └── Friends.jsx
└── server/               # Express backend
    ├── routes/
    │   ├── auth.js
    │   ├── posts.js
    │   ├── map.js
    │   ├── friends.js
    │   └── users.js
    ├── middleware/
    │   └── auth.js
    ├── db.js
    └── index.js
```

---

## 🌐 Deployment

- **Backend** — Railway
- **Frontend** — Vercel

---

*Built by Srija 👩‍💻*
