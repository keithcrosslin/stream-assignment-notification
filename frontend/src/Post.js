import React from 'react';

const Post = ((props) => {
  return (
    <div className="row">
      <div className="col">{props.activity.instructor}</div>
      <div className="col">{props.activity.class}</div>
      <div className="col">{props.activity.title}</div>
      <div className="col">{props.activity.time}</div>
    </div>
  );
});

export default Post;
