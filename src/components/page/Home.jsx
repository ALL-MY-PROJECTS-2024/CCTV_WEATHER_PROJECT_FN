import React, { useState, useRef, useEffect } from 'react';

//leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'; // 클릭 이벤트 추가를 위해 useMapEvents import
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import
import L from 'leaflet'; // Leaflet 아이콘을 위해 사용

//HLS
import HLSPlayer from './HLSPlayer';

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
  const position = [35.1796, 129.0756];  // 지도에 표시할 기본 위치 (부산 예시)
  const [markers, setMarkers] = useState([]); // 마커 상태 관리
  // 고정된 CCTV 데이터 저장
  const items = [
    { instlPos: "충무교차로", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_1.stream/playlist.m3u8", lot: 129.024297, lat: 35.096521 },
    { instlPos: "남포동", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_2.stream/playlist.m3u8", lot: 129.029273, lat: 35.097858 },
    { instlPos: "옛시청", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_3.stream/playlist.m3u8", lot: 129.035343, lat: 35.097879 },
    { instlPos: "부산우체국", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_4.stream/playlist.m3u8", lot: 129.036658, lat: 35.103092 },
    { instlPos: "영주사거리", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_5.stream/playlist.m3u8", lot: 129.037914, lat: 35.11186 },
    { instlPos: "부산역", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_6.stream/playlist.m3u8", lot: 129.039353, lat: 35.114967 },
    { instlPos: "초량교차로", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_7.stream/playlist.m3u8", lot: 129.042203, lat: 35.120005 },
    { instlPos: "좌천삼거리", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_8.stream/playlist.m3u8", lot: 129.052554, lat: 35.132734 },
    { instlPos: "자유시장", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_9.stream/playlist.m3u8", lot: 129.059168, lat: 35.141795 },
    { instlPos: "범내골교차로", hlsAddr: "https://its-stream3.busan.go.kr:8443/rtplive/cctv_10.stream/playlist.m3u8", lot: 129.059051, lat: 35.147345 },
    // 필요한 만큼 데이터를 추가
  ];


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
      <div className="aside">
        <div className="top"></div>
        <div className="main"></div>
        <div className="bottom"></div>

      </div>
      <div className="main-section">
        <div className="controller" >
          
        </div>
       
        {/* Leaflet 지도 추가 */}
        <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          
          {/* 고정된 CCTV 데이터를 지도에 마커로 표시 */}
          {items.map((item, idx) => (
            <Marker key={idx} position={[item.lat, item.lot]} icon={markerIcon}>
              <Popup minWidth={300} maxWidth={400}> {/* 팝업 크기 지정 */}
                <div style={{ width: "300px", height: "100%" }}> {/* 팝업 내부 크기 지정 */}
                  <h4>{item.instlPos}</h4>
                  <HLSPlayer hlsUrl={item.hlsAddr} />
                </div>
              </Popup>
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