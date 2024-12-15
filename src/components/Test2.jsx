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
    // EPSG:5181 좌표계 정의
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

    // 지도 초기화
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
        "EPSG:5179",
        "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"
      );

      // JSON_TEST 데이터에서 폴리곤 좌표 읽기
      const annotations = JSON_TEST.ANNOTATIONS;

      annotations.forEach((annotation) => {
        const rawCoordinates = annotation.COORDINATE;

        // 부산광역시청 기준 오프셋 (EPSG:5179)
        const offsetX = 1145000; // 부산광역시청의 X 좌표 (Easting)
        const offsetY = 1688000; // 부산광역시청의 Y 좌표 (Northing)

        // 오프셋 추가
        const adjustedCoordinates = rawCoordinates.map(([x, y]) => {
          return [x , y ];
        });

        // EPSG:5179 -> EPSG:4326 변환
        const convertedCoordinates = adjustedCoordinates.map(([x, y]) => {
          const [lng, lat] = proj4("EPSG:5179", "EPSG:4326", [x, y]);
          console.log("Converted Coordinates:", [lat, lng]);
          return [lat, lng];
        });

        // 폴리곤 추가
        if (convertedCoordinates.length > 2) {
          L.polygon(convertedCoordinates, {
            color: "blue", // 경계선 색상
            fillColor: "cyan", // 내부 채우기 색상
            fillOpacity: 0.5, // 채우기 불투명도
            weight: 55, // 경계선 두께
          })
            .addTo(map)
            .bindPopup("Polygon Area");
        }
      });
    }
  }, [map]);




  return (
      <div id="map" style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default TEST3;
