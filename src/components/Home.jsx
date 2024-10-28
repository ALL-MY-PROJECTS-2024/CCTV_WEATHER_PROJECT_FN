import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import cctv1Data from '../dataSet/CCTV1.json';
import cctv2Data from '../dataSet/CCTV2.json';
import Aside from "./Aside/Aside.jsx";
import TopController from "./Header/TopController.jsx";
import "./Home.scss";

// Throttle function to limit the frequency of calls
const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  };
};

const Home = () => {
  const initialPosition = { lat: 35.120696, lng: 129.0411816 };
  const [centerPosition, setCenterPosition] = useState(initialPosition);
  const [address, setAddress] = useState(null);
  const [floodRiskInfo, setFloodRiskInfo] = useState(null); 
  
  const [CCTV01State, setCCTV01State] = useState(false);
  const [CCTV02State, setCCTV02State] = useState(false);
  const [clusterCCTV1, setClusterCCTV1] = useState([]);
  const [clusterCCTV2, setClusterCCTV2] = useState([]);
  const [map, setMap] = useState(null);
  const [clusterer1, setClusterer1] = useState(null);
  const [clusterer2, setClusterer2] = useState(null);

  // Fetch flood risk info
  const fetchFloodRiskInfo = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://safecity.busan.go.kr/iots/base/gisAlarm.do?latitude=${latitude}&longitude=${longitude}`);
      setFloodRiskInfo(response.data);
      console.log("Flood Risk Info:", response.data);
    } catch (error) {
      console.error("Failed to fetch flood risk info:", error);
      setFloodRiskInfo({ Dong: "서비스 지역을 벗어났습니다." ,info:""});


    }
  };

  // Throttled version of fetchFloodRiskInfo
  const throttledFetchFloodRiskInfo = useCallback(throttle(fetchFloodRiskInfo, 300), []);

  useEffect(() => {
    // Initial fetch for the initial coordinates
    fetchFloodRiskInfo(initialPosition.lat, initialPosition.lng);

    kakao.maps.load(() => {
      const mapContainer = document.getElementById('map');
      const kakaoMap = new kakao.maps.Map(mapContainer, {
        center: new kakao.maps.LatLng(initialPosition.lat, initialPosition.lng),
        level: 6,
      });

      kakao.maps.event.addListener(kakaoMap, 'center_changed', () => {
        const center = kakaoMap.getCenter();
        const newCenter = { lat: center.getLat(), lng: center.getLng() };
        setCenterPosition(newCenter);

        // Throttled call to fetch flood risk info for new center
        throttledFetchFloodRiskInfo(newCenter.lat, newCenter.lng);
      });

      const cctv1Clusterer = new kakao.maps.MarkerClusterer({
        map: kakaoMap,
        averageCenter: false,
        minLevel: 5,
        gridSize: 100,
        disableClickZoom: true,
        styles: [
          { width: '40px', height: '40px', background: 'rgba(144, 43, 34, 0.7)', color: 'white', borderRadius: '20px', textAlign: 'center', lineHeight: '40px' }
        ],
        animate: true,  // 추가된 애니메이션 옵션
    });
    
    const cctv2Clusterer = new kakao.maps.MarkerClusterer({
        map: kakaoMap,
        averageCenter: false,
        minLevel: 5,
        gridSize: 100,
        disableClickZoom: true,
        styles: [
          { width: '40px', height: '40px', background: 'rgba(65, 105, 225, 0.7)', color: 'white', borderRadius: '20px', textAlign: 'center', lineHeight: '40px' }
        ],
        animate: true,  // 추가된 애니메이션 옵션
    });
    

      const handleClusterClick = (cluster) => {
        const bounds = cluster.getBounds();
        kakaoMap.setBounds(bounds);
      };

      kakao.maps.event.addListener(cctv1Clusterer, 'clusterclick', handleClusterClick);
      kakao.maps.event.addListener(cctv2Clusterer, 'clusterclick', handleClusterClick);

      setMap(kakaoMap);
      setClusterer1(cctv1Clusterer);
      setClusterer2(cctv2Clusterer);
    });
  }, []); 

  //
  useEffect(() => {
    const fetchCCTVData = async () => {
      try {
        const response1 = await axios.get("http://localhost:8080/get/cctv1");
        setClusterCCTV1(response1.data.map(item => ({ ...item, type: 'CCTV1' })));
        
        const response2 = await axios.get("http://localhost:8080/get/cctv2");
        setClusterCCTV2(response2.data.map(item => ({ ...item, type: 'CCTV2' })));
      } catch (error) {
        console.error(error);
        setClusterCCTV1(cctv1Data.map(item => ({ ...item, type: 'CCTV1' })));
        setClusterCCTV2(cctv2Data.map(item => ({ ...item, type: 'CCTV2' })));
      }
    };
    fetchCCTVData();
  }, []);

  // 클러스터 수정 
  useEffect(() => {
    const updateClusters = () => {
      if (map && clusterer1 && clusterer2) {
        const addMarkers = (data, markerIconUrl, clusterer) => {
          const markers = data.map(item => {
            const markerPosition = new kakao.maps.LatLng(item.lat, item.lon);
            const marker = new kakao.maps.Marker({
              position: markerPosition,
              image: new kakao.maps.MarkerImage(markerIconUrl, new kakao.maps.Size(40, 40)),
              clickable: true,
            });

            kakao.maps.event.addListener(marker, 'click', function () {
              const newWindow = window.open('', '_blank', 'width=1200,height=800');
              // HTML 내용 구성
              const content = `
              <html>
                <head>
                  <style>
                    body {
                      font-family: Pretendard, Arial, sans-serif;
                      background-color: #f4f6f9;
                      margin: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      height: 100vh;
                      overflow: hidden;
                    }
                    .card {
                      width: 98vw;
                      margin: 0 auto;
                      height: 100%;
                      background: #fff;
                      border-radius: 8px;
                      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                      padding: 20px;
                    }
                    .header {
                      font-size: 1.5rem;
                      font-weight: bold;
                      margin-bottom: 15px;
                      color: #333;
                    }
                    .info {
                      font-size: 1rem;
                      line-height: 1.6;
                      color: #555;
                    }
                    .iframe-container {
                      margin-top: 20px;
                      border: none;
                      width: 100%;
                      height: calc(100% - 200px);
                    }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="header">CCTV 실시간 보기</div>
                    <div class="info">위치: ${item.location}</div>
                    <div class="info">설명: ${item.description || '정보 없음'}</div>
                    <div class="iframe-container">
                      <iframe src="${item.hlsAddr}" width="100%" height="100%" allow="autoplay; fullscreen" allowFullScreen></iframe>
                    </div>
                  </div>
                </body>
              </html>
            `;

            newWindow.document.write(content);
            newWindow.document.close();  // 문서 닫아 렌더링 강제
           
           
           
            });

            return marker;
          });

          clusterer.addMarkers(markers);
        };

        clusterer1.clear();
        clusterer2.clear();

        if (CCTV01State) addMarkers(clusterCCTV1, 'https://safecity.busan.go.kr/vue/img/gis_picker_cctv_city.a17cfe5e.png', clusterer1);
        if (CCTV02State) addMarkers(clusterCCTV2, 'https://safecity.busan.go.kr/vue/img/gis_picker_cctv_its.9994bd52.png', clusterer2);
      }
    };

    updateClusters();
  }, [CCTV01State, CCTV02State, map, clusterer1, clusterer2, clusterCCTV1, clusterCCTV2]);

  return (
    <div className="mainSection">
      <Aside />
      <TopController
        CCTV01State={CCTV01State}
        CCTV02State={CCTV02State}
        setCCTV01State={setCCTV01State}
        setCCTV02State={setCCTV02State}
        floodRiskInfo={floodRiskInfo}  // Pass flood risk info to TopController
      />
      <div id="map" style={{ }}></div>
      <div style={{ padding: "10px" }}>
        <p>현재 중심 좌표: {centerPosition.lat}, {centerPosition.lng}</p>
        <p>현재 주소: {address}</p>
        <p>침수 위험 정보: {floodRiskInfo ? JSON.stringify(floodRiskInfo) : "정보 없음"}</p>
      </div>
    </div>
  );
};

export default Home;
