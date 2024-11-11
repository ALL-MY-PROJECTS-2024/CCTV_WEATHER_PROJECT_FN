
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
    // EPSG:5186 (한국 중부) TM 좌표계 정의
    proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs");

    const Fldm_30Handler = (e) => {

        
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //그냥 범위내의 위도경도를 잡아서 거기에 오버레이를 해버리는건 어떨까!
        //이동해도 상관없이 고정으로 오버레이 하기!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const content = 
        `<div id="fixedOverlay" style="
            background-image: url('https://safecity.busan.go.kr/geoserver/iots/wms?service=WMS&request=GetMap&layers=fldm_30&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=1000&height=1000&srs=CRS%3A84&bbox=128.8048024262355,35.00381579648614,129.28960715493199,35.38509155161659');
            background-size: contain;
            width: 1000px;
            height: 1000px;
            position: fixed;
            top: 50px; /* 원하는 위치로 조정 */
            left: 50px; /* 원하는 위치로 조정 */
            z-index: 1000; /* 지도 위에 표시되도록 */
        "></div>`
        // 커스텀 오버레이가 표시될 위치입니다 
        var position = new window.kakao.maps.LatLng(35.182712, 129.072904);  
        // 커스텀 오버레이를 생성합니다
        var customOverlay = new window.kakao.maps.CustomOverlay({
            position: position,
            content: content,
            xAnchor: 0.3,
            yAnchor: 0.91
        });
        // 커스텀 오버레이를 지도에 표시합니다
        customOverlay.setMap(map);

        // const mapContainer = document.getElementById('map'); // HTML 요소 id로 가져오기
        // const width = mapContainer.offsetWidth;  // 가로 크기
        // const height = mapContainer.offsetHeight; // 세로 크기

        // console.log("지도 가로 크기 (px):", width);
        // console.log("지도 세로 크기 (px):", height);


        // const div = document.createElement('div');
        
        // const url = `https://safecity.busan.go.kr/geoserver/iots/wms?service=WMS&request=GetMap&layers=fldm_30&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=${width}&height=${height}&srs=CRS%3A84&bbox=128.8048024262355,35.00381579648614,129.28960715493199,35.38509155161659`;
        

        // var content = `<div style='width:100vw;height:100vh;border:5px solid;'>TEST</div>`;
        // var position = new window.kakao.maps.LatLng(35.17944, 129.07556);  
        // // 커스텀 오버레이를 생성합니다
        // var customOverlay = new window.kakao.maps.CustomOverlay({
        //     position: position,
        //     content: content   
        // });

        // // 커스텀 오버레이를 지도에 표시합니다
        // customOverlay.setMap(map);

        //-----------------------------------
        // 타일형으로 부여하기(실패)
        //-----------------------------------
        //https://safecity.busan.go.kr/geoserver/iots/wms?service=WMS&request=GetCapabilities


        // <Layer queryable="1" opaque="0">
        // <Name>fldm_30</Name>
        // <Title>fldm_30</Title>
        // <Abstract/>
        // <KeywordList>
        // <Keyword>features</Keyword>
        // <Keyword>fldm_30</Keyword>
        // </KeywordList>
        // <CRS>EPSG:5181</CRS>
        // <CRS>CRS:84</CRS>
        // <EX_GeographicBoundingBox>
        // <westBoundLongitude>128.80496461966746</westBoundLongitude>
        // <eastBoundLongitude>129.28951961954024</eastBoundLongitude>
        // <southBoundLatitude>35.003847767054964</southBoundLatitude>
        // <northBoundLatitude>35.38443556026641</northBoundLatitude>
        // </EX_GeographicBoundingBox>
        // <BoundingBox CRS="CRS:84" minx="128.80496461966746" miny="35.003847767054964" maxx="129.28951961954024" maxy="35.38443556026641"/>
        // <BoundingBox CRS="EPSG:5181" minx="169896.25" miny="364757.59375" maxx="211255.65625" maxy="408063.0"/>
        // <Style>
        // <Name>fldm_sld</Name>
        // <Title>fldm_sld</Title>
        // <LegendURL width="58" height="120">
        // <Format>image/png</Format>
        // <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="https://safecity.busan.go.kr/geoserver/iots/ows?service=WMS&version=1.3.0&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=fldm_30"/>
        // </LegendURL>
        // </Style>
        // </Layer>




        // setFldm_30State(!fldm_30State);


 


        // let i_x = 0;
        // let i_y = 0;

        // if (!fldm_30State) {
        //      // 타일셋 정의 및 추가
        //     window.kakao.maps.Tileset.add('CUSTOM_TILE', 
        //         new window.kakao.maps.Tileset({
                    
        //             width: 256,
        //             height:256,
                
        //             getTile: function (x, y, z) {
        //                 const tileSize = 256;

        //                 // x, y, z에 좌하단의 x, y
        //                 var wtm_x = x * Math.pow(2, z - 3) * 256 - 30000;
        //                 var wtm_y = y * Math.pow(2, z - 3) * 256 - 60000;

        //                 var coords = new window.kakao.maps.Coords(wtm_x, wtm_y);
        //                 var latlng = coords.toLatLng();
        //                 console.log(latlng.toString());

        //                 // 타일 생성 및 스타일 설정
        //                 const div = document.createElement('div');


        //                 div.style.backgroundSize = 'cover';
        //                 div.style.width = '100%';
        //                 div.style.height = '100%';
        //                 div.style.opacity = '1';
        //                 div.style.fontSize = '2.5rem';
        //                 div.style.border = `1px solid black`;
                        
        //                 // 타일 좌표 정보를 텍스트로 표시
        //                 div.innerHTML = `${x} ${y} ${z}`;
        //                 div.style.color = 'black';
        //                 div.style.display = 'flex';
        //                 div.style.alignItems = 'center';
        //                 div.style.justifyContent = 'center';
        //                 div.style.position = 'relative';
        //                 div.style.boxSizing = 'border-box';
                        
     

          
        //                 return div;
        //             }

        //         })
        //     );

        //     // 타일 오버레이 추가
        //     map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.CUSTOM_TILE);
        // } else {
        //     // 타일 오버레이 제거
        //     map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.CUSTOM_TILE);
        // }

        
        // 지도를 클릭했을 때 클릭한 위치의 위도와 경도를 표시하는 함수
        window.kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
            // 클릭한 위치의 위도와 경도 정보 가져오기
            const latlng = mouseEvent.latLng; 

            // 위도와 경도를 출력
            const message = `클릭한 위치의 위도: ${latlng.getLat().toFixed(6)}, 경도: ${latlng.getLng().toFixed(6)}`;
            console.log(message);

            // 정보 표시를 위한 HTML 요소 생성 및 업데이트
            let infoDiv = document.getElementById('mapInfo');
            if (!infoDiv) {
                infoDiv = document.createElement('div');
                infoDiv.id = 'mapInfo';
                infoDiv.style.position = 'absolute';
                infoDiv.style.top = '10px';
                infoDiv.style.left = '10px';
                infoDiv.style.padding = '10px';
                infoDiv.style.backgroundColor = 'white';
                infoDiv.style.border = '1px solid #333';
                document.body.appendChild(infoDiv);
            }
            infoDiv.innerHTML = message;
        })



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
