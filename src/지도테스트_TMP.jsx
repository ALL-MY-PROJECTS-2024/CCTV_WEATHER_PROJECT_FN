// <!DOCTYPE html>
// <html lang="ko">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <title>Leaflet로 기본 지도 위에 WMS 오버레이 적용</title>
//   <link
//     rel="stylesheet"
//     href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
//   />
//   <style>
//     #map {
//       height: 100vh;
//     }
//   </style>
// </head>
// <body>
//   <div id="map"></div>
//   <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
//   <script>
//     // Leaflet 지도 초기화, 서울 위치로 설정
//     const map = L.map('map').setView([35.1796, 129.0756], 12);
    
//     // Vworld 하이브리드 베이스맵 추가
//     L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/{apiKey}/Base/{z}/{y}/{x}.png', {
//       maxZoom: 19,
//       minZoom: 6,
//       attribution: '&copy; <a href="http://map.vworld.kr/">Vworld</a>',
//       apiKey: 'C5307FBC-84D9-3817-BBE1-B36D9635CCAF'  // Vworld API 키를 여기에 입력하세요
//     }).addTo(map);

//     // GeoServer의 WMS 오버레이 레이어 추가
//     L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
//       layers: 'fldm_30',            // GeoServer의 레이어 이름
//       format: 'image/png',          // 이미지 형식
//       transparent: true,            // 배경을 투명하게 설정
//       version: '1.3.0',
//       attribution: '&copy; Safe City Busan GeoServer',
//       styles: 'fldm_sld'            // GeoServer에 설정된 스타일 이름
//     }).addTo(map);
//   </script>
// </body>
// </html>
