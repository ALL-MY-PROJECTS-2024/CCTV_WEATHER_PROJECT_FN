import React, { useState, useEffect, useRef } from "react";
import "./FloodingPopup.scss";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS import

const FloodingPopup = ({ lat, lon, hlsAddr, onClose }) => {
  const [iframeLoading, setIframeLoading] = useState(true); // iframe 로딩 상태 추가
  const [skyIcon, setSkyIcon] = useState();

  console.log("hlsAddr", hlsAddr);
  return (
    <div className="flooding-popup-overlay">
      <div className="flooding-popup">
        <button
          style={{
            position: "absolute",
            right: "10px",
            top: "2px",
            width: "25px",
            height: "25px",
            borderRadius: "50%",
            fontSize: ".8rem",
            backgroundColor: "#052563",
            color: "white",
          }}
          onClick={onClose}
          className="close-btn"
        >
          X
        </button>{" "}
        {/* 닫기 버튼 */}
        <div className="flooding-items" style={{ width: "100%", height: "100%" }}>
          <div className="grid-item">
                <div className="video">
                    <div className="title" style={{height:"30px",lineHeight:"30px",}}>카메라 위치</div>
                    <iframe
                        //src={hlsAddr}
                        src="https://d6ce-35-197-94-123.ngrok-free.app/stream"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        style={{
                          // border: "1px solid red",
                          width: "100%", // 필요에 따라 크기 조정
                          height: "calc(100% - 30px)",
                          display:"flex",
                          justifyContent:"center",
                          alignItems : "center",
                          objectFit:"center",
                          paddingLeft:"12px",
                          paddingTop:"12px",

                        }}
                    />
               </div>
              
          </div>
          <div className="grid-item">
            <div className="title" style={{height:"30px",lineHeight:"30px"}}>10분 뒤 예측이미지</div>
            <div>
                TTT
            </div>
          </div>
          <div className="grid-item">
            <div className="title" style={{height:"30px",lineHeight:"30px"}}>30분 뒤 예측이미지</div>
            <div>
                TTT
            </div>
          </div>
          <div className="grid-item">
            <div className="title" style={{height:"30px",lineHeight:"30px"}}>1시간 뒤 예측이미지</div>
            <div>
                TTT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloodingPopup;
