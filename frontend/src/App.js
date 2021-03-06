import './App.css';
import React from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
const path = '/locations';

const App = () => {
    const [locations, setLocations] = React.useState([]);

    // GET locations from backend to state array at component mount
    React.useEffect(() => {
        (async () => {
            let resp = await axios.get(path);
            setLocations(resp.data);
        })();
    }, []);

    // POST to backend and add new location to state array
    const post = async (loc) => {
        let resp = await axios.post(path, {
            latitude: loc.lat,
            longitude: loc.lng,
        });
        setLocations((prevState) => [...prevState, resp.data]);
    };

    // Map locations to leaflet Markers
    let markers = locations.map((loc) => (
        <Marker position={[loc.latitude, loc.longitude]}>
            <Popup>
                Id: {loc.id}
                <br />
                Latitude: {loc.latitude}
                <br />
                Longitude: {loc.longitude}
            </Popup>
        </Marker>
    ));

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={2}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            whenCreated={(map) => {
                map.on('dblclick', (e) => post(e.latlng));
            }}
        >
            <TileLayer
                attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
        </MapContainer>
    );
};
export default App;
