# 💬 Syncronus Chat

A real-time chat application enabling seamless communication between users. Built with a modern tech stack to ensure fast and reliable messaging.

## 🌐 Live Demo

👉 [syncronus-chat-rosy.vercel.app]([https://syncronus-chat-rosy.vercel.app](https://syncronus-chat-client.vercel.app/))

---

## 📁 Project Structure

```
syncronus-chat/
├── client/   # Frontend built with React
└── server/   # Backend powered by Node.js and Express
```

---

## 🚀 Features

- Real-time messaging with instant updates
- User-friendly interface for seamless communication
- Scalable architecture separating frontend and backend

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- [MongoDB](https://www.mongodb.com/) for database (if used)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ParthN242/syncronus-chat.git
   cd syncronus-chat
   ```

2. **Install dependencies**

   Navigate to both the `client` and `server` directories and install the required packages:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Configure Environment Variables**

   In the `server` directory, create a `.env` file and add the necessary environment variables:

   ```env

   PORT=3000
   DATABASE_URL
   ORIGIN
   JWT_KEY

   ```

4. **Run the Application**

   Open two terminal windows/tabs:

   - **Start the backend server**

     ```bash
     cd server
     npm run dev
     ```

   - **Start the frontend development server**

     ```bash
     cd client
     npm run dev
     ```

   The application should now be running at `http://localhost:3000`.

---

## 📚 Technologies Used

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (if implemented)
- **Deployment:** Vercel

---

## ⭐ Give it a Star!

If you found this project helpful, please give it a ⭐ on GitHub!

