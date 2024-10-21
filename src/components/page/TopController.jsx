
import {useState,useEffect} from "react";
import "../../styles/TopController.scss"

const TopController = ()=>{
    const [activeMenu,setActiveMenu] = useState();
    const [activeSubMenu,setActiveSubMenu] = useState();
    const [CCTV01State,setCCTV01State] = useState();
    const [CCTV02State,setCCTV02State] = useState();

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
   
    }

    const 재난CCTV = (e)=>{

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
                    <span onClick={e=>{console.log(e)}}>ON</span>
                    </div>
                </div>
                <div className="item">
                    <div>교통정보 CCTV</div>
                    <div>
                    <span>ON</span>
                    </div>
                </div>
            </div>
            
            <div className="menu-02">

            </div>
            <div className="menu-03">

            </div>

            <div className="flooding-status">
        
            </div>

        </div>



        </>
    )

}


export default TopController;
