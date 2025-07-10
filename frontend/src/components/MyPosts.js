// components/MyPosts.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostList from "./PostList";

const MyPosts = () => {
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const email = res.data.email;
        const posts = res.data.posts.reverse();
        const myName = email?.split("@")[0];
        const myPosts = posts.filter(post => post.author === myName);

        setUserEmail(email);
        setVisiblePosts(myPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    console.log("Edit clicked", post);
    // Add edit behavior if needed
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisiblePosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="myposts-page">
      <h2>Your Posts</h2>
      <PostList posts={visiblePosts} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default MyPosts;
