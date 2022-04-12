import './App.css';
import React from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const App = () => {
  const [locations, setLocations] = React.useState([]);

  // GET locations from backend to state object at component mount
  React.useEffect(() => {
    (async () => {
        let resp = await axios.get('/locations');
        setLocations(resp.data);
    })();
  }, []);

  // Map locations to leaflet Markers
  let markers = locations.map(loc =>
      <Marker position={[loc.latitude, loc.longitude]}>
        <Popup>
          Id: {loc.id}<br />
          Latitude: {loc.latitude}<br />
          Longitude: {loc.longitude}
        </Popup>
      </Marker>
  );

  return (
    <MapContainer center={[51.505, -0.09]} zoom={2} scrollWheelZoom={false}>
      <TileLayer
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {markers}
    </MapContainer>
  );
}
export default App;
