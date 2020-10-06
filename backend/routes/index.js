const express = require('express');
const router = express.Router();
const stream = require('getstream');
const axios = require('axios');
const Parser = require('rss-parser');
const { response } = require('express');
require('dotenv').config();
const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const appId = process.env.STREAM_APP_ID;
const client = stream.connect(streamApiKey, streamApiSecret);

router.post('/registration', async (req, res) => {
  try {
    const username = req.body.username.replace(/\s/g, '_').toLowerCase();

    const userToken = client.createUserToken(username);

    await client.user(username).getOrCreate({
      api_key: streamApiKey,
      name: username,
    });

    res.status(200).json({
      userToken,
      streamApiKey,
      username,
      appId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/follow', async (req, res) => {
  try {
    const username = req.body.username.replace(/\s/g, '_').toLowerCase();
    const student = req.body.student.replace(/\s/g, '_').toLowerCase();

    const notificationFeed = client.feed('notification', username);
    await notificationFeed.follow('assignment', student);

    res.status(200).json({});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})

router.get('/following', async (req, res) => {
  try {
    console.log(req.query.username);
    const username = req.query.username.replace(/\s/g, '_').toLowerCase();
    const notificationFeed = client.feed('notification', username);

    let response = await notificationFeed.following();
    let following = response.results.map((result) => result.target_id.replace('assignment:', '')).sort().join(", ");

    res.status(200).json(following);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})

router.post('/assignment', async (req, res) => {
  try {
    const username = req.body.username.replace(/\s/g, '_').toLowerCase();
    const instructor = req.body.instructor.replace(/\s/g, '_').toLowerCase();
    const assignmentFeed = await client.feed('assignment', username);
    const verb = 'assignment';
    const object = 'student assignment';

    await assignmentFeed.addActivity({
      'actor': req.body.username,
      'verb': verb,
      'class': req.body.class,
      'title': req.body.title,
      'class': req.body.class,
      'instructor': req.body.instructor,
      'object': object
    });

    res.status(200).send();

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
