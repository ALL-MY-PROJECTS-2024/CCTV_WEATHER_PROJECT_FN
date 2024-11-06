// CCTVPopup.js
import React, { useState, useEffect, useRef } from 'react';
import './CCTVPopup.scss';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS import


import { Swiper, SwiperSlide } from 'swiper/react'; // Swiper와 SwiperSlide를 import
import { Navigation } from 'swiper/modules'; // Navigation 모듈 import

import '../../node_modules/swiper/swiper-bundle.min.css'; // Swiper 스타일 import

// 날씨 정보 가져오기
const fetchWeatherInfo = async (latitude, longitude) => {
  

  // 현재 날짜와 시간을 가져와서 포맷
  const now = new Date();
  
  // 가능한 base_time 목록 (30분 단위로 설정)
  const availableTimes = [
    "0200", "0500", "0800", "1100", "1400", "1700", "2000", "2300"
  ];

  // 현재 시간에서 가능한 base_time을 찾음
  let baseTime = "";
  for (let i = availableTimes.length - 1; i >= 0; i--) {
    const [hour, minute] = [parseInt(availableTimes[i].slice(0, 2)), 0];
    const baseDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    
    // 현재 시간보다 이전의 base_time을 찾음
    if (now >= baseDateTime) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
      baseTime = availableTimes[i];
      break;
    }
  }

  // 자정 이전의 base_time을 사용하는 경우 하루 전 날짜로 설정
  let baseDate = now;
  if (now.getHours() < 6) {
    baseDate.setDate(now.getDate() - 1);
    baseTime = "2300"
  }

  // base_date 포맷: YYYYMMDD
  const formattedDate = `${baseDate.getFullYear()}${String(baseDate.getMonth() + 1).padStart(2, "0")}${String(baseDate.getDate()).padStart(2, "0")}`;

  const gridCoords = dfs_xy_conv("toXY", latitude, longitude);
  console.log(`baseDate : ${formattedDate} base_time : ${baseTime} 격자 좌표: x=${gridCoords.x}, y=${gridCoords.y}`);

  try {
    const resp = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`,
      {
        params: {
          ServiceKey: "xYZ80mMcU8S57mCCY/q8sRsk7o7G8NtnfnK7mVEuVxdtozrl0skuhvNf34epviHrru/jiRQ41FokE9H4lK0Hhg==",
          pageNo: 1,
          numOfRows: 250,
          dataType: "JSON",
          base_date: formattedDate,
          base_time: baseTime,
          nx: gridCoords.x,
          ny: gridCoords.y,
          
        },
      }
    );
    return resp;
  } catch (error) {
     console.error("날씨 정보를 가져오는 데 실패했습니다:", error);
    return null;
  }
};
//날씨정보
function dfs_xy_conv(code, v1, v2) {
      //<!--
    //
    // LCC DFS 좌표변환을 위한 기초 자료
    //
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //


  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = re * sf / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
      rs['lat'] = v1;
      rs['lng'] = v2;
      var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
      ra = re * sf / Math.pow(ra, sn);
      var theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  }
  else {
      rs['x'] = v1;
      rs['y'] = v2;
      var xn = v1 - XO;
      var yn = ro - v2 + YO;
      ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) ra = - ra;
      var alat = Math.pow((re * sf / ra), (1.0 / sn));
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      if (Math.abs(xn) <= 0.0) {
          theta = 0.0;
      }
      else {
          if (Math.abs(yn) <= 0.0) {
              theta = Math.PI * 0.5;
              if (xn < 0.0) theta = - theta;
          }
          else theta = Math.atan2(xn, yn);
      }
      var alon = theta / sn + olon;
      rs['lat'] = alat * RADDEG;
      rs['lng'] = alon * RADDEG;
  }
  return rs;
}


const CCTVPopup = ({ lat, lon, hlsAddr, onClose }) => {

  const [weatherData,setWeatherData] = useState(null)
  const [iframeLoading, setIframeLoading] = useState(true); // iframe 로딩 상태 추가
  const weatherInfoRef = useRef(null); // 스크롤 컨테이너 참조

  


  //
  useEffect(()=>{
    const req=async()=>{
      try{
        const resp =  await fetchWeatherInfo(lat,lon);
        
        console.log("resp",);
        const groupedData = Array.from(resp.data.response.body.items.item).reduce((acc,item)=>{
          const key = `${item.fcstDate} - ${item.fcstTime}`;
            // 키가 이미 존재하는 경우 기존 배열에 추가, 그렇지 않으면 새 배열 생성
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        },{})

        //그루핑작업하기
        console.log('groupedData',groupedData);
        setWeatherData(groupedData);

      }catch(error){
        console.error(error);
      }

    };
    req();



  },[])


  return (
    <div className="cctv-popup-overlay">
      <div className="cctv-popup">
        <button style={{position:"absolute",right:"1px",top:"1px",width:"25px",height:"25px",borderRadius:"50%",fontSize:".8rem",backgroundColor:"#052563",color:"white"}} onClick={onClose} className="close-btn">X</button> {/* 닫기 버튼 */}
             
        {/* <div className="info">날씨 정보: {weatherData ? JSON.stringify(weatherData) : "날씨 정보 없음"}</div> */}
        
        <div className="show-data">
          <div className="left" >
            <div className="title" >
              <div style={{display:"flex",gap:"8px",alignItems : "center"}}>
                <img
                  style={{width:"20px",height:"20px",borderRadius:"50%"}} 
                  src={`${process.env.PUBLIC_URL}/images/1 기상청_한글_상하.jpg`} alt="-" 
                  />
                <span style={{fontSize:"1rem"}}>날씨 조회</span>
              </div>
            </div>

            <div className="weatherInfo" style={{overflow:"auto"}}>
              
              {weatherData ? ( // 조건부 렌더링으로 로딩 메시지 표시
                Object.entries(weatherData).map(([key, items], index) => (
                  
                  <div key={index} className="item" style={{margin:"2px"}} > {/* 고유 키 index 추가 */}
                    
                    <div style={{display:"flex",width:"100%",justifyContent:"space-between",borderBottom:"1px solid"}}>
                      <div style={{width:"100%"}}>
                        <div style={{backgroundColor:"#052563",color:"white",width:"100%",height:"100%",padding:"5px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                          {key.split('-')[0][4]}{key.split('-')[0][5]}
                          /
                          {key.split('-')[0][6]}{key.split('-')[0][7]}
                        </div>
                      </div>
                      <div style={{width:"100%"}}>
                        <div style={{backgroundColor:"rgb(255,255,255)",color:"black",width:"100%",height:"100%",padding:"5px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                            {key.split('-')[1][1]}{key.split('-')[1][2]}
                            :
                            {key.split('-')[1][3]}{key.split('-')[1][4]}
                        </div>
                      </div>
                    </div>
                   
                   
                    <div style={{position:"relative"}}>
                      <div style={{backgroundColor:"rgb(255,255,255)",color:"black",width:"100%",height:"100%",padding:"5px",display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <img src={`${process.env.PUBLIC_URL}/images/weather/NB01_N.png`} alt="Weather Icon" />
                        {items.map((item,index)=>{
                            return   item.category==="TMP" && <div style={{position:"absolute",top:"10%",right:"5%",fontWeight:"800",fontSize:"1rem"}}>{item.fcstValue} ℃</div> 
                        })}                       
                      </div>
                    </div>
                    


                    
                  </div>
                ))
              ) 
              : 
              (
                  // Bootstrap 스피너로 로딩 메시지 표시
                <div className="d-flex justify-content-center my-3" style={{width:"100%",height:"100%",backgroundColor:"white",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",position:"relative",top:"-25%"}}>
                  <span className="sr-only" style={{fontSize:"1.2rem",margin:"15px",color:"black",fontWeight:"300",fontWeight:"600"}}>Loading...</span>
                  <div className="spinner-border text-primary" role="status">
                  </div>
                </div>
              )}
             </div>
             
     
          </div>

          <div className="iframe-container right" style={{overflow:"auto"}}>
            {iframeLoading && ( // iframe 로딩 시 스피너 표시
              <div className="d-flex justify-content-center align-items-center" style={{width: "100%", height: "100%", backgroundColor: "white"}}>
                      <div className="spinner-border text-primary" role="status"></div>
              </div>
            )}
            <iframe
              src={hlsAddr}
              width="100%"
              height="100%"

              allow="autoplay; fullscreen"
              allowFullScreen
              onLoad={() => setIframeLoading(false)} // iframe이 로드되면 스피너 숨김
              style={{ display: iframeLoading ? "none" : "block",minHeight:"500px"}} // 로딩 중이면 숨김
            ></iframe>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default CCTVPopup;
