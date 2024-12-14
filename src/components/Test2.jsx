import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import "proj4";
import "proj4leaflet";
import JSON_TEST from '../dataSet/침수위험 수치모델 이미지 데이터/내수/동래구/030yr_060/Dongnae_030_1_00019.json';

const Test = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map) {
      const mapInstance = L.map('map', {
        center: [35.1795543, 129.0756416],
        zoom: 7,
      });

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
        }
      ).addTo(mapInstance);

      setMap(mapInstance);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      const EPSG5179 = new L.Proj.CRS(
        'EPSG:5179',
        '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'
      );

      const coordinates = JSON_TEST.ANNOTATIONS.map(annotation =>
        annotation.COORDINATE.map(([x, y]) => {
          if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            console.warn('Invalid coordinate:', x, y);
            return null;
          }
          try {
            const projected = EPSG5179.projection.unproject(L.point(x, y));
            return [projected.lat, projected.lng]; // Convert to WGS84 (latitude, longitude)
          } catch (error) {
            console.error('Error converting coordinate:', x, y, error);
            return null;
          }
        }).filter(coord => coord !== null) // Remove invalid coordinates
      );

      coordinates.forEach((polygonCoords, index) => {
        if (polygonCoords.length > 0) {
          console.log(`Adding polygon #${index + 1} with coordinates:`, polygonCoords);
          L.polygon(polygonCoords, {
            color: 'red',
            weight: 2,
            fillColor: 'orange',
            fillOpacity: 0.6,
          }).addTo(map);
        } else {
          console.warn(`Empty polygon #${index + 1} skipped.`);
        }
      });
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      // EPSG:5179 정의
      const proj4def =
        '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs';
      const EPSG5179 = new L.Proj.CRS('EPSG:5179', proj4def);

      // GeoJSON FeatureCollection 생성
      const geoJsonFeatures = JSON_TEST.ANNOTATIONS.map((annotation) => {
        const coordinates = annotation.COORDINATE.map(([x, y]) => {
          try {
            // EPSG:5179 -> WGS84 변환
            const point = EPSG5179.projection.unproject(L.point(x, y));
            return [point.lng, point.lat]; // GeoJSON은 [lng, lat] 순서 사용
          } catch (error) {
            console.error('좌표 변환 오류:', x, y, error);
            return null;
          }
        }).filter((coord) => coord !== null); // 유효하지 않은 좌표 제거

        return {
          type: 'Feature',
          properties: {}, // 필요시 속성 추가 가능
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates], // GeoJSON 형식의 폴리곤
          },
        };
      });

      const geoJsonData = {
        type: 'FeatureCollection',
        features: geoJsonFeatures,
      };

      // GeoJSON 데이터를 지도에 추가
      L.geoJSON(JSON_TEST, {
        style: {
          color: 'red',
          weight: 2,
          fillColor: 'orange',
          fillOpacity: 0.6,
        },
      }).addTo(map);

      console.log('GeoJSON 데이터 추가 완료:', geoJsonData);
    }
  }, [map]);


  return <div id="map" style={{ width: '100%', height: '100vh' }} />;
};

export default Test;
