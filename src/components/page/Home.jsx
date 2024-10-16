import React, { useState } from 'react';

//leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'; // 클릭 이벤트 추가를 위해 useMapEvents import
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import
import L from 'leaflet'; // Leaflet 아이콘을 위해 사용

//
import Layout from "../layout/Layout";
import "../../styles/Home.scss";


// 기본 아이콘 설정 (Leaflet 기본 마커 아이콘 대신 커스텀 아이콘 사용 가능)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});


const Home = () => {
  const position = [35.1796, 129.0756]; // 지도에 표시할 기본 위치 (부산 예시)
  const [markers, setMarkers] = useState([]); // 마커 상태 관리
  // 지도에서 클릭한 위치에 마커 추가하는 이벤트
  const MapClickHandler = () => {
      useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setMarkers([...markers, { lat, lng }]); // 클릭한 위치에 마커 추가
        }
      });
      return null;
    };

  return (
    <Layout>
      <div className="aside"></div>
      <div className="main-section">
       
       
        {/* Leaflet 지도 추가 */}
        <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* MapClickHandler 추가: 클릭할 때 마커 추가 */}
          <MapClickHandler />
          {/* 기존 마커들 표시 */}
          {markers.map((marker, idx) => (
            <Marker key={idx} position={[marker.lat, marker.lng]} icon={markerIcon}>
              <Popup>여기에 마커를 추가했습니다! <br /> 위치: {marker.lat}, {marker.lng}</Popup>
            </Marker>
          ))}          
        </MapContainer>
        
      </div>
    </Layout>
  );
};

export default Home;


/*
npm install leaflet react-leaflet
;
*/