import React, { useState, useRef } from 'react';
import {
  StreamApp,
  FlatFeed,
} from 'react-activity-feed';
import 'react-activity-feed/dist/index.es.css';
import axios from 'axios';
import PostNotification from './PostNotification';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [instructorState, setInstructorState] = useState('JOIN');
  const [username, setUsername] = useState('');
  const [studentName, setStudentName] = useState("");
  const [streamClient, setStreamClient] = useState(null);
  const [instructorFollowing, setIntructorFollowing] = useState('');
  const containerRef = useRef(null);

  const register = async (e) => {
    try {
      e.preventDefault();

      var response = await axios.post('http://localhost:8080/registration', {
        username: username,
      });

      setStreamClient({ token: response.data.userToken, apiKey: response.data.streamApiKey, appId: response.data.appId });
      setInstructorState("NOTIFICATION");

    } catch (e) {
      console.error(e, e.error);
    }
  };

  const follow = async (e) => {
    try {
      e.preventDefault();

      await axios.post('http://localhost:8080/follow', {
        username: username,
        student: studentName,
      });
      setStudentName('');
      let response2 = await axios.get('http://localhost:8080/following', { params: { username: username } });
      setIntructorFollowing(response2.data);

    } catch (e) {
      console.error(e, e.error);
    }
  }

  const following = async (e) => {
    try {
      e.preventDefault();
      let response = await axios.get('http://localhost:8080/following', { params: { username: username } });
      setIntructorFollowing(response.data);
      setInstructorState("FOLLOW");

    } catch (e) {
      console.error(e, e.error);
    }
  }

  const logout = (e) => {
    setUsername('');
    setStreamClient(null);
    setInstructorState('JOIN');
  };

  function join() {
    return (
      <div className="container">
        <form className="login" onSubmit={register}>
          <p>Please enter your name to login</p>
          <div>
            <label>Instructor Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Instructor Name"
              required
            />
            <button type="submit">Log in</button>
          </div>
        </form>
      </div>

    );
  }

  function notification() {
    return (
      <div className="container">
        <div className="button">
          <button onClick={logout}>Logout</button>
        </div>
        <div className="button">
          <button onClick={following}>Add Student to follow</button>
        </div>
        <div ref={containerRef}>
          <p>Professor <strong>{username}</strong>, here are your assignment Notifications:</p>
          <StreamApp apiKey={streamClient.apiKey} token={streamClient.token} appId={streamClient.appId}>
            <div className="stream-app">
              <h5 className="app-title">Assignment Notifications</h5>
            </div>
            <div className="section">
              <div className="header">
                <div className="col">Date</div>
                <div className="col">Number of posted assignments</div>
                <div className="col">Number of students uploading assignments</div>
              </div>
              <FlatFeed
                feedGroup="notification"
                notify
                options={{ limit: 10 }}
                Activity={PostNotification}
              />
            </div>
          </StreamApp>
        </div>
      </div >
    );
  }

  function followPage() {
    return (
      <div className="container">
        <div className="button">
          <button onClick={() => setInstructorState('NOTIFICATION')}>Return to Notifications</button>
        </div>
        <form className="login" onSubmit={follow}>
          <p>Type Student Name to follow</p>
          <div>
            <label>Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Student Name"
              required
            />
            <button type="submit">Follow Student</button>
          </div>
        </form>
        <p><strong>Students that you are following:</strong> {instructorFollowing}.</p>
      </div>
    );
  }

  if (instructorState === "JOIN") {
    return join();
  }

  if (instructorState === "NOTIFICATION") {
    return notification();
  }

  if (instructorState === "FOLLOW") {
    return followPage();
  }
}
export default App;
