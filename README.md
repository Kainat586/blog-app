# 📝 Blog App

A full-stack blog application built using **React (Frontend)**, **Flask (Backend)**, and **MongoDB Cloud (Atlas)**. Users can sign up, log in, create blog posts with media (images/videos), view their own posts, and explore a styled homepage like modern WordPress blogs.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Sign Up & Login with JWT tokens
  - Secure password storage using hashing
  - Light/Dark Mode toggle for a personalized experience

- 🧾 **Post Management**
  - Create, edit, and delete blog posts
  - Upload and preview images/videos
  - Only post owner can modify or delete their content

- 🏠 **Homepage (Public View)**
  - Displays all published posts
  - WordPress-style card layout with image, preview, author & date

- 🙋‍♀️ **User Dashboard**
  - "See Your Posts" — view posts created by the logged-in user
  - Fully styled, center-aligned cards for user-specific posts

- 📄 **Full Post View**
  - Clicking a post opens full content with media

- 🎨 **Modern Styling**
  - Light/Dark Mode support
  - Custom themes using CSS modules
  - Responsive layout for mobile/desktop

- 📁 **MERN-like Folder Structure**
  - React frontend in `/frontend`
  - Flask backend in `/backend`
  - Images saved locally or to cloud
  - MongoDB Atlas used for remote storage

---

## 🔧 Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React.js, JSX, CSS |
| Backend      | Flask (Python), Flask-JWT |
| Database     | MongoDB Atlas (Cloud) |
| Media Upload | Flask + FileSystem |
| Auth         | JWT Tokens |
| Hosting (optional) | GitHub, Vercel, Render |

---

## 📂 Project Structure

blog-app/
│
├── frontend/ # React App
│ ├── components/
│ ├── pages/
│ └── App.js
│
├── backend/ # Flask API
│ ├── routes/
│ ├── models/
│ └── app.py
│
├── uploads/ # Uploaded media files (local)
├── README.md
└── .gitignore

yaml
Copy
Edit

---

## 🛠️ Setup Instructions

### 📦 Prerequisites
- Python 3.8+
- Node.js & npm
- MongoDB Atlas account
- Git

---

### 💻 Backend (Flask API)

```bash
cd backend
pip install -r requirements.txt
python app.py
