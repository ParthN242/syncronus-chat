# 💬 Syncronus Chat

A real-time chat application enabling seamless communication between users. Built with a modern tech stack to ensure fast and reliable messaging.

## 🌐 Live Demo

👉 [syncronus-chat-rosy.vercel.app](https://syncronus-chat-rosy.vercel.app)

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
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the Application**

   Open two terminal windows/tabs:

   - **Start the backend server**

     ```bash
     cd server
     npm start
     ```

   - **Start the frontend development server**

     ```bash
     cd client
     npm start
     ```

   The application should now be running at `http://localhost:3000`.

---

## 🖼️ Screenshots

> *Note: Add actual screenshots in the `screenshots/` directory and update the paths below accordingly.*

### 🏠 Home Page

![Home Page](screenshots/home-page.png)

### 💬 Chat Interface

![Chat Interface](screenshots/chat-interface.png)

---

## 📚 Technologies Used

- **Frontend:** React, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (if implemented)
- **Deployment:** Vercel

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📫 Contact

For any inquiries or feedback, please reach out to [your.email@example.com](mailto:your.email@example.com).
