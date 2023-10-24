const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { users } = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  const user = users.find((user) => user.id === parseInt(userId));

  if (user) {
    res.send(user);
  } else {
    res.status(404).send('User not found');
  }
});

app.get('/post/:postId', (req, res) => {
  const { postId } = req.params;
  const { posts } = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  const post = posts.find((post) => post.id === parseInt(postId));

  if (post) {
    res.send(post);
  } else {
    res.status(404).send('Post not found');
  }
});

app.get('/posts/:fromDate/:toDate', (req, res) => {
  const { fromDate, toDate } = req.params;
  const { posts } = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.date);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return postDate >= from && postDate <= to;
  });

  res.send(filteredPosts);
});

app.post('/user/:userId/email', (req, res) => {
  const { userId } = req.params;
  const { users } = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const { email } = req.body;

  const userIndex = users.findIndex((user) => user.id === parseInt(userId));

  if (userIndex !== -1) {
    users[userIndex].email = email;
    fs.writeFileSync('data.json', JSON.stringify({users, posts}));
    res.send('Email updated');
  } else {
    res.status(404).send('User not found');
  }
});

app.put('/user/:userId/post', (req, res) => {
  const { userId } = req.params;
  const { users, posts } = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const { title, body } = req.body;

  const userIndex = users.findIndex((user) => user.id === parseInt(userId));

  if (userIndex !== -1) {
    const newPost = {
      id: posts.length + 1,
      userId: parseInt(userId),
      title,
      body,
      date: new Date().toISOString(),
      last_update: new Date().toISOString(),
    };
    posts.push(newPost);
    fs.writeFileSync('data.json', JSON.stringify({users, posts}));
    res.send('Post created');
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
