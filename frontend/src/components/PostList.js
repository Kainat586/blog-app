// components/PostList.js
import React from "react";

function PostList({ posts = [], handleEdit, handleDelete, fetchedOnce }) {
  return (
    <div className="post-list">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="actions">
              <button onClick={() => handleEdit(post)}>✏️ Edit</button>
              <button onClick={() => handleDelete(post._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))
      ) : fetchedOnce ? (
        <p>No posts yet.</p>
      ) : null}
    </div>
  );
}

export default PostList;
