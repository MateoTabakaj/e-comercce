// CommentForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ postId, handleCommentAdd }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/posts/comment',
        { postId, text: comment },
        { withCredentials: true }
      );
      handleCommentAdd(postId, response.data.post);
      setComment('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={comment}
        placeholder="Add a comment"
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
