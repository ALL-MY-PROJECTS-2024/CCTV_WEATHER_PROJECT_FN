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
}) => {
  const [activeMenu, setActiveMenu] = useState();
  const [activeSubMenu, setActiveSubMenu] = useState();
  const [floodingMenu, setfloodingMenu] = useState(false);
  const [wmsOverlays, setWmsOverlays] = useState([]);

  //
  const [fldm_30State, setFldm_30State] = useState(false);

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
    
        // 상태 반전
        setFldm_30State(!fldm_30State);

        // map 객체가 초기화되지 않았으면 종료
        if (!map) {
            console.error("Map 객체가 초기화되지 않았습니다.");
            return;
        }

        // 기존 레이어 제거
        const existingLayer = wmsOverlays.find(layer => layer.options.layers === 'fldm_30');
        if (existingLayer) {
            console.log("기존 레이어 제거 중...");
            map.removeLayer(existingLayer);
            setWmsOverlays(wmsOverlays.filter(layer => layer.options.layers !== 'fldm_30'));
            return;
        }

        // 새로운 WMS 오버레이 레이어 추가
        console.log("새로운 WMS 레이어 추가 중...");
        const wmsLayer = L.tileLayer.wms('https://safecity.busan.go.kr/geoserver/iots/wms', {
            layers: 'fldm_30',       // GeoServer의 레이어 이름
            format: 'image/png',     // 이미지 형식
            transparent: true,       // 배경을 투명하게 설정
            version: '1.3.0',
            attribution: '&copy; Safe City Busan GeoServer',
            styles: 'fldm_sld',      // GeoServer에 설정된 스타일 이름
            zIndex: 1000             // 기본 타일 레이어보다 높은 zIndex 설정
        });

        wmsLayer.addTo(map);
        setWmsOverlays([...wmsOverlays, wmsLayer]);

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
                <input type="checkbox" />
                <span>도시침수 (시간당 106.8mm강우 - 50년빈도)</span>
              </div>
              <div>
                <input type="checkbox" />
                <span>도시침수 (시간당 114.7mm강우 - 80년빈도)</span>
              </div>
              <div>
                <input type="checkbox" />
                <span>도시침수 (시간당 118.5mm강우 - 100년빈도)</span>
              </div>
              <div>
                <input type="checkbox" />
                <span>해안침수 (128cm 해일 - 100년빈도)</span>
              </div>
              <div>
                <input type="checkbox" />
                <span>하천범람</span>
              </div>
              <div>
                <input type="checkbox" />
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
