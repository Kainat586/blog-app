import React, { useState, useEffect } from "react";
import axios from "axios";
import PostForm from "./PostForm";
import PostList from "./PostList";
import './Blog.css';

const Blog = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [fetchedOnce, setFetchedOnce] = useState(false);


  const fetchPosts = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axios.get("http://localhost:5000/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const all = res.data.posts.reverse();
    const email = res.data.email || "";

    setAllPosts(all);
    setUserEmail(email);
    setVisiblePosts([]); // initially hide posts
  } catch (err) {
    console.error("Error fetching posts:", err);
  } finally {
    setFetchedOnce(true); // ✅ make sure to set this after fetch completes
  }
};


  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeeMyPosts = () => {
    const myName = userEmail.split("@")[0];
    const myPosts = allPosts.filter(post => post.author === myName);
    setVisiblePosts(myPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="blog-container">
      <header className="blog-header">
        <h2>📝 My Blog Dashboard</h2>
        <p>Create, Edit & Manage your personal blog posts</p>
      </header>

      <PostForm
        refresh={fetchPosts}
        editingPost={editingPost}
        clearEdit={() => setEditingPost(null)}
      />

      <div className="see-posts">
        <button onClick={handleSeeMyPosts}>See Your Posts</button>
      </div>

      <PostList
        posts={visiblePosts}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
};

export default Blog;
