import React from "react";
import "./styles.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import { drawKeypoints, drawSkeleton } from "./utilities";
export default function App() {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const detectWebcamFeed = async (posenet_model) => {
    if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
      // Get Video Properties
      const video = videoRef.current;
      video.play();
      const videoWidth = video.width;
      const videoHeight = video.height;
      console.log(video.width);
      const pose = await posenet_model.estimateSinglePose(video);
      drawResult(pose, videoWidth, videoHeight);
    }
  };
  const runPosenet = async () => {
    const posenet_model = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    setInterval(() => {
      detectWebcamFeed(posenet_model);
    }, 100);
  };
  runPosenet();
  const drawResult = (pose, videoWidth, videoHeight) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    console.log(canvas.width);
    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };
  return (
    <div className="App">
      <header className="App-header">
        <video
          ref={videoRef}
          loop={true}
          src="./HowToLiftGood.mp4"
          height={360}
          width={640}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 360,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            top: 10,
            textAlign: "center",
            zindex: 10,
            width: 640,
            height: 360,
          }}
        />
      </header>
    </div>
  );
}
