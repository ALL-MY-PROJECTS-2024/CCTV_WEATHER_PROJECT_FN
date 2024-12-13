// Required imports
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import "proj4";
import "proj4leaflet";
import JSON_TEST from '../dataSet/\uCE68\uC218\uC704\uD5D8 \uC218\uCE58\uBAA8\uB378 \uC774\uBBF8\uC9C0 \uB370\uC774\uD130/\uB0B4\uC218/\uB3D9\uB798\uAD6C/030yr_060/Dongnae_030_1_00019.json';

const Test = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map) {
      const mapInstance = L.map('map', {
        center: [35.1795543, 129.0756416],
        zoom: 7,
      });

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
        }
      ).addTo(mapInstance);

      setMap(mapInstance);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      const EPSG5179 = new L.Proj.CRS(
        'EPSG:5179',
        '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
      );

      const coordinates = JSON_TEST.ANNOTATIONS.map(annotation =>
        annotation.COORDINATE.map(([x, y]) => {
          if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            console.warn('Invalid coordinate:', x, y);
            return null;
          }
          try {
            const projected = EPSG5179.projection.unproject(L.point(x, y));
            return [projected.lat, projected.lng]; // Convert to WGS84 (latitude, longitude)
          } catch (error) {
            console.error('Error converting coordinate:', x, y, error);
            return null;
          }
        }).filter(coord => coord !== null) // Remove invalid coordinates
      );

      coordinates.forEach((polygonCoords, index) => {
        if (polygonCoords.length > 0) {
          console.log(`Adding polygon #${index + 1} with coordinates:`, polygonCoords);
          L.polygon(polygonCoords, {
            color: 'red',
            weight: 2,
            fillColor: 'orange',
            fillOpacity: 0.6,
          }).addTo(map);
        } else {
          console.warn(`Empty polygon #${index + 1} skipped.`);
        }
      });
    }
  }, [map]);

  return <div id="map" style={{ width: '100%', height: '100vh' }} />;
};

export default Test;
