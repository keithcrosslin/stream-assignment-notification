import React from 'react';

const PostNotification = ((props) => {
  let date = props.activity.group.substr(props.activity.group.length - 10); // => "Tabs1"
  return (
    <tr>
      <td>{date}</td>
      <td>{props.activity.activity_count}</td>
      <td>{props.activity.actor_count}</td>
    </tr>
  );
});

export default PostNotification;
