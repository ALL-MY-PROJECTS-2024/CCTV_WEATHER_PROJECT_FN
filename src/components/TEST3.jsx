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
import proj4 from 'proj4';
import "proj4"
import "proj4leaflet"
import L, { CRS, bounds } from 'leaflet';
import JSON_TEST from '../dataSet/침수위험 수치모델 이미지 데이터/내수/동래구/030yr_060/Dongnae_030_1_00019.json';


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
        bounds: L.bounds(
          [-30000 - Math.pow(2, 19) * 4, -60000],
          [-30000 + Math.pow(2, 19) * 5, -60000 + Math.pow(2, 19) * 5]
        ),
      }
    );

    // 지도 생성
    const mapInstance = L.map('map', {
      center: [35.1795543, 129.0756416], // 중심 좌표
      crs: EPSG5181, // EPSG:5181 좌표계 사용
      zoom: 9,
    });

    // 타일 레이어 추가
    L.tileLayer('http://map{s}.daumcdn.net/map_2d/1807hsm/L{z}/{y}/{x}.png', {
      minZoom: 1,
      maxZoom: 13,
      zoomReverse: true,
      zoomOffset: 1,
      subdomains: '0123',
      continuousWorld: true,
      tms: true,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove(); // 컴포넌트 언마운트 시 지도 제거
    };
  }, []);


  useEffect(() => {
    if (map) {
      // EPSG:5179 정의
      proj4.defs(
        'EPSG:5179',
        '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
      );
  
      // EPSG:5181 정의
      proj4.defs(
        'EPSG:5181',
        '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs'
      );
  
      // JSON 데이터의 좌표 변환 및 폴리곤 추가
      JSON_TEST.ANNOTATIONS.forEach((annotation, index) => {
        const coordinates = annotation.COORDINATE.map(([x, y]) => {
          try {
            // EPSG:5179 → EPSG:5181 좌표 변환
            const [newX, newY] = proj4('EPSG:5179', 'EPSG:5181', [x, y]);
            console.log(`EPSG:5179 → EPSG:5181 (annotation #${index}):`, x, y, '->', newX, newY);
  
            // EPSG:5181 → WGS84 좌표 변환
            const point = map.options.crs.projection.unproject(L.point(newX, newY));
  
            // WGS84 좌표 범위 검증
            if (
              point.lat >= -90 && point.lat <= 90 &&
              point.lng >= -180 && point.lng <= 180
            ) {
              console.log(`Valid WGS84 (annotation #${index}):`, point.lat, point.lng);
              return [point.lat, point.lng];
            } else {
              console.warn(`Invalid WGS84 (annotation #${index}):`, point.lat, point.lng);
              return null;
            }
          } catch (error) {
            console.error('Coordinate transformation error:', x, y, error);
            return null;
          }
        }).filter(Boolean); // 잘못된 좌표 제거
  
        if (coordinates.length > 0) {
          // 지도에 폴리곤 추가
          L.polygon(coordinates, {
            color: 'red',
            weight: 2,
            fillColor: 'orange',
            fillOpacity: 0.5,
          }).addTo(map);
        } else {
          console.warn(`Empty polygon coordinates (annotation #${index}):`, annotation);
        }
      });
    }
  }, [map]);
  
  
  

  return (
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default TEST3;
