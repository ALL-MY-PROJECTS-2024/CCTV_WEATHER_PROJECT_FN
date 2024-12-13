import React, { useEffect, useState, useCallback } from 'react';
import { union } from "@turf/turf"; // 기본 내보내기가 아닌 union 모듈만 임포트
import * as turf from "@turf/turf";


// COMPONENT
import FloodingPopupTEST from "./FloodingPopupTEST";
import ShowMap from "./ShowMap"

//Dataset
import busanGeoJson from '../dataSet/busan.json';
import floodingData from '../dataSet/FLOODING.json';




//test
import JSON_TEST from '../dataSet/침수위험 수치모델 이미지 데이터/내수/동래구/030yr_060/Dongnae_030_1_00019.json'

import "./Test.scss";

//leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,useMap  } from 'react-leaflet'; // 클릭 이벤트 추가를 위해 useMapEvents import
import 'leaflet/dist/leaflet.css'; // Leaflet CSS import
import 'leaflet.markercluster';


import "proj4"
import "proj4leaflet"
import L, { CRS, bounds } from 'leaflet';

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



// FLOODING ICON
const createFLOODINGMarkerIcon = () => {
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




const Test  = ()=>{
    const [centerPosition, setCenterPosition] = useState({ lat: 35.1795543, lng: 129.0756416 });
    const [map, setMap] = useState(null);
     //
    const [sig_layerState,setSig_layerState] = useState(false);
    const [sig_layer, setSig_layer] = useState(null)  
    //
    const [도시지역 , set도시지역] = useState(["북구", "중구", "동래구", "사상구"])

    //침수 
    const [floodingState, setFloodingState] = useState(true);
    const [clusterFLOODING, setClusterFLOODING] = useState([]);
    const [selectedFLOODING, setSelectedFLOODING] = useState(null);  // 선택된 CCTV 정보 상태 추가

    //침수 이미지 오버레이
    const [floodingImgState,setFloodingImgState] = useState(false);
   
    //지도
    const [selectedShowMap, setSelectedShowMap] = useState(null)

    //----------------------------
    //
    //----------------------------
    useEffect(() => {

        if(map==undefined){
            // 지도 생성
            const newCenter = { 
              lat: centerPosition.lat + 0.017, // 1km 아래로 이동
              lng: centerPosition.lng
            };

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

                        
            const mapInstance = L.map('map', {
              center: [newCenter.lat, newCenter.lng],
              crs: EPSG5181,
              zoom:5,
              worldCopyJump: false,

            });

            // Add a base tile layer (OpenStreetMap)
            const tileLayer =L.tileLayer('http://map{s}.daumcdn.net/map_2d/1807hsm/L{z}/{y}/{x}.png', {
              minZoom:1,
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
              
          
      
            // Map 객체를 상태로 저장
            setMap(mapInstance);

            // 지도 이동 시 이벤트
            mapInstance.on('moveend', () => {
            const center = mapInstance.getCenter();
            setCenterPosition({ lat: center.lat, lng: center.lng });
            
            });

        }

      }, []);

   //-----------------------------------
   //
   //-----------------------------------
   useEffect(() => {
    
    const fetchCCTVData = async () => {
      console.log("fetchCCTVData invoked...")
      try {
        setClusterFLOODING(floodingData.map(item => ({ ...item, type: 'FLOODING' })));
      } catch (error) {
       
      }
    };
    fetchCCTVData();

  }, []);


   //-----------------------------------
    // FLODDING 클러스터링
    //-----------------------------------
    useEffect(() => {
      if (map && floodingState) {
        const clusterGroup3 = L.markerClusterGroup({
          maxClusterRadius: 100, // 클러스터링 반경을 100미터로 설정 (값을 원하는 대로 조정)
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

        clusterFLOODING.forEach((marker) => {
          L.marker([marker.lat, marker.lon], { icon: createFLOODINGMarkerIcon() })
            .on('click', () => setSelectedFLOODING(marker))
            .addTo(clusterGroup3);
        });
        map.addLayer(clusterGroup3);

        return () => {
          map.removeLayer(clusterGroup3);
        };
      }
    }, [map, floodingState, clusterFLOODING]);



    //----------------------------
    //
    //----------------------------
    useEffect(()=>{
        if (map) {
            //---------------------------
            //법정동 표시용 
            //---------------------------
            // const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
            //     layers: 'iots:sig_layer',
            //     format: 'image/png',
            //     transparent: true,
            //     version: '1.1.1',
            //     attribution: '&copy; Safe City Busan GeoServer',
            //     styles: '',
            //     zIndex: 500,
            //   });
          
            //   wmsLayer.addTo(map);
              
            //   setSig_layer(wmsLayer);




            // GeoJSON 레이어 추가(클릭- 이벤트처리용)
            const geojsonLayer = L.geoJSON(busanGeoJson , {
                style: function (feature) {
                        const districtName = feature.properties.adm_nm; // 법정동명
                        let isHighlighted = false
                        
                        for (const index in 도시지역) {
                          isHighlighted = districtName.includes(도시지역[index])
                          if(isHighlighted)
                            break
                        }
                        
                        //console.log(districtName,isHighlighted);
                        
                        if(isHighlighted){
                          return {
                            color: 'gray',
                            fillColor: "royalblue" ,
                            fillOpacity: 0.2,
                            weight: 1,
                          };
                        }else{
                          return {
                            color: '',
                            fillColor: '' ,
                            fillOpacity: 0,
                            weight: 1,
                          };
                        }
           
                },
                filter: function (feature, layer) {
                        // 특정 기준으로 필터링 (예: 특정 속성을 가진 데이터만 표시)
                        //console.log('feature',feature)북구, 중구, 동래구, 사상구
                  
                        return feature;
                },
            })
            .bindPopup(function (layer) {
                const description = layer.feature.properties.description || "No description available";
                console.log('layer',layer)
                return `<div>${layer.feature.properties.adm_nm}</div>`; // HTML 문자열 반환
              })
            .on("click", function (e) {
               
               
                
                const names =  e.layer.feature.properties.adm_nm.split(" ")
                //console.log(names[1])
                if(도시지역.includes(names[1])){
                  console.log('clicked..',names[1])
                  
                  //중구지역
                  if(names[1].includes('중구')){

                      setSelectedShowMap({addr:'중구'})
                  }


                }
                // Set the background of the clicked area
                // e.layer.setStyle({
                //   color: "gray",
                //   weight: 2,
                // });

            })
            .addTo(map)
                
        }
    },[map])






    return (

      <div className="wrapper">
       
        <header>
          <div className="top-header">
            <div className="logo">
              <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="Logo" />
            </div>
          </div>
          
          <nav style={{border:"1px solid"}}>
            <ul>
              <li>메뉴1</li>
              <li>메뉴2</li>
              <li>메뉴3</li>  


              <li className="etc">기타메뉴</li>  
            </ul>
          </nav>
 
        </header>
       
        <main>

          <div className="left">
            <div className="map-item">
              <div id="map" style={{  backgroundColor:"#393F4F",objectFit:"contain"}}></div>
              

              {selectedShowMap&&<ShowMap />
              
              }
              


            </div>
            <div className="map-control-item">
               
              <div className="item">상세지도</div>
              <div className="item">침수구역(도시)</div>
              <div className="item">침수구역(하천)</div>
              <div className="item"></div>
              <div className="item"></div>
            </div>  
            <div className="weather-item">
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
            </div>
          </div>
          <div className="right">
              <div className="videoBlock" style={{overflow:"hidden"}}>
                {selectedFLOODING && (
                        <FloodingPopupTEST 
                          lat={selectedFLOODING.lat}
                          lon={selectedFLOODING.lon}
                          hlsAddr={selectedFLOODING.hlsAddr}
                          instl_pos={selectedFLOODING.instl_pos}
                          setSelectedFLOODING={setSelectedFLOODING}
                        />
                  )}

              </div>
              <div>
 

              </div>
          </div>

        </main>

      </div>
        
    )
}


export default Test