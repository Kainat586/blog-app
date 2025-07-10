import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        const enrichedPosts = res.data.posts.reverse().map(post => ({
          ...post,
          author: post.author || "Unknown",
          date: post.date ? new Date(post.date).toLocaleDateString() : "Unknown"
        }));
        setPosts(enrichedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={`home-container ${darkMode ? "dark" : "light"}`}>
      <nav className="navbar">
        <div className="logo">MyBlogSite</div>
        <div className="nav-actions">
          <button onClick={toggleTheme}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={() => window.location.href = "/login"}>Login</button>
        </div>
      </nav>

      <header className="hero">
        <h1 className="heading">Explore Brilliant Stories & Insights</h1>
        <p className="heading">Authentic experiences, curated content, and expressive creativity.</p>
        <button
          className="get-started-btn"
          onClick={() => window.location.href = "/login"}
        >
          Get Started
        </button>
      </header>

      <section className="posts-section">
        <h2 className="heading">Latest Posts</h2>
        <div className="posts-grid">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
