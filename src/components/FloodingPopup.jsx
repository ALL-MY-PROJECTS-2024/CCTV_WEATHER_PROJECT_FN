import React, { useState, useEffect, useRef } from 'react';
import './FloodingPopup.scss';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS import


const FloodingPopup = ({ lat, lon, hlsAddr, onClose })=>{
    const [iframeLoading, setIframeLoading] = useState(true); // iframe 로딩 상태 추가
    const [skyIcon,setSkyIcon] = useState();

    console.log("hlsAddr",hlsAddr);
    return (

        <div  className="flooding-popup-overlay">
            <div className="flooding-popup">
                <button style={{position:"absolute",right:"10px",top:"2px",width:"25px",height:"25px",borderRadius:"50%",fontSize:".8rem",backgroundColor:"#052563",color:"white"}} onClick={onClose} className="close-btn">X</button> {/* 닫기 버튼 */}


                <div className="flooding-items" style={{width:"100%",height:"100%"}}>
                    <div className="grid-item">
                        <table style={{width:"100%",height:"100%"}}>
                            <tr>
                                <td colSpan={2} style={{height:"30px"}}>1.현장이름</td>
                                {/* <td>2</td> */}
                            </tr>
                            <tr>
                                <td>
                                    <div className="video">
                                        <iframe
                                        src={hlsAddr}
                                        width="100%"
                                        height="100%"

                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        onLoad={() => {}} 
                                        style={{
                                            transform: "scale(0.5)", // 배율 축소
                                            transformOrigin: "top left", // 배율 적용 기준점
                                            width: "100vw", // 축소된 배율 보정 (100% / 0.8)
                                            height: "200%", // 축소된 배율 보정 (100% / 0.8)
                                            border: "none",
                                        }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div  className="forecast">침수예측이미지</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="grid-item">
                        <table style={{width:"100%",height:"100%"}}>
                            <tr>
                                <td colSpan={2} style={{height:"30px"}}>1.현장이름</td>
                                {/* <td>2</td> */}
                            </tr>
                            <tr>
                                <td>
                                    <div className="video">
                                        <iframe
                                        src={hlsAddr}
                                        width="100%"
                                        height="100%"

                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        onLoad={() => {}} 
                                        style={{
                                            transform: "scale(0.5)", // 배율 축소
                                            transformOrigin: "top left", // 배율 적용 기준점
                                            width: "100vw", // 축소된 배율 보정 (100% / 0.8)
                                            height: "200%", // 축소된 배율 보정 (100% / 0.8)
                                            border: "none",
                                        }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div  className="forecast">침수예측이미지</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="grid-item">
                        <table style={{width:"100%",height:"100%"}}>
                            <tr>
                                <td colSpan={2} style={{height:"30px"}}>1.현장이름</td>
                                {/* <td>2</td> */}
                            </tr>
                            <tr>
                                <td>
                                    <div className="video">
                                        <iframe
                                        src={hlsAddr}
                                        width="100%"
                                        height="100%"

                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        onLoad={() => {}} 
                                        style={{
                                            transform: "scale(0.5)", // 배율 축소
                                            transformOrigin: "top left", // 배율 적용 기준점
                                            width: "100vw", // 축소된 배율 보정 (100% / 0.8)
                                            height: "200%", // 축소된 배율 보정 (100% / 0.8)
                                            border: "none",
                                        }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div  className="forecast">침수예측이미지</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="grid-item">
                        <table style={{width:"100%",height:"100%"}}>
                            <tr>
                                <td colSpan={2} style={{height:"30px"}}>1.현장이름</td>
                                {/* <td>2</td> */}
                            </tr>
                            <tr>
                                <td>
                                    <div className="video">
                                        <iframe
                                        src={hlsAddr}
                                        width="100%"
                                        height="100%"

                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        onLoad={() => {}} 
                                        style={{
                                            transform: "scale(0.5)", // 배율 축소
                                            transformOrigin: "top left", // 배율 적용 기준점
                                            width: "100vw", // 축소된 배율 보정 (100% / 0.8)
                                            height: "200%", // 축소된 배율 보정 (100% / 0.8)
                                            border: "none",
                                        }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div  className="forecast">침수예측이미지</div>
                                </td>
                            </tr>
                        </table>
                    </div>

                </div>


            </div>
           
        </div>
    )

}


export default FloodingPopup;
