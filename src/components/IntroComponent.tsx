"use client";

import React, { useRef, useState } from "react";
import { Button } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

const IntroComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [checkingPauseVideo, setCheckingPauseVideo] = useState(false);
  const handleClick = () => {
    if (videoRef.current) {
      if (!checkingPauseVideo) {
        videoRef.current.pause();
        setCheckingPauseVideo(true);
      } else {
        videoRef.current.play();
        setCheckingPauseVideo(false);
      }
    }
  };
  return (
    <div
      className="position-relative"
      style={{ height: "100vh", borderRadius: "20px", overflow: "hidden" }}
    >
      <div className="overlay"></div>
      <video
        ref={videoRef}
        className="w-100 h-100"
        src={require("../../public/WorkManagement.mp4")}
        autoPlay
        loop
        muted
        style={{ borderRadius: "20px" }}
      />
      <Button
        className="position-absolute bottom-0 start-0 mb-4"
        icon={
          checkingPauseVideo === true ? (
            <PlayCircleOutlined
              style={{
                color: "gray",
                marginLeft: "30px",
                fontSize: "50px",
              }}
            />
          ) : (
            <PauseCircleOutlined
              style={{ color: "gray", marginLeft: "30px", fontSize: "50px" }}
            />
          )
        }
        shape="circle"
        size="large"
        onClick={handleClick}
        style={{
          backgroundColor: "transparent",
          border: "none",
        }}
      />
    </div>
  );
};

export default IntroComponent;
