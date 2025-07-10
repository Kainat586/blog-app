import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        const found = res.data.posts.find(p => p._id === id);
        setPost(found);
      } catch (err) {
        console.error("Failed to load post:", err);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <div className="post-detail-container">Loading post...</div>;

  return (
    <div className="post-detail-container">
      {post.media && (
        <img
          className="post-detail-image"
          src={`http://localhost:5000${post.media}`}
          alt="Post Media"
        />
      )}

      <h1 className="post-detail-title">{post.title}</h1>

      <div className="post-detail-meta">
        {new Date(post.date).toLocaleDateString()} | {post.author}
      </div>

      <p className="post-detail-content">{post.content}</p>

      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
};

export default PostDetail;
