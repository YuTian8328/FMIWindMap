import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; // or "!mapbox-gl" if using CDN
import 'mapbox-gl/dist/mapbox-gl.css';
import { COORDINATES } from './coordinates';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Map({
  // apiKey,
  initStatus,
  // Component,
  data,
}){
  const [zoom, setZoom] = useState(initStatus.zoom);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { center } = initStatus;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat],
      zoom: zoom
    });

    // Add a separate effect for handling data changes
  }, []); // Empty dependency array for initial setup only

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('marker');
    while(markers.length > 0){
      markers[0].parentNode.removeChild(markers[0]);
    }

    // Add new markers
    data.forEach(item => {
      const coordinates = COORDINATES[item.city];
      if (!coordinates) {
        console.warn(`Coordinates not found for city: ${item.city}`);
        return;
      }
      const { lat, lng } = coordinates;
      console.log("lat, lng", lat, lng);
      
      // Calculate marker size based on value (min 10px, max 50px)
      const markerSize = Math.min(Math.max(item.val * 40, 10), 50);
      
      // Create a custom marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = `${markerSize}px`;
      el.style.height = `${markerSize}px`;
      el.style.backgroundColor = '#C70039';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.fontSize = `${Math.max(markerSize * 0.3, 8)}px`;
      el.style.fontWeight = 'bold';
      
      // Add value text
      const valueText = document.createElement('span');
      valueText.textContent = item.val.toFixed(2);
      el.appendChild(valueText);

      // Create a marker and set it to the coordinates
      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current);
    });
  }, [data]); // This effect will run whenever data changes

  return (
    <div ref={mapContainer} style={{ height: '100vh', width: '100%' }} />
  );
}