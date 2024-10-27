//[임시] JSON 파일을 `import`로 가져오기
import cctv1Data from '../../dataSet/CCTV1.json'
import cctv2Data from '../../dataSet/CCTV2.json'


import Aside from "./Aside.jsx"
import React, { useState, useRef, useEffect } from 'react';

//TopController
import TopController from "./TopController.jsx";

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


//-----------------
// MarkerClusterGroup 컴포넌트
const MarkerClusterGroup = ({ markers, type }) => {
  const map = useMap();

  useEffect(() => {
    const markersCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount(); // 클러스터 내 마커 개수
        let clusterClass = 'custom-cluster-icon-small'; // 기본 클러스터 아이콘 클래스
        const backgroundColor = type === 'CCTV1' ? 'rgba(144, 43, 34, 0.7)' : 'rgba(65, 105, 225, .7)'; // CCTV1은 빨강, CCTV2는 파랑

        if (count >= 10 && count < 50) {
          clusterClass = 'custom-cluster-icon-medium';
        } else if (count >= 50) {
          clusterClass = 'custom-cluster-icon-large';
        }

        return new L.DivIcon({
          html: `<div class="${clusterClass}" style="background-color: ${backgroundColor}">${count}</div>`,
          className: 'custom-cluster-icon', // 공통 트랜지션 클래스
          iconSize: L.point(40, 40),
        });
      }
    });

    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lon], {
        icon: marker.type === 'CCTV1' ? createCCTV1MarkerIcon() : createCCTV2MarkerIcon()
      }).on('click', () => {
        window.open(marker.hlsAddr, '_blank', 'noopener,noreferrer,width=1200px,height=800px');
      });
      markersCluster.addLayer(leafletMarker);
    });

    map.addLayer(markersCluster);

    return () => {
      map.removeLayer(markersCluster);
    };
  }, [markers, map, type]);

  return null;
};


//----------------------------------


//----------------------------------
const Home = () => {
  const position = [35.120696, 129.0411816];  // 지도에 표시할 기본 위치 (부산 예시)
  const [CCTV01State,setCCTV01State] = useState(false);
  const [CCTV02State,setCCTV02State] = useState(false);
  const [CCTV01Items,setCCTV01Items] = useState([]);
  const [CCTV02Items,setCCTV02Items] = useState([]);
  const [clusterCCTV1,setClusterCCTV1] = useState([]);
  const [clusterCCTV2,setClusterCCTV2] = useState([]);




  
  useEffect(()=>{

   const reqCCTV =  async ()=>{
      try{
        const response = await axios.get("http://localhost:8080/get/cctv1");
        console.log(response);
        setClusterCCTV1([...response.data.map(item => ({ ...item, type: 'CCTV1' })),]);
        
        const response2 = await axios.get("http://localhost:8080/get/cctv2");
        console.log(response2);
        setClusterCCTV2([...response2.data.map(item => ({ ...item, type: 'CCTV2' })),]);

      }catch(e){
        console.log(e);
        //axios 연결 실패시 있던거에 연결
        setClusterCCTV1(cctv1Data.map(item => ({ ...item, type: 'CCTV1' })));
        setClusterCCTV2(cctv2Data.map(item => ({ ...item, type: 'CCTV2' })));

      }     
   }
   reqCCTV();


   

  },[])

  
  


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
          
          {/* 클러스터형 마커 추가 */}
          {CCTV01State && <MarkerClusterGroup markers={clusterCCTV1} type="CCTV1" />}
          {CCTV02State && <MarkerClusterGroup markers={clusterCCTV2} type="CCTV2" />}
       
       
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