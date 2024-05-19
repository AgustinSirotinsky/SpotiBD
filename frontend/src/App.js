import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    console.log('Hash:', hash); // Debugging
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      console.log('Access Token:', token); // Debugging
      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);

    if (token) {
      axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => {
        setTopArtists(response.data.items);
      })
      .catch(error => {
        console.error('Error fetching top artists:', error);
      });
    }
  }, [token]);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  return (
    <div className="App">
      <header className="App-header">
        {!token ?
          <a href="http://localhost:8888/login">Login to Spotify</a> :
          <button onClick={logout}>Logout</button>
        }
        {token && (
          <div>
            <h1>Top Artists</h1>
            <ul>
              {topArtists.map(artist => (
                <li key={artist.id}>{artist.name}</li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
