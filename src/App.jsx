import  { useState } from 'react';
import {  searchSpotify } from './spotifyService'; 
import './App.css';
function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ albums: [], artists: [], tracks: [] });
  const [filter, setFilter] = useState('all');
  const [playlist, setPlaylist] = useState([]); 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [isOverlayVisible, setOverlayVisible] = useState(false); 

  const handleSearch = async () => {
    try {
      const data = await searchSpotify(query);
      setResults({
        albums: data.albums?.items || [],
        artists: data.artists?.items || [],
        tracks: data.tracks?.items || [],
      });
      setFilter('all'); // Mostrar todo al hacer una nueva búsqueda
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item); 
    setOverlayVisible(true); 
  };

  const closeOverlay = () => {
    setSelectedItem(null); 
    setOverlayVisible(false); 
  };

  const addToPlaylist = (track) => {
    if (!playlist.some((song) => song.id === track.id)) {
      setPlaylist((prevPlaylist) => [...prevPlaylist, track]);
    }
  };

  const handleFilterChange = (type) => {
    setFilter(type); 
  };

  const filteredResults = () => {
    if (filter === 'albums') return results.albums;
    if (filter === 'artists') return results.artists;
    if (filter === 'tracks') return results.tracks;
    return [...results.albums, ...results.artists, ...results.tracks]; 
  };

  return (
    <div className="app">
      <h1>Spotify Search</h1>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for albums, artists, or tracks"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === 'albums' ? 'active' : ''}`}
          onClick={() => handleFilterChange('albums')}
        >
          Albums
        </button>
        <button
          className={`filter-button ${filter === 'artists' ? 'active' : ''}`}
          onClick={() => handleFilterChange('artists')}
        >
          Artists
        </button>
        <button
          className={`filter-button ${filter === 'tracks' ? 'active' : ''}`}
          onClick={() => handleFilterChange('tracks')}
        >
          Tracks
        </button>
      </div>

      <div className="results-container">
        {filteredResults().length > 0 && (
          <div className="results-grid">
            {filteredResults().map((item) => (
              <div
                className="card"
                key={item.id}
                onClick={() => handleCardClick({ ...item, type: filter.slice(0, -1) })}
              >
                <img
                  src={
                    item.images
                      ? item.images[0]?.url // Para álbumes y artistas
                      : item.album?.images[0]?.url // Para tracks
                  }
                  alt={item.name}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 className="card-title">{item.name}</h3>
                  {item.artists && (
                    <p className="card-artist">
                      {item.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  )}
                  {item.type === 'track' && (
                    <button
                      className="add-to-playlist-button"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        addToPlaylist(item);
                      }}
                    >
                      Add to Playlist
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {filteredResults().length === 0 && <p id="mensaje">No results found for this filter.</p>}
      </div>

      {/* Playlist */}
      <div className="playlist-container">
        <h2>Your Playlist</h2>
        {playlist.length === 0 ? (
          <p id="mensaje2">No songs in the playlist yet.</p>
        ) : (
          <ul className="playlist">
            {playlist.map((song) => (
              <li key={song.id} className="playlist-item">
                <img
                  src={song.album.images[0]?.url}
                  alt={song.name}
                  className="playlist-image"
                />
                <div className="playlist-info">
                  <h3>{song.name}</h3>
                  <p>{song.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Overlay */}
      {isOverlayVisible && selectedItem && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-button" onClick={closeOverlay}>
              ✖
            </button>
            <img
              src={
                selectedItem.images
                  ? selectedItem.images[0]?.url // Para álbumes y artistas
                  : selectedItem.album?.images[0]?.url // Para tracks
              }
              alt={selectedItem.name}
              className="overlay-image"
            />
            <h2>{selectedItem.name}</h2>
            {selectedItem.type === 'album' && (
              <>
                <p>Type: Album</p>
                <p>Artists: {selectedItem.artists.map((artist) => artist.name).join(', ')}</p>
                <p>Release Date: {selectedItem.release_date}</p>
              </>
            )}
            {selectedItem.type === 'artist' && (
              <>
                <p>Type: Artist</p>
                <p>Followers: {selectedItem.followers?.total.toLocaleString()}</p>
                <p>Genres: {selectedItem.genres?.join(', ') || 'N/A'}</p>
              </>
            )}
            {selectedItem.type === 'track' && (
              <>
                <p>Type: Track</p>
                <p>Artists: {selectedItem.artists.map((artist) => artist.name).join(', ')}</p>
                <p>Album: {selectedItem.album.name}</p>
                <p>Duration: {(selectedItem.duration_ms / 60000).toFixed(2)} min</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;