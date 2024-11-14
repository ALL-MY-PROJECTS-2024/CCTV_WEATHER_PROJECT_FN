import React, { useEffect, useState, useCallback } from 'react';


import axios from 'axios';
import cctv1Data from '../dataSet/CCTV1.json';
import cctv2Data from '../dataSet/CCTV2.json';
import Aside from "./Aside/Aside.jsx";
import TopController from "./Header/TopController.jsx";
import CCTVPopup from "./CCTVPopup";
import "./Home.scss";

//leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,useMap  } from 'react-leaflet'; // 클릭 이벤트 추가를 위해 useMapEvents import
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import
import 'leaflet.markercluster';


import "proj4"
import "proj4leaflet"
import L, { CRS, bounds } from 'leaflet';


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

  const gridCoords = dfs_xy_conv("toXY", latitude, longitude);
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
function dfs_xy_conv(code, v1, v2) {
      //<!--
    //
    // LCC DFS 좌표변환을 위한 기초 자료
    //
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //


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
      if (sn < 0.0) ra = - ra;
      var alat = Math.pow((re * sf / ra), (1.0 / sn));
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      if (Math.abs(xn) <= 0.0) {
          theta = 0.0;
      }
      else {
          if (Math.abs(yn) <= 0.0) {
              theta = Math.PI * 0.5;
              if (xn < 0.0) theta = - theta;
          }
          else theta = Math.atan2(xn, yn);
      }
      var alon = theta / sn + olon;
      rs['lat'] = alat * RADDEG;
      rs['lng'] = alon * RADDEG;
  }
  return rs;
}

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



//------------------------------------------------------------------------
// 마커 클러스터 그룹
//------------------------------------------------------------------------
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




const Home = () => {
  const position = [35.120696, 129.0411816];  // 지도에 표시할 기본 위치 (부산 예시)
  const initialPosition = { lat: 35.1795543, lng: 129.0756416 };
  const [centerPosition, setCenterPosition] = useState(initialPosition);
  const [address, setAddress] = useState(null);
  const [floodRiskInfo, setFloodRiskInfo] = useState(null); 
  
  const [CCTV01State, setCCTV01State] = useState(false);
  const [CCTV02State, setCCTV02State] = useState(false);
  const [clusterCCTV1, setClusterCCTV1] = useState([]);   //재난
  const [clusterCCTV2, setClusterCCTV2] = useState([]);
  const [map, setMap] = useState(null);

  const [selectedCCTV, setSelectedCCTV] = useState(null);  // 선택된 CCTV 정보 상태 추가

  //침수 
  const [fldm_30,setFldm_30] = useState();
  const [fldm_50,setFldm_50] = useState();


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
  const throttledFetchFloodRiskInfo = useCallback(throttle(fetchFloodRiskInfo, 300), []);

  
   //-----------------------------------
   //
   //-----------------------------------
   useEffect(() => {
    
    const fetchCCTVData = async () => {
      console.log("fetchCCTVData invoked...")
      try {
        const response1 = await axios.get("http://54.180.211.164:8080/get/cctv1");
        setClusterCCTV1(response1.data.map(item => ({ ...item, type: 'CCTV1' })));
        
        const response2 = await axios.get("http://54.180.211.164:8080/get/cctv2");
        setClusterCCTV2(response2.data.map(item => ({ ...item, type: 'CCTV2' })));
      } catch (error) {
        console.error('fetchCCTVData error',error);
        setClusterCCTV1(cctv1Data.map(item => ({ ...item, type: 'CCTV1' })));
        setClusterCCTV2(cctv2Data.map(item => ({ ...item, type: 'CCTV2' })));
      }
    };
    fetchCCTVData();

  }, []);
  
  //-----------------------------------
  //-----------------------------------
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

      // 지도 생성
      const mapInstance = L.map('map', {
        center: [initialPosition.lat, initialPosition.lng],
        crs: EPSG5181,
        zoom:9,
      });

      // // Vworld 타일 레이어 추가
      // const tileLayer = L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/C5307FBC-84D9-3817-BBE1-B36D9635CCAF/Base/{z}/{y}/{x}.png', {
      //   attribution: '&copy; <a href="http://map.vworld.kr/">Vworld</a> contributors',
      //   maxZoom: 19,
      //   minZoom: 6,
      // }).addTo(mapInstance);
      // // Kakao Map 타일 레이어 추가

          // Add a base tile layer (OpenStreetMap)
       const tileLayer =L.tileLayer('http://map{s}.daumcdn.net/map_2d/1807hsm/L{z}/{y}/{x}.png', {
        minZoom:6,
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

      // 지도 이동 시 이벤트
      mapInstance.on('moveend', () => {
        const center = mapInstance.getCenter();
        setCenterPosition({ lat: center.lat, lng: center.lng });
        throttledFetchFloodRiskInfo(center.lat, center.lng);
      });

      return () => {
        mapInstance.remove(); // 컴포넌트 언마운트 시 지도 제거
      };
    }, []);
    //-----------------------------------
    // CCTV1 클러스터링
    //-----------------------------------
    useEffect(() => {
      if (map && CCTV01State) {
        const clusterGroup1 = L.markerClusterGroup({
          maxClusterRadius:150, // 클러스터링 반경을 100미터로 설정 (값을 원하는 대로 조정)
          iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            let clusterClass = 'marker-cluster-icon-small'; // 기본 아이콘 클래스

            if (count >= 10 && count < 50) {
              clusterClass = 'marker-cluster-icon-medium';
            } else if (count >= 50) {
              clusterClass = 'marker-cluster-icon-large';
            }

            return new L.DivIcon({
              html: `<div class="custom-cluster-icon ${clusterClass}">${count}</div>`,
              className: 'custom-cluster-icon', // 공통 스타일 클래스
              iconSize: L.point(40, 40), // 기본 크기 설정
            });
          }
        });

        clusterCCTV1.forEach((marker) => {
          L.marker([marker.lat, marker.lon], { icon: createCCTV1MarkerIcon() })
            .on('click', () => setSelectedCCTV(marker))
            .addTo(clusterGroup1);
        });
        map.addLayer(clusterGroup1);

        return () => {
          map.removeLayer(clusterGroup1);
        };
      }
    }, [map, CCTV01State, clusterCCTV1]);

    //-----------------------------------
    // CCTV2 클러스터링
    //-----------------------------------
    useEffect(() => {
      if (map && CCTV02State) {
        const clusterGroup2 = L.markerClusterGroup({
          maxClusterRadius: 150, // 클러스터링 반경을 100미터로 설정 (값을 원하는 대로 조정)
          iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            let clusterClass = 'marker-cluster-icon-small marker-cluster-icon-cctv2'; // CCTV2 아이콘 기본 클래스

            if (count >= 10 && count < 50) {
              clusterClass = 'marker-cluster-icon-medium marker-cluster-icon-cctv2';
            } else if (count >= 50) {
              clusterClass = 'marker-cluster-icon-large marker-cluster-icon-cctv2';
            }

            return new L.DivIcon({
              html: `<div class="custom-cluster-icon ${clusterClass}">${count}</div>`,
              className: 'custom-cluster-icon', // 공통 스타일 클래스
              iconSize: L.point(40, 40), // 기본 크기 설정
            });
          }
        });

        clusterCCTV2.forEach((marker) => {
          L.marker([marker.lat, marker.lon], { icon: createCCTV2MarkerIcon() })
            .on('click', () => setSelectedCCTV(marker))
            .addTo(clusterGroup2);
        });
        map.addLayer(clusterGroup2);

        return () => {
          map.removeLayer(clusterGroup2);
        };
      }
    }, [map, CCTV02State, clusterCCTV2]);




  return (
    <div className="mainSection">
      <Aside />
      <TopController
        CCTV01State={CCTV01State}
        CCTV02State={CCTV02State}
        setCCTV01State={setCCTV01State}
        setCCTV02State={setCCTV02State}
        floodRiskInfo={floodRiskInfo}
        map={map}
      />

      <div id="map" style={{ width: "100%", height: "100vh" }}></div>

      {selectedCCTV && (
        <CCTVPopup
          lat={selectedCCTV.lat}
          lon={selectedCCTV.lon}
          hlsAddr={selectedCCTV.hlsAddr}
          onClose={() => setSelectedCCTV(null)}
        />
      )}
    </div>
  );
};

export default Home;
