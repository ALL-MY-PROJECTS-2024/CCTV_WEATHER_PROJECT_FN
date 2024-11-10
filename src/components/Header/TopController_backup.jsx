
import {useState,useEffect} from "react";

import "./TopController.scss"
import GaugeChart from "./GaugeChart"

const TopController = ({ CCTV01State, CCTV02State, setCCTV01State, setCCTV02State, floodRiskInfo,map, setFldm_30 })=>{
    const [activeMenu,setActiveMenu] = useState();
    const [activeSubMenu,setActiveSubMenu] = useState();
    const [floodingMenu, setfloodingMenu] = useState(false);
    const [wmsOverlays, setWmsOverlays] = useState([]);
    //
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
    
            const tileSize = 256;

            // 타일셋 정의 및 추가
            window.kakao.maps.Tileset.add('TILE_NUMBER', 
                new window.kakao.maps.Tileset({
                    width: 256,
                    height: 256,
                   
                    getTile: function (x, y, z) {
                            console.log(x,y,z);
                            // 타일 내용을 표시하는 div 생성
                            const div = document.createElement('div');
                            div.style.width = '256px';
                            div.style.height = '256px';
                            div.style.backgroundColor="lightgray";
                            div.style.border="1px solid black";
                            div.style.opacity=".2";
                            div.style.backgroundSize = 'cover';
                            return div;
                    }

                })
            );
            // 타일 오버레이 추가
            map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TILE_NUMBER);

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
