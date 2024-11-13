import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Home = () => {
  useEffect(() => {
    // Leaflet 지도 초기화 (부산광역시청 위치)
    const map = L.map('map').setView([35.1796, 129.0756], 12);

    
    // Vworld 하이브리드 베이스맵 추가
    L.tileLayer('http://api.vworld.kr/req/wmts/1.0.0/{apiKey}/Base/{z}/{y}/{x}.png', {
      maxZoom: 19,
      minZoom: 6,
      attribution: '&copy; <a href="http://map.vworld.kr/">Vworld</a>',
      apiKey: 'C5307FBC-84D9-3817-BBE1-B36D9635CCAF'  // Vworld API 키를 여기에 입력하세요
    }).addTo(map);


  }, []);

    return (
        <div className="mainSection">
          {/* <Aside /> */}
          {/* <TopController
            CCTV01State={CCTV01State}
            CCTV02State={CCTV02State}
            setCCTV01State={setCCTV01State}
            setCCTV02State={setCCTV02State}
            flooding2020State={flooding2020State}
            setFlooding2020State={setFlooding2020State}
            floodRiskInfo={floodRiskInfo}  // Pass flood risk info to TopController
            map = {map}
            setFldm_30={setFldm_30}

          /> */}

          <div id="map" style={{width:"100%"}}></div>
          {/* {selectedCCTV && (
            <CCTVPopup 
              lat={selectedCCTV.lat}
              lon={selectedCCTV.lon}
              hlsAddr={selectedCCTV.hlsAddr}
              onClose={() => setSelectedCCTV(null)}  // 팝업 닫기 설정
            />
          )} */}
          
          {/* <div style={{ padding: "10px" }}>
            <p>현재 중심 좌표: {centerPosition.lat}, {centerPosition.lng}</p>
            <p>현재 주소: {address}</p>
            <p>침수 위험 정보: {floodRiskInfo ? JSON.stringify(floodRiskInfo) : "정보 없음"}</p>
          </div>
          <div>
          <img alt="" role="presentation" src="https://safecity.busan.go.kr/geoserver/iots/wms?service=WMS&amp;request=GetMap&amp;layers=fldm_30&amp;styles=&amp;format=image%2Fpng&amp;transparent=true&amp;version=1.1.1&amp;width=256&amp;height=256&amp;srs=EPSG%3A5181&amp;bbox=387791.99999999866,189855.99999999953,389840.00000000163,191904.0000000018" class="leaflet-tile leaflet-tile-loaded"  />
          </div> */}
        </div>
        
      );
};

export default Home;
