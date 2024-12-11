import React, { useEffect, useState, useCallback } from 'react';
import { union } from "@turf/turf"; // 기본 내보내기가 아닌 union 모듈만 임포트

import busanGeoJson from '../dataSet/busan.json';

import "./Home.scss";

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



const Test  = ()=>{
    const [centerPosition, setCenterPosition] = useState({ lat: 35.1795543, lng: 129.0756416 });
    const [map, setMap] = useState(null);
     //
    const [sig_layerState,setSig_layerState] = useState(false);
    const [sig_layer, setSig_layer] = useState(null)  

    //----------------------------
    //
    //----------------------------
    useEffect(() => {
        if(map==undefined){
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
            center: [centerPosition.lat, centerPosition.lng],
            crs: EPSG5181,
            zoom:9,
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
    



            // 지도 이동 시 이벤트
            mapInstance.on('moveend', () => {
            const center = mapInstance.getCenter();
            setCenterPosition({ lat: center.lat, lng: center.lng });
            
            });

        }

      }, []);

    //----------------------------
    //
    //----------------------------
    useEffect(()=>{
        if (map) {
            
            //법정동 표시용 
            const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
                layers: 'iots:sig_layer',
                format: 'image/png',
                transparent: true,
                version: '1.1.1',
                attribution: '&copy; Safe City Busan GeoServer',
                styles: '',
                zIndex: 1000,
              });
          
              wmsLayer.addTo(map);
              setSig_layer(wmsLayer);


            //groupByDistrict(busanGeoJson);



            // GeoJSON 레이어 추가(클릭- 이벤트처리용)
            const geojsonLayer = L.geoJSON(busanGeoJson , {
                style: function (feature) {
                        return {
                        color: "",
                        fillColor: "yellow",
                        fillOpacity: 0,
                        weight: 1,
                        };
                },
                filter: function (feature, layer) {
                        // 특정 기준으로 필터링 (예: 특정 속성을 가진 데이터만 표시)
                        //console.log('feature',feature)
                        return feature;
                },
            })
            .bindPopup(function (layer) {
                const description = layer.feature.properties.description || "No description available";
                return `<div>${description}</div>`; // HTML 문자열 반환
              })
            .on("click", function (e) {
                console.log("Clicked region: ",e);
            })
            .addTo(map)
                
        }
    },[map])

    return (

        <div>
            <div id="map" style={{ width: "100%", height: "100vh" }}></div>
        </div>
    )
}


export default Test