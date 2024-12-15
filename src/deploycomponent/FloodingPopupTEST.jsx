import React, { useState, useEffect } from "react";
import "./FloodingPopupTEST.scss";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS import

const FloodingPopupTEST = ({ hlsAddr, setSelectedFLOODING,instl_pos }) => {
  const [streamSrc, setStreamSrc] = useState("");
  const [streamId, setStreamId] = useState(""); // Added to manage streamId
  const [server] = useState("http://localhost:5000");

  console.log(instl_pos)
  useEffect(() => {
    // Fetch the stream ID when the component mounts
    const fetchStreamId = async () => {
      try {
        const response = await axios.get(`${server}/stream-id`, {
          params: { hlsAddr },
        });
        const { streamId } = response.data;
        setStreamId(streamId);
        setStreamSrc(`${server}/stream/${streamId}?hlsAddr=${hlsAddr}`);
      } catch (error) {
        console.error("Failed to fetch stream ID:", error);
      }
    };

    fetchStreamId();
  }, []);

  const closeHandler = async () => {
    // Stop the stream using the stream ID
    try {
      if (streamId) {
        await axios.post(`${server}/stop-stream`, { streamId });
        console.log("Stream stopped successfully");
      }
      setSelectedFLOODING(null); // Close the popup
    } catch (error) {
      console.error("Failed to stop stream:", error);
    }
  };

  return (


    <div className="flooding-popup-overlay" 
      style={{backgroundColor:"",position:"relative",left:'0',top:"70px",width:"100%",minWidth:"300px",height:"80%",minHeight:"200px",overflow:"hidden"}}
    >

        <div style={{position:"absolute",left:"10px",height:"30px",top:"0px",width:"50px",zIndex:"999"}}>
                <div style={{display:"flex",width:"80px",color:"white",alignItems:"center",height:"100%"}}>
                    <span class="material-symbols-outlined" style={{fontSize:"1.5rem",color:"#40FF00"}}>notifications</span>
                    <span style={{fontSize:".8rem"}}>안전</span>    
                </div>

                
        </div>
              
      <div className="flooding-popup" style={{height:"100%",width:"100%",position:"relative",top:"20px"}}>

        <div className="flooding-items"  style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",width:"100%",position:"relative",top:"0px" ,margin:"0"}} >
          <div className="grid-item "  style={{height:"100%",width:"100%" ,}}>
            
            <div className="title" style={{position:"absolute",left:"0",top:"0", height:"30px",width:"100%",backgroundColor:"transparent",color:""}} >
              <span style={{position:"absolute",left:"5px",top:"5px",zIndex:"999",fontSize:"1.5rem",color:"white"}}>제목</span>
              <button
                onClick={closeHandler}
                className="close-btn"
                style={{zIndex:"999",backgroundColor:"",fontSize:"1rem",position:"absolute",right:'5px',top:"5px",width:"30px",height:"30px"}}
              >
                X
              </button>
            </div>

            <div className="video" style={{width:"100%",height:"100%"}} >
              {streamSrc && (
                <img
                  src={streamSrc}
                  alt="Streaming Video"
                  style={{width:"100%",height:"100%",objectFit:"contain"}}
                />
              )
             
            }
            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default FloodingPopupTEST;
