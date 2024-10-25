
import Aside from "./Aside.jsx"
import React, { useState, useRef, useEffect } from 'react';

//TopController
import TopController from "./TopController.jsx";

//HLS
import HLSPlayer from './HLSPlayer';

//
import Layout from "../layout/Layout";
import "../../styles/Home.scss";

import axios from 'axios';

//leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,useMap  } from 'react-leaflet'; // 클릭 이벤트 추가를 위해 useMapEvents import
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import
import L from 'leaflet'; // Leaflet 아이콘을 위해 사용

//
import 'leaflet.markercluster';

// 마커 크기를 동적으로 계산하는 함수
const getMarkerIconSize = () => {
  const isMobile = window.innerWidth <= 768; // 화면 너비가 768px 이하인 경우를 모바일로 간주
  return isMobile ? { iconSize: [30, 30], shadowSize: [30, 30] } : { iconSize: [40, 40], shadowSize: [50, 50] };
};
// 마커 아이콘 생성 함수
const createCCTV1MarkerIcon = () => {
  const { iconSize, shadowSize } = getMarkerIconSize();  // 마커와 그림자의 크기를 모두 가져옴
  return new L.Icon({
    iconUrl: 'https://safecity.busan.go.kr/vue/img/gis_picker_cctv_city.a17cfe5e.png',
    iconSize: iconSize,  // 동적으로 마커 크기 설정
    iconAnchor: [iconSize[0] / 2, iconSize[1]],  // 아이콘의 중심이 앵커에 맞도록 설정
    popupAnchor: [0, -iconSize[1]],  // 팝업이 아이콘 위로 적절하게 뜨도록 설정
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: shadowSize,  // 동적으로 그림자 크기 설정
  });
};
// 마커 아이콘 생성 함수
const createCCTV2MarkerIcon = () => {
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


const MarkerClusterGroup = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    const markersCluster = L.markerClusterGroup({
      showCoverageOnHover: false, // 마커가 모여 있는 범위 표시
      spiderfyOnMaxZoom: true,    // 최대 줌 시 마커 펼치기
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount(); // 클러스터 안에 있는 마커 개수
        return new L.DivIcon({
          html: `<div style="background-color: rgba(0, 123, 255, 0.8); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40),
        });
      }
    });

    // 클러스터 클릭 시 중앙으로 설정하고 마커 확산
    markersCluster.on('clusterclick', (e) => {
      const clusterLatLng = e.latlng;
      map.setView(clusterLatLng, map.getZoom(), { animate: true }); // 클러스터 위치로 중앙 설정
      e.layer.spiderfy(); // 클러스터 내부 마커를 펼침
    });

    // 마커 추가
    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lon], {
        icon: marker.type === 'CCTV1' ? createCCTV1MarkerIcon() : createCCTV2MarkerIcon()
      }).on('click', () => {
        window.open(marker.hlsAddr, '_blank', 'noopener,noreferrer,width=900,height=600');
      });
      markersCluster.addLayer(leafletMarker);
    });

    map.addLayer(markersCluster);

    return () => {
      map.removeLayer(markersCluster);
    };
  }, [markers, map]);

  return null;
};


const Home = () => {
  

  const position = [35.120696, 129.0411816];  // 지도에 표시할 기본 위치 (부산 예시)
  const [markers, setMarkers] = useState([]); // 마커 상태 관리
  const [CCTV01State,setCCTV01State] = useState(false);
  const [CCTV02State,setCCTV02State] = useState(false);
  
  const [CCTV01Items,setCCTV01Items] = useState([]);
  const [CCTV02Items,setCCTV02Items] = useState([]);



  useEffect(()=>{

   const reqCCTV =  async ()=>{
      try{
        const response = await axios.get("http://localhost:8080/get/cctv1");
        console.log(response);
        setCCTV01Items(response.data);
        
        const response2 = await axios.get("http://localhost:8080/get/cctv2");
        console.log(response2);
        setCCTV02Items(response2.data);

      }catch(e){
        console.log(e);
      }     
   }
   reqCCTV();


  },[CCTV01State,CCTV02State])

  
  const allMarkers = [
    ...CCTV01Items.map(item => ({ ...item, type: 'CCTV1' })),
    ...CCTV02Items.map(item => ({ ...item, type: 'CCTV2' }))
  ];
  // 지도에서 클릭한 위치에 마커 추가하는 이벤트
  const MapClickHandler = ({ markers }) => {
     
    useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setMarkers([...markers, { lat, lng }]); // 클릭한 위치에 마커 추가
        }
      });
      return null;
  };
  //------------------------------------------
  return (
    <Layout>

      <div className="main-section">
        
        {/* ASIDE */}
        <Aside />

        {/* TOP CONTROLLER */}
        <TopController  
          CCTV01State={CCTV01State} 
          CCTV02State={CCTV02State} 
          setCCTV01State={setCCTV01State}  
          setCCTV02State={setCCTV02State} 
        />


        {/* Leaflet 지도 추가 */}
        <MapContainer center={position} zoom={14} style={{ height: "100vh", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            
          />

        
      
          {/* 고정된 CCTV 데이터를 지도에 마커로 표시 */}
          {CCTV01State && CCTV01Items.map((item, idx) => (
            <Marker
              key={idx}
              position={[item.lat, item.lon]}
              icon={createCCTV1MarkerIcon()}
              eventHandlers={{
                click: () => {
                  // 마커 클릭 시 새 창 열기
                  window.open(item.hlsAddr, '_blank', 'noopener,noreferrer,width=900,height=600');
                }
              }}
            >
              {/* 팝업이 아닌, 새 창을 여는 방식으로 처리하므로 Popup 태그는 제거했습니다. */}
            </Marker>
          ))}      
          
           {/* 고정된 CCTV 데이터를 지도에 마커로 표시 */}
           {CCTV02State && CCTV02Items.map((item, idx) => (
            <Marker
              key={idx}
              position={[item.lat, item.lon]}
              icon={createCCTV2MarkerIcon()}
              eventHandlers={{
                click: () => {
                  // 마커 클릭 시 새 창 열기
                  window.open(item.hlsAddr, '_blank', 'noopener,noreferrer,width=900,height=600');
                }
              }}
            >
              {/* 팝업이 아닌, 새 창을 여는 방식으로 처리하므로 Popup 태그는 제거했습니다. */}
            </Marker>
          ))}      
      

          <MarkerClusterGroup markers={allMarkers} />

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