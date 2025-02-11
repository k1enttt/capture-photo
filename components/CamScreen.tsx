"use client";
import { useRef, useState, useEffect } from "react";
const CamScreen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // const sendVideoData = (data: string) => {
  //   socket.emit("videoData", data);
  // };

  // ask permission from the user to open the webcam
  useEffect(() => {
    const enableVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setMediaStream(stream);
      } catch (error) {
        console.error("Error accessing webcam", error);
      }
    };

    enableVideoStream();
  }, []);

  // update the variables and store the media stream on it
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [videoRef, mediaStream]);
  
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [mediaStream]);

  /**
   * Vẽ hình ảnh chụp đã chụp được lên canvas
   *  */ 
  const drawCapturedImage = (dataUrl: string) => {
    const capturedImage = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;
    const capturedImageContext = capturedImage.getContext("2d");
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      if (capturedImageContext) {
        capturedImageContext.drawImage(
          img,
          0,
          0,
          capturedImage.width,
          capturedImage.height
        );
        capturedImage.style.display = "block";
      }
    };
  }



  return (
    <div className="flex justify-start items-center h-screen">
      <video ref={videoRef} autoPlay={true} />
      <canvas
        id="canvas"
        width="640"
        height="480"
        className=""
      ></canvas>
      <div className="fixed top-0 right-0 h-screen w-[200px] bg-white/50 flex justify-center items-center">
        <button
          onClick={() => {
            if (videoRef.current) {
              const canvas = document.createElement("canvas");
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              const context = canvas.getContext("2d");
              if (context) {
                context.drawImage(
                  videoRef.current,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                const dataUrl = canvas.toDataURL("image/png");

                drawCapturedImage(dataUrl);
              }
            }
          }}
          className="p-8 bg-red-500 rounded-full"
        ></button>
      </div>
    </div>
  );
};

export default CamScreen;
