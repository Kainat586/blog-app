import React, { useState, useEffect } from "react";
import axios from "axios";
import './PostForm.css';

const PostForm = ({ refresh, editingPost, clearEdit }) => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [media, setMedia] = useState(null);

  useEffect(() => {
    if (editingPost) {
      setForm({
        title: editingPost.title,
        content: editingPost.content,
      });
    } else {
      setForm({ title: "", content: "" });
      setMedia(null);
    }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (media) {
      formData.append("media", media);
    }

    try {
      if (editingPost) {
        await axios.put(`http://localhost:5000/api/posts/${editingPost._id}`, {
          title: form.title,
          content: form.content,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/posts", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ title: "", content: "" });
      setMedia(null);
      refresh();
      if (editingPost) clearEdit();
    } catch (err) {
      console.error("Error submitting post:", err);
      alert(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
      ></textarea>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files[0])}
      />
      <div className="form-actions">
        <button type="submit">
          {editingPost ? "Update Post" : "Add Post"}
        </button>
        {editingPost && (
          <button type="button" onClick={clearEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
