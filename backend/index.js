const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read';
  const authUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
    });
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  try {
    const response = await axios.post(tokenUrl, querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
    }), {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const { access_token, refresh_token } = response.data;
    res.redirect(`http://localhost:3000?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    res.send(error);
  }
});

app.listen(8888, () => {
  console.log('Server running on port 8888');
});
