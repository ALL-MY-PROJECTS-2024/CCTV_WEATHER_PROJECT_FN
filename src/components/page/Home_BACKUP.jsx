import React, { useState, useRef, useEffect } from 'react';

//leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'; // 클릭 이벤트 추가를 위해 useMapEvents import
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import
import L from 'leaflet'; // Leaflet 아이콘을 위해 사용
// react-leaflet-markercluster
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';


//HLS
import HLSPlayer from './HLSPlayer';

//
import Layout from "../layout/Layout";
import "../../styles/Home.scss";

// 마커 크기를 동적으로 계산하는 함수
const getMarkerIconSize = () => {
  const isMobile = window.innerWidth <= 768; // 화면 너비가 768px 이하인 경우를 모바일로 간주
  return isMobile ? { iconSize: [30, 30], shadowSize: [30, 30] } : { iconSize: [40, 40], shadowSize: [50, 50] };
};
// 마커 아이콘 생성 함수
const createMarkerIcon = () => {
  const { iconSize, shadowSize } = getMarkerIconSize();  // 마커와 그림자의 크기를 모두 가져옴
  return new L.Icon({
    iconUrl: 'https://safecity.busan.go.kr/vue/img/gis_picker_cctv_its.9994bd52.png',
    iconSize: iconSize,  // 동적으로 마커 크기 설정
    iconAnchor: [iconSize[0] / 2, iconSize[1]],  // 아이콘의 중심이 앵커에 맞도록 설정
    popupAnchor: [0, -iconSize[1]],  // 팝업이 아이콘 위로 적절하게 뜨도록 설정
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: shadowSize,  // 동적으로 그림자 크기 설정
  });
};


const Home = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    console.log(document.getElementById("iframe_01"))
  }, []);


  return (
    <Layout>
      <iframe id="iframe_01"
        ref={iframeRef}
        src="https://safecity.busan.go.kr/#/"  // iframe의 URL
        style={{ width: '100vw', height: '100vh' }}
        
        title="Iframe Example"
      ></iframe>
    </Layout>
  );
};

export default Home;


/*
npm install leaflet react-leaflet
;
*/