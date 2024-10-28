// CCTVPopup.js
import React from 'react';
import {useState,useEffect} from 'react';
import './CCTVPopup.scss';

const CCTVPopup = ({ lat, lon, hlsAddr, weatherData, onClose }) => {
  console.log("weatherData",weatherData);


  return (
    <div className="cctv-popup-overlay">
      <div className="cctv-popup">
        <button onClick={onClose} className="close-btn">X</button> {/* 닫기 버튼 */}
        <div className="header">CCTV 실시간 보기</div>
        {/* <div className="info">날씨 정보: {weatherData ? JSON.stringify(weatherData) : "날씨 정보 없음"}</div> */}
        
        <div className="show-data">
          <div className="left">
            <div className="title">
              <h5> 날씨조회</h5>
            </div>
            <div className="weatherInfo">
              <div className="items">
                  <div className="item">
                    
                  </div>
              </div>
              <div className="page">
                  <button>이전</button>
                  
                    {1 }&nbsp;
                  
                  <button>다음</button>
              </div>
            </div>

          </div>

          <div className="iframe-container right">
            <iframe
              src={hlsAddr}
              width="100%"
              height="100%"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default CCTVPopup;
