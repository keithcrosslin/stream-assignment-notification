import React from 'react';

const PostNotification = ((props) => {
  let date = props.activity.group.substr(props.activity.group.length - 10); // => "Tabs1"
  return (
    <div className="row">
      <div className="col">{date}</div>
      <div className="col">{props.activity.activity_count}</div>
      <div className="col">{props.activity.actor_count}</div>
    </div>
  );
});

export default PostNotification;
