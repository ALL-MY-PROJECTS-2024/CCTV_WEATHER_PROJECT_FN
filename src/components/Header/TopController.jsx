
import {useState,useEffect} from "react";

import "./TopController.scss"
import GaugeChart from "./GaugeChart"

const TopController = (props)=>{
    const [activeMenu,setActiveMenu] = useState();
    const [activeSubMenu,setActiveSubMenu] = useState();

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
        
        if(!props.CCTV01State){
            //ON
            e.target.style.backgroundColor="royalblue";
            e.target.style.color="white";
            e.target.innerHTML="ON"

        }else{
            e.target.style.backgroundColor="white";
            e.target.style.color="gray";
            e.target.innerHTML="OFF";

        }

        props.setCCTV01State(!props.CCTV01State);
    }       

    const 교통CCTV = (e)=>{
        if(!props.CCTV02State){
            //ON
            e.target.style.backgroundColor="royalblue";
            e.target.style.color="white";
            e.target.innerHTML="ON"
        }else{
            e.target.style.backgroundColor="white";
            e.target.style.color="gray";
            e.target.innerHTML="OFF"

        }
        props.setCCTV02State(!props.CCTV02State);
    }       

    return (
        <>
         <div className="controller" >
            <ul>
              <li><button  onClick={activeMenuHandler} data-no="01">재난감시 CCTV</button></li>
              <li><button  onClick={activeMenuHandler} data-no="02">인명피해 우려지역</button></li>
              <li><button  onClick={activeMenuHandler} data-no="03">과거 침수이력</button></li>
            </ul>

            <div className="layerBtn">
              <img src="https://safecity.busan.go.kr/vue/img/ico-layer.8967d7f4.svg" alt="" />
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
                    <GaugeChart level="안전" />
            </div>

        </div>



        </>
    )

}


export default TopController;
