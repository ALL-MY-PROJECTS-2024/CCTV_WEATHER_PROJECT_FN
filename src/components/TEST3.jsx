import React, { useEffect, useState, useCallback } from 'react';


import axios from 'axios';
import cctv1Data from '../dataSet/CCTV1.json';
import cctv2Data from '../dataSet/CCTV2.json';
import floodingData from '../dataSet/FLOODING.json';

import Aside from "./Aside/Aside.jsx";
import TopController from "./Header/TopController.jsx";
import CCTVPopup from "./CCTVPopup";
import FloodingPopup from "./FloodingPopup";

import "./Home.scss";

//leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,useMap  } from 'react-leaflet'; // 클릭 이벤트 추가를 위해 useMapEvents import
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import
import 'leaflet.markercluster';


import "proj4"
import "proj4leaflet"
import L, { CRS, bounds } from 'leaflet';



const TEST3 = () => {
  
  const [map, setMap] = useState(null);

  const [centerPosition, setCenterPosition] = useState({ lat: 35.1795543, lng: 129.0756416 });
  

    useEffect(() => {
      // 좌표계 정의
      const EPSG5181 = new L.Proj.CRS(
        'EPSG:5181',
        '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        {
          resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
          origin: [-30000, -60000],
          bounds: L.bounds([-30000-Math.pow(2,19)*4, -60000], [-30000+Math.pow(2,19)*5, -60000+Math.pow(2,19)*5])
        }          
       );

   
            const mapInstance = L.map('map', {
              center: [35.1795543, 129.0756416],
              crs: EPSG5181,
              zoom:9,
            });


      // Add a base tile layer (OpenStreetMap)
       const tileLayer =L.tileLayer('http://map{s}.daumcdn.net/map_2d/1807hsm/L{z}/{y}/{x}.png', {
        minZoom:1,
        maxZoom:13,
        zoomReverse:true,
        zoomOffset:1,
        subdomains:'0123',
        continuousWorld:true,
        tms:true,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);


      // Map 객체를 상태로 저장
      setMap(mapInstance);


      return () => {
        mapInstance.remove(); // 컴포넌트 언마운트 시 지도 제거
      };
    }, []);

  return (
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default TEST3;
