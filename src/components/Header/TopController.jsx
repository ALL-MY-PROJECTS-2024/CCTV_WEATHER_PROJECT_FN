import { useState, useEffect } from "react";

import "./TopController.scss";
import GaugeChart from "./GaugeChart";
import L from 'leaflet';  // `{}` 없이 가져옵니다.
import proj4 from "proj4";

const TopController = ({
  CCTV01State,
  CCTV02State,
  setCCTV01State,
  setCCTV02State,
  floodRiskInfo,
  map,
  flooding2020State,
  setFlooding2020State,
  floodingImgState,
  setFloodingImgState
}) => {
  const [activeMenu, setActiveMenu] = useState();
  const [activeSubMenu, setActiveSubMenu] = useState();
  const [floodingMenu, setfloodingMenu] = useState(false);


  //
  const [fldm_30State,setFldm_30State] = useState(false);
  const [fldm_30, setFldm_30] = useState(null);
  //
  const [fldm_50State,setFldm_50State] = useState(false);
  const [fldm_50, setFldm_50] = useState(null);
  //
  const [fldm_80State,setFldm_80State] = useState(false);
  const [fldm_80, setFldm_80] = useState(null)
  //
  const [fldm_100State,setFldm_100State] = useState(false);
  const [fldm_100, setFldm_100] = useState(null)
  //
  const [fldm_coast_100State,setFldm_coast_100State] = useState(false);
  const [fldm_coast_100, setFldm_coast_100] = useState(null)
  //
  const [fldm_riverState,setFldm_riverState] = useState(false);
  const [fldm_river, setFldm_river] = useState(null)  
  //
  const [sig_layerState,setSig_layerState] = useState(false);
  const [sig_layer, setSig_layer] = useState(null)  

  const activeMenuHandler = (e) => {
    //기본메뉴 음영주기
    if (activeMenu) activeMenu.classList.remove("active");
    const node = e.target;

    setActiveMenu(node);
    node.classList.add("active");

    //서브 메뉴 활성화
    if (activeSubMenu) activeSubMenu.classList.remove("active");

    const no = node.getAttribute("data-no");
    let subMenu = document.querySelector(`.menu-${no}`);
    console.log(subMenu);
    subMenu.classList.add("active");

    setActiveSubMenu(subMenu);

    //TOP_HEADER_01 재난감시 CCTV

    //TOP_HEADER_01 인명피해 우려지역

    //TOP_HEADER_01 과거 침수 이력
  };

  //---------------------------------------------------
  // CONTROLLER 
  //---------------------------------------------------
  const 인명피해우려지역 = (e) => {
    const el = e.target;
    console.log('clicked..',e.target.innerHTML);

  };

  const 재난CCTV = (e) => {
    if (!CCTV01State) {
      //ON
      e.target.style.backgroundColor = "royalblue";
      e.target.style.color = "white";
      e.target.innerHTML = "ON";
    } else {
      e.target.style.backgroundColor = "white";
      e.target.style.color = "gray";
      e.target.innerHTML = "OFF";
    }

    setCCTV01State(!CCTV01State);
  };

  const 교통CCTV = (e) => {
    if (!CCTV02State) {
      //ON
      e.target.style.backgroundColor = "royalblue";
      e.target.style.color = "white";
      e.target.innerHTML = "ON";
    } else {
      e.target.style.backgroundColor = "white";
      e.target.style.color = "gray";
      e.target.innerHTML = "OFF";
    }
    setCCTV02State(!CCTV02State);
  };

  const 침수2020 = (e) => {
    if (!flooding2020State) {
      //ON
      e.target.style.backgroundColor = "royalblue";
      e.target.style.color = "white";
      e.target.innerHTML = "ON";
    } else {
      e.target.style.backgroundColor = "white";
      e.target.style.color = "gray";
      e.target.innerHTML = "OFF";
    }
    setFlooding2020State(!flooding2020State);
  };

  //---------------------------------------------------
  // 침수 핸들러
  //---------------------------------------------------
  const floodingHandler = (e) => {
    setfloodingMenu(!floodingMenu);
  };

  const Fldm_30Handler = (e) => {

    
    // 새로운 상태를 먼저 설정
   
    setFldm_30State(!fldm_30State);
  
    // map 객체가 초기화되지 않았으면 종료
    if (!map) {
      console.error("Map 객체가 초기화되지 않았습니다.");
      return;
    }
  
    // 기존 레이어 제거 또는 추가
    if (!fldm_30State) {
      // 새로운 상태가 true이고 레이어가 없을 때 추가
      console.log("새로운 WMS 레이어 추가 중...");
      const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
        layers: 'iots:fldm_30',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: '&copy; Safe City Busan GeoServer',
        styles: '',
        zIndex: 1000,
      });
  
      wmsLayer.addTo(map);
      setFldm_30(wmsLayer);
      console.log("레이어가 추가되었습니다.");
      
      //침수이미지
       setFloodingImgState(true);
      
    } else {
      // 새로운 상태가 false이고 레이어가 존재할 때 제거
      console.log("기존 레이어 제거 중...");
      map.removeLayer(fldm_30);
      setFldm_30(null);
      console.log("레이어가 제거되었습니다.");

      //침수이미지
      setFloodingImgState(false);
    }
  };


  const Fldm_50Handler = (e) => {
    // 새로운 상태를 먼저 설정
   
    setFldm_50State(!fldm_50State);
  
    // map 객체가 초기화되지 않았으면 종료
    if (!map) {
      console.error("Map 객체가 초기화되지 않았습니다.");
      return;
    }
  
    // 기존 레이어 제거 또는 추가
    if (!fldm_50State) {
      // 새로운 상태가 true이고 레이어가 없을 때 추가
      console.log("새로운 WMS 레이어 추가 중...");
      const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
        layers: 'iots:fldm_50',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: '&copy; Safe City Busan GeoServer',
        styles: '',
        zIndex: 1000,
      });
  
      wmsLayer.addTo(map);
      setFldm_50(wmsLayer);
      console.log("레이어가 추가되었습니다.");
      
      //침수이미지
      setFloodingImgState(true);      
      
    } else {
      // 새로운 상태가 false이고 레이어가 존재할 때 제거
      console.log("기존 레이어 제거 중...");
      map.removeLayer(fldm_50);
      setFldm_50(null);
      console.log("레이어가 제거되었습니다.");

      //침수이미지
      setFloodingImgState(false);      
    }

    
  };
  const Fldm_80Handler = (e) => {
    // 새로운 상태를 먼저 설정
   
    setFldm_80State(!fldm_80State);
  
    // map 객체가 초기화되지 않았으면 종료
    if (!map) {
      console.error("Map 객체가 초기화되지 않았습니다.");
      return;
    }
  
    // 기존 레이어 제거 또는 추가
    if (!fldm_80State) {
      // 새로운 상태가 true이고 레이어가 없을 때 추가
      console.log("새로운 WMS 레이어 추가 중...");
      const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
        layers: 'iots:fldm_80',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: '&copy; Safe City Busan GeoServer',
        styles: '',
        zIndex: 1000,
      });
  
      wmsLayer.addTo(map);
      setFldm_80(wmsLayer);
      console.log("레이어가 추가되었습니다.");

      //침수이미지
      setFloodingImgState(true);      
    } else {
      // 새로운 상태가 false이고 레이어가 존재할 때 제거
      console.log("기존 레이어 제거 중...");
      map.removeLayer(fldm_80);
      setFldm_80(null);
      console.log("레이어가 제거되었습니다.");
      
      //침수이미지
      setFloodingImgState(false);      
    }

    
  };
  const Fldm_100Handler = (e) => {
    // 새로운 상태를 먼저 설정
   
    setFldm_100State(!fldm_100State);
  
    // map 객체가 초기화되지 않았으면 종료
    if (!map) {
      console.error("Map 객체가 초기화되지 않았습니다.");
      return;
    }
  
    // 기존 레이어 제거 또는 추가
    if (!fldm_100State) {
      // 새로운 상태가 true이고 레이어가 없을 때 추가
      console.log("새로운 WMS 레이어 추가 중...");
      const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
        layers: 'iots:fldm_100',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: '&copy; Safe City Busan GeoServer',
        styles: '',
        zIndex: 1000,
      });
  
      wmsLayer.addTo(map);
      setFldm_100(wmsLayer);
      console.log("레이어가 추가되었습니다.");

      //침수이미지
      setFloodingImgState(true);      
    } else {
      // 새로운 상태가 false이고 레이어가 존재할 때 제거
      console.log("기존 레이어 제거 중...");
      map.removeLayer(fldm_100);
      setFldm_100(null);
      console.log("레이어가 제거되었습니다.");
      //침수이미지
      setFloodingImgState(false);      
    }

    
  };
  const fldm_coast_100Handler = (e) => {
    // 새로운 상태를 먼저 설정
   
    setFldm_coast_100State(!fldm_coast_100State);
  
    // map 객체가 초기화되지 않았으면 종료
    if (!map) {
      console.error("Map 객체가 초기화되지 않았습니다.");
      return;
    }
  
    // 기존 레이어 제거 또는 추가
    if (!fldm_coast_100State) {
      // 새로운 상태가 true이고 레이어가 없을 때 추가
      console.log("새로운 WMS 레이어 추가 중...");
      const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
        layers: 'iots:fldm_coast_100y',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: '&copy; Safe City Busan GeoServer',
        styles: '',
        zIndex: 1000,
      });
  
      wmsLayer.addTo(map);
      setFldm_coast_100(wmsLayer);
      console.log("레이어가 추가되었습니다.");
      //침수이미지
      setFloodingImgState(true);

    } else {
      // 새로운 상태가 false이고 레이어가 존재할 때 제거
      console.log("기존 레이어 제거 중...");
      map.removeLayer(fldm_coast_100);
      setFldm_coast_100(null);
      console.log("레이어가 제거되었습니다.");
      //침수이미지
      setFloodingImgState(false);      
    }

    
  };
  const Fldm_riverHandler = (e) => {
    // 새로운 상태를 먼저 설정
   
    setFldm_riverState(!fldm_riverState);
  
    // map 객체가 초기화되지 않았으면 종료
    if (!map) {
      console.error("Map 객체가 초기화되지 않았습니다.");
      return;
    }
  
    // 기존 레이어 제거 또는 추가
    if (!fldm_riverState) {
      // 새로운 상태가 true이고 레이어가 없을 때 추가
      console.log("새로운 WMS 레이어 추가 중...");
      const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
        layers: 'iots:fldm_river',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        attribution: '&copy; Safe City Busan GeoServer',
        styles: '',
        zIndex: 1000,
      });
  
      wmsLayer.addTo(map);
      setFldm_river(wmsLayer);
      console.log("레이어가 추가되었습니다.");
      //침수이미지
      setFloodingImgState(true);      
    } else {
      // 새로운 상태가 false이고 레이어가 존재할 때 제거
      console.log("기존 레이어 제거 중...");
      map.removeLayer(fldm_river);
      setFldm_river(null);
      console.log("레이어가 제거되었습니다.");
      //침수이미지
      setFloodingImgState(false);      
    }

    
  };
  const Sig_layerHandler = (e) => {
    // 새로운 상태를 먼저 설정
   
    setSig_layerState(!sig_layerState);
  
    // map 객체가 초기화되지 않았으면 종료
    if (!map) {
      console.error("Map 객체가 초기화되지 않았습니다.");
      return;
    }
  
    // 기존 레이어 제거 또는 추가
    if (!sig_layerState) {
      // 새로운 상태가 true이고 레이어가 없을 때 추가
      console.log("새로운 WMS 레이어 추가 중...");
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
      console.log("레이어가 추가되었습니다.");
      //침수이미지
      setFloodingImgState(true);      
    } else {
      // 새로운 상태가 false이고 레이어가 존재할 때 제거
      console.log("기존 레이어 제거 중...");
      map.removeLayer(sig_layer);
      setSig_layer(null);
      console.log("레이어가 제거되었습니다.");
      //침수이미지
      setFloodingImgState(false);      
    }

    
  };
    
  //---------------------------------------------------
  //침수 처리 종료
  //---------------------------------------------------

  return (
    <>
      <div className="controller">
        <ul>
          <li>
            <button onClick={activeMenuHandler} data-no="01">
              재난감시 CCTV
            </button>
          </li>
          <li>
            <button onClick={activeMenuHandler} data-no="02">
              인명피해 우려지역
            </button>
          </li>
          <li>
            <button onClick={activeMenuHandler} data-no="03">
              과거 침수이력
            </button>
          </li>
        </ul>

        <div className="layerBtn">
          <button
            onClick={floodingHandler}
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "height:100%",
              border: "0",
              outline: "none",
            }}
          >
            <img
              src="https://safecity.busan.go.kr/vue/img/ico-layer.8967d7f4.svg"
              alt=""
            />
          </button>
          {floodingMenu && ( // floodingMenu가 true일 때만 메뉴를 보여줌
            <div className="selectBox">
              <h6>시나리오별 침수위험도</h6>
              <div>
                <input
                  type="checkbox"
                  checked={fldm_30State}
                  onChange={Fldm_30Handler}
                />
                <span>도시침수 (시간당 98.1mm강우 - 30년빈도)</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={fldm_50State}
                  onChange={Fldm_50Handler}
                />
                <span>도시침수 (시간당 106.8mm강우 - 50년빈도)</span>
              </div>
              <div>
                 <input
                  type="checkbox"
                  checked={fldm_80State}
                  onChange={Fldm_80Handler}
                />
                <span>도시침수 (시간당 114.7mm강우 - 80년빈도)</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={fldm_100State}
                  onChange={Fldm_100Handler}
                />
                <span>도시침수 (시간당 118.5mm강우 - 100년빈도)</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={fldm_coast_100State}
                  onChange={fldm_coast_100Handler}
                />
                <span>해안침수 (128cm 해일 - 100년빈도)</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={fldm_riverState}
                  onChange={Fldm_riverHandler}
                />
                <span>하천범람</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={sig_layerState}
                  onChange={Sig_layerHandler}
                />  
                <span>행정동 침수위험도</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="show-contents">
        <div className="menu-01 ">
          <div className="item">
            <div>재난감시 CCTV</div>
            <div>
              <span onClick={재난CCTV}>OFF</span>
            </div>
          </div>
          <div className="item">
            <div>교통정보 CCTV</div>
            <div>
              <span onClick={교통CCTV}>OFF</span>
            </div>
          </div>
        </div>

        <div className="menu-02">
          <div class="induationCheckBox">
            <ul class="disaster_list">
              <ul>
                <li class="active" onClick={인명피해우려지역}>부산전체</li>
                <li class="active" onClick={인명피해우려지역}>중구</li>
                <li class="active" onClick={인명피해우려지역}>서구</li>
                <li class="active" onClick={인명피해우려지역}>동구</li>
                <li class="active" onClick={인명피해우려지역}>영도구</li>
                <li class="active" onClick={인명피해우려지역}>부산진구</li>
                <li class="active" onClick={인명피해우려지역}>동래구</li>
                <li class="active" onClick={인명피해우려지역}>남구</li>
                <li class="active" onClick={인명피해우려지역}>북구</li>
                <li class="active" onClick={인명피해우려지역}>해운대구</li>
                <li class="active" onClick={인명피해우려지역}>사하구</li>
                <li class="active" onClick={인명피해우려지역}>금정구</li>
                <li class="active" onClick={인명피해우려지역}>강서구</li>
                <li class="active" onClick={인명피해우려지역}>연제구</li>
                <li class="active" onClick={인명피해우려지역}>수영구</li>
                <li class="active" onClick={인명피해우려지역}>사상구</li>
                <li class="active" onClick={인명피해우려지역}>기장군</li>
              </ul>
            </ul>
          </div>
        </div>
        <div className="menu-03">
          <div className="item">
            <div>2020년 침수</div>
            <div>
              <span onClick={침수2020}>OFF</span>
            </div>
          </div>
        </div>

        <div className="flooding-status">
          <GaugeChart level={95} floodRiskInfo={floodRiskInfo} />
        </div>
      </div>
    </>
  );
};

export default TopController;
