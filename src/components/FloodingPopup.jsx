import React, { useState, useEffect, useRef } from "react";
import "./FloodingPopup.scss";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS import

const FloodingPopup = ({ lat, lon, hlsAddr, setSelectedFLOODING }) => {
  
  const [streamSrc, setStreamSrc] = useState("");
  const [server,setServer] = useState('http://localhost:5000');
  const [clientId,setClientId] = useState(null)
  
  // const [server,setServer] = useState('https://bumper-gig-mixer-crop.trycloudflare.com');
  useEffect(() => {
      const initializeStream = async () => {
        try {
          const response = await fetch(`${server}/stream?hlsAddr=${hlsAddr}`);
          const data = await response.json();
          if (response.ok) {
            setClientId(data.clientId);
            setStreamSrc(`${server}/stream-data?hlsAddr=${hlsAddr}&clientId=${data.clientId}`);
          } else {
            console.error("Error initializing stream:", data.error);
          }
        } catch (error) {
          console.error("Error initializing stream:", error);
        }
      };

    initializeStream();
  }, [hlsAddr, server]); // hlsAddr이 바뀔 때마다 실행



  const closeHandler = async () => {
    try {
      if (clientId) {
        await fetch(`${server}/stop-stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hlsAddr, clientId }),
        });
        console.log("Stream stopped successfully");
      }
      setSelectedFLOODING(null);
    } catch (error) {
      console.error("Failed to stop stream:", error);
    }
  };


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
          onClick={closeHandler}
          className="close-btn"
        >
          X
        </button>{" "}
        {/* 닫기 버튼 */}
        <div className="flooding-items" style={{ width: "100%", height: "100%" }}>
          
          <div className="grid-item">
              <div className="title" style={{height:"30px",lineHeight:"30px",}}>카메라 위치</div>
              <div className="video">
                    {/* <img
                        //src={hlsAddr}
                        //src="https://d6ce-35-197-94-123.ngrok-free.app/stream"
                        src={`http://localhost:5000/stream?hlsAddr=${hlsAddr}`}
                    /> */}

                  {streamSrc && ( // streamSrc가 설정된 경우만 렌더링
                    <img
                      src={streamSrc}
                      alt="Streaming Video"
                    />
                  )}
               </div>
          </div>
          <div className="grid-item">
              <div className="title" style={{height:"30px",lineHeight:"30px",}}>카메라 위치</div>
              <div className="video">
                    {/* <img
                        //src={hlsAddr}
                        //src="https://d6ce-35-197-94-123.ngrok-free.app/stream"
                        src={`http://localhost:5000/stream?hlsAddr=${hlsAddr}`}
                    /> */}

                  {streamSrc && ( // streamSrc가 설정된 경우만 렌더링
                    <img
                      src={streamSrc}
                      alt="Streaming Video"
                    />
                  )}
               </div>
          </div>
          <div className="grid-item">
              <div className="title" style={{height:"30px",lineHeight:"30px",}}>카메라 위치</div>
              <div className="video">
                    {/* <img
                        //src={hlsAddr}
                        //src="https://d6ce-35-197-94-123.ngrok-free.app/stream"
                        src={`http://localhost:5000/stream?hlsAddr=${hlsAddr}`}
                    /> */}

                  {streamSrc && ( // streamSrc가 설정된 경우만 렌더링
                    <img
                      src={streamSrc}
                      alt="Streaming Video"
                    />
                  )}
               </div>
          </div>
          <div className="grid-item">
              <div className="title" style={{height:"30px",lineHeight:"30px",}}>카메라 위치</div>
              <div className="video">
                    {/* <img
                        //src={hlsAddr}
                        //src="https://d6ce-35-197-94-123.ngrok-free.app/stream"
                        src={`http://localhost:5000/stream?hlsAddr=${hlsAddr}`}
                    /> */}

                  {streamSrc && ( // streamSrc가 설정된 경우만 렌더링
                    <img
                      src={streamSrc}
                      alt="Streaming Video"
                    />
                  )}
               </div>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default FloodingPopup;
