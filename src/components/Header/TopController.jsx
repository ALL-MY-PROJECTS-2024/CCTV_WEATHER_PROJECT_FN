
import {useState,useEffect} from "react";

import "./TopController.scss"
import GaugeChart from "./GaugeChart"


import proj4 from 'proj4';


const TopController = ({ CCTV01State, CCTV02State, setCCTV01State, setCCTV02State, floodRiskInfo,map, setFldm_30 })=>{
    const [activeMenu,setActiveMenu] = useState();
    const [activeSubMenu,setActiveSubMenu] = useState();
    const [floodingMenu, setfloodingMenu] = useState(false);
    const [wmsOverlays, setWmsOverlays] = useState([]);
    
    //
    const [fldm_30State,setFldm_30State] = useState(false);
    
    
    const activeMenuHandler = (e)=>{
        //기본메뉴 음영주기
        if(activeMenu)
            activeMenu.classList.remove('active');
        const node =  e.target;
        
        setActiveMenu(node);
        node.classList.add('active')

        
        //서브 메뉴 활성화
        if(activeSubMenu)
            activeSubMenu.classList.remove('active')

        const no = node.getAttribute('data-no');
        let subMenu = document.querySelector(`.menu-${no}`);
        console.log(subMenu);
        subMenu.classList.add('active')

        setActiveSubMenu(subMenu)

        //TOP_HEADER_01 재난감시 CCTV

        //TOP_HEADER_01 인명피해 우려지역

        //TOP_HEADER_01 과거 침수 이력
   
    }

    const 재난CCTV = (e)=>{
        
        if(!CCTV01State){
            //ON
            e.target.style.backgroundColor="royalblue";
            e.target.style.color="white";
            e.target.innerHTML="ON"

        }else{
            e.target.style.backgroundColor="white";
            e.target.style.color="gray";
            e.target.innerHTML="OFF";

        }

        setCCTV01State(!CCTV01State);
    }       

    const 교통CCTV = (e)=>{
        if(!CCTV02State){
            //ON
            e.target.style.backgroundColor="royalblue";
            e.target.style.color="white";
            e.target.innerHTML="ON"
        }else{
            e.target.style.backgroundColor="white";
            e.target.style.color="gray";
            e.target.innerHTML="OFF"

        }
        setCCTV02State(!CCTV02State);
    }       



    // 침수 핸들러
    const floodingHandler = (e)=>{
        setfloodingMenu(!floodingMenu);
    }


    // WMS 적용!!
    const Fldm_30Handler = (e) => {
    
       
        //https://safecity.busan.go.kr/geoserver/iots/wms?service=WMS&request=GetCapabilities


        setFldm_30State(!fldm_30State);

        if (!fldm_30State) {
            // 타일셋 정의 및 추가
            window.kakao.maps.Tileset.add('TILE_NUMBER', 
                new window.kakao.maps.Tileset({
                    
                    width: 256,
                    height: 256,
                   
                    getTile: function (x, y, z) {
                        console.log(x, y, z);
    
                        const tileSize = 256; // 타일 크기
                        
                        // 기준 좌표 설정 (지도 왼쪽 상단의 좌표)
                        const originX = 169896.25; // 최소 X 값
                        const originY = 408063.0; // 최대 Y 값, 위에서 아래로 좌표가 감소한다고 가정


                        // 줌 레벨에 따른 스케일 계산 (EPSG:5181 기준 스케일)
                        const scale = Math.pow(2, 18 - z); // 18은 기본 줌 레벨 기준
                        
                        // 타일 크기에 스케일을 곱하여 현재 줌 레벨의 타일 크기 계산
                        const scaledTileSize = tileSize * scale;

                        // 타일의 좌표를 기준으로 `bbox` 계산
                        let minX = originX + (x * scaledTileSize);
                        let maxY = originY - (y * scaledTileSize); // Y 방향은 위에서 아래로 감소
                        let maxX = minX + scaledTileSize;
                        let minY = maxY - scaledTileSize;
                        minX="169896.25" ;
                        maxY="364757.59375" ;
                        maxX="211255.65625" ;
                        minY="408063.0"
                        // bbox 계산
                        const bbox = `${minX},${minY},${maxX},${maxY}`;

                        
                        console.log(bbox);

                        // WMS 요청 URL 생성

                        const wmsUrl = `https://safecity.busan.go.kr/geoserver/iots/wms?service=WMS&request=GetMap&layers=fldm_30&styles=&format=image/png&transparent=true&version=1.1.1&width=${tileSize}&height=${tileSize}&srs=EPSG:5181&bbox=${bbox}`;
                        
                        // 타일 생성 및 스타일 설정
                        const div = document.createElement('div');
                        div.style.backgroundImage = `url(${wmsUrl})`;
                        div.style.backgroundSize = 'cover';
                        div.style.width = '100%';
                        div.style.height = '100%';
                        div.style.opacity = '1';
                        div.style.fontSize = '2.5rem';
                        
                        div.style.border = `1px solid black`;
                        
                        // 타일 좌표 정보를 텍스트로 표시
                        div.innerHTML = `${x} ${y} ${z}`;
                        div.style.color = 'black';
                        div.style.display = 'flex';
                        div.style.alignItems = 'center';
                        div.style.justifyContent = 'center';
                        
                        return div;
                    }
        
                })
            );
        
            // 타일 오버레이 추가
            map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TILE_NUMBER);
        } else {
            // 타일 오버레이 제거
            map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TILE_NUMBER);
        }

        

    };

    useEffect(()=>{},[])

    //!!!!!!!!!!!!!!!!!!! WMS 오버레이 처리 함수 끝

    return (
        <>
         <div className="controller" >
            <ul>
              <li><button  onClick={activeMenuHandler} data-no="01">재난감시 CCTV</button></li>
              <li><button  onClick={activeMenuHandler} data-no="02">인명피해 우려지역</button></li>
              <li><button  onClick={activeMenuHandler} data-no="03">과거 침수이력</button></li>
            </ul>

            <div className="layerBtn" >
                <button onClick={floodingHandler}    style={{backgroundColor:"transparent",width:"100%",height:"height:100%",border:"0",outline:"none"}}>
                    <img src="https://safecity.busan.go.kr/vue/img/ico-layer.8967d7f4.svg" alt="" />
                </button>
                {floodingMenu && ( // floodingMenu가 true일 때만 메뉴를 보여줌
                    <div className="selectBox">
                        <h6>시나리오별 침수위험도</h6>
                        <div>
                            <input type="checkbox" onChange={Fldm_30Handler} /><span>도시침수 (시간당 98.1mm강우 - 30년빈도)</span>
                        </div>
                        <div>
                            <input type="checkbox" /><span>도시침수 (시간당 106.8mm강우 - 50년빈도)</span>
                        </div>
                        <div>
                            <input type="checkbox" /><span>도시침수 (시간당 114.7mm강우 - 80년빈도)</span>
                        </div>
                        <div>
                            <input type="checkbox" /><span>도시침수 (시간당 118.5mm강우 - 100년빈도)</span>
                        </div>
                        <div>
                            <input type="checkbox" /><span>해안침수 (128cm 해일 - 100년빈도)</span>
                        </div>
                        <div>
                            <input type="checkbox" /><span>하천범람</span>
                        </div>
                        <div>
                            <input type="checkbox" /><span>행정동 침수위험도</span>
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

            </div>
            <div className="menu-03">

            </div>

            <div className="flooding-status">
                    <GaugeChart level={95}  floodRiskInfo={floodRiskInfo} />
            </div>

        </div>


        </>
    )

}


export default TopController;
