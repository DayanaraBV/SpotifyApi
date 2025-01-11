export const fetchClientToken = async () => { //Conexion con el servidor de API
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });
 
    if (!response.ok) {
      throw new Error('Error fetching access token');
    }
 
    const data = await response.json();
    return data.access_token;
  };
 
  export const searchSpotify = async (query) => {
    const token = await fetchClientToken(); // Obtén el token con tu función existente
  
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album,artist,track`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error('Error fetching Spotify data');
    }
  
    const data = await response.json();
    return data;
  };
  