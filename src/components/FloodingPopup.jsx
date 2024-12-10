import React, { useState, useEffect } from "react";
import "./FloodingPopup.scss";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS import

const FloodingPopup = ({ hlsAddr, setSelectedFLOODING }) => {
  const [streamSrc, setStreamSrc] = useState("");
  const [streamId, setStreamId] = useState(""); // Added to manage streamId
  const [server] = useState("http://localhost:5000");

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
  }, [hlsAddr, server]);

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
        </button>
        <div className="flooding-items" style={{ width: "100%", height: "100%" }}>
          <div className="grid-item">
            <div className="title" style={{ height: "30px", lineHeight: "30px" }}>
              카메라 위치
            </div>
            <div className="video">
              {streamSrc && (
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
