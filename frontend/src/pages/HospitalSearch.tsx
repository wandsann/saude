import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';

const HospitalSearch: React.FC = () => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
      version: 'weekly',
    });

    loader.load().then(() => {
      const mapInstance = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: -23.5505, lng: -46.6333 },
        zoom: 8,
      });
      setMap(mapInstance);
    });
  }, []);

  const handleSearch = async () => {
    const response = await axios.get('/api/hospitals', { params: { city, state } });
    setHospitals(response.data);

    hospitals.forEach(hospital => {
      new google.maps.Marker({
        position: { lat: hospital.latitude, lng: hospital.longitude },
        map,
        title: hospital.name,
      });
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Hospital Search</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <TextField label="State" value={state} onChange={(e) => setState(e.target.value)} />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
      <List>
        {hospitals.map((hospital) => (
          <ListItem key={hospital.id}>
            <ListItemText primary={hospital.name} secondary={`Wait Time: ${hospital.wait_time} mins`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default HospitalSearch;
