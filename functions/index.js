const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: true }));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const GUILD_ID = '1415067179245764630';
const DISCORD_BASE = 'https://discord.com/api';

app.get('/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: ['identify', 'guilds'].join(' '),
  });
  res.redirect(`${DISCORD_BASE}/oauth2/authorize?${params.toString()}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing code');
  }

  try {
    const tokenResponse = await axios.post(
      `${DISCORD_BASE}/oauth2/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get(`${DISCORD_BASE}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const username = userResponse.data.username;

    const guildsResponse = await axios.get(`${DISCORD_BASE}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const isMember = guildsResponse.data.some((g) => g.id === GUILD_ID);

    if (isMember) {
      res.send(`<!DOCTYPE html>
<html>
  <body>
    <script>
      localStorage.setItem('access', 'true');
      localStorage.setItem('username', ${JSON.stringify(username)});
      window.location.href = '/';
    </script>
  </body>
</html>`);
    } else {
      res.send(`<!DOCTYPE html>
<html>
  <body>
    <script>
      localStorage.setItem('access', 'false');
      window.location.href = '/unauthorized.html';
    </script>
  </body>
</html>`);
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

exports.auth = functions.https.onRequest(app);
