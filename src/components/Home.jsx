import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import cctv1Data from '../dataSet/CCTV1.json';
import cctv2Data from '../dataSet/CCTV2.json';
import Aside from "./Aside/Aside.jsx";
import TopController from "./Header/TopController.jsx";
import "./Home.scss";

import CCTVPopup from "./CCTVPopup";

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


// 날씨 정보 가져오기
const fetchWeatherInfo = async (latitude, longitude) => {
  // 현재 날짜와 시간을 가져와서 포맷
  const now = new Date();
  const base_date = now.getFullYear().toString() + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getDate().toString().padStart(2, '0');
  // 현재 시간을 기준으로 두 시간 전으로 설정
  let hours = now.getHours() - 2;
  if (hours < 0) {
      // 만약 자정 전이라면 전날 22시로 설정
      hours = 24 + hours;
  }
  const base_time = hours.toString().padStart(2, '0') + "00";

  const gridCoords = convertNxNy("toXY", latitude, longitude);
  console.log(`baseDate : ${base_date} base_time : ${base_time} 격자 좌표: x=${gridCoords.x}, y=${gridCoords.y}`);

  try {
    const response = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`,
      {
        params: {
          ServiceKey: "xYZ80mMcU8S57mCCY/q8sRsk7o7G8NtnfnK7mVEuVxdtozrl0skuhvNf34epviHrru/jiRQ41FokE9H4lK0Hhg==",
          pageNo: 1,
          numOfRows: 100,
          dataType: "JSON",
          base_date: base_date,
          base_time: base_time,
          nx: gridCoords.x,
          ny: gridCoords.y,
          
        },
      }
    );
    return response.data;
  } catch (error) {
     console.error("날씨 정보를 가져오는 데 실패했습니다:", error);
    return null;
  }
};
//날씨정보
const convertNxNy = (code, v1, v2)=>{
  // /https://gist.github.com/fronteer-kr/14d7f779d52a21ac2f16
  var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)
  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)
  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = re * sf / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
      rs['lat'] = v1;
      rs['lng'] = v2;
      var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
      ra = re * sf / Math.pow(ra, sn);
      var theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  }
  else {
      rs['x'] = v1;
      rs['y'] = v2;
      var xn = v1 - XO;
      var yn = ro - v2 + YO;
      ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) - ra;
      var alat = Math.pow((re * sf / ra), (1.0 / sn));
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      if (Math.abs(xn) <= 0.0) {
          theta = 0.0;
      }
      else {
          if (Math.abs(yn) <= 0.0) {
              theta = Math.PI * 0.5;
              if (xn < 0.0) - theta;
          }
          else theta = Math.atan2(xn, yn);
      }
      var alon = theta / sn + olon;
      rs['lat'] = alat * RADDEG;
      rs['lng'] = alon * RADDEG;
  }
  return rs;

}


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
  const [selectedCCTV, setSelectedCCTV] = useState(null);  // 선택된 CCTV 정보 상태 추가


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

            kakao.maps.event.addListener(marker, 'click', async function () {
             
              const weatherData = await fetchWeatherInfo(item.lat, item.lon);
              setSelectedCCTV({ ...item, weatherData });  // 선택된 CCTV 정보와 날씨 데이터 설정
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
      {selectedCCTV && (
        <CCTVPopup 
          lat={selectedCCTV.lat}
          lon={selectedCCTV.lon}
          hlsAddr={selectedCCTV.hlsAddr}
          weatherData={selectedCCTV.weatherData}
          onClose={() => setSelectedCCTV(null)}  // 팝업 닫기 설정
        />
      )}
      
      <div style={{ padding: "10px" }}>
        <p>현재 중심 좌표: {centerPosition.lat}, {centerPosition.lng}</p>
        <p>현재 주소: {address}</p>
        <p>침수 위험 정보: {floodRiskInfo ? JSON.stringify(floodRiskInfo) : "정보 없음"}</p>
      </div>
    </div>
  );
};

export default Home;
