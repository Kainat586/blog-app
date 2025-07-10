import React, { useState } from "react";
import "./PostCard.css";

const PostCard = ({ post }) => {
  const [showFull, setShowFull] = useState(false);
  const { title, content, media, date, author } = post;

  return (
    <div className="post-card" onClick={() => setShowFull(!showFull)}>
      {media && (
        <div className="post-media">
          <img src={`http://localhost:5000${media}`} alt="Post media" />
        </div>
      )}
      <h3>{title}</h3>
      <p>{showFull ? content : content.slice(0, 150) + (content.length > 150 ? "..." : "")}</p>
      <div className="meta">
        <span>{date}</span> | <span>{author}</span>
      </div>
    </div>
  );
};

export default PostCard;
