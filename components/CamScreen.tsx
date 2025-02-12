"use client";
import NextImage from "next/image";
import { useRef, useState, useEffect } from "react";
const CamScreen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);

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

  // stop the media stream when the component is unmounted
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [mediaStream]);

  // convert the captured image to a file
  useEffect(() => {
    if (capturedImage) {
      urltoFile(capturedImage, "image.png", "image/png").then((file) => {
        setFileImage(file);
      });
    }
  }, [capturedImage]);

  /** Vẽ hình ảnh chụp đã chụp được lên canvas */
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
  };

  /** convert from base64 format to image file */
  const urltoFile = async (url: string, filename: string, mimeType: string) => {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new File([buf], filename, { type: mimeType });
  };

  /** Function to download the captured image as a file */
  const downloadImage = (fileImage: File) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(fileImage);
    link.download = fileImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSwitchCamera = (isFrontCamera: boolean) => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    }

    const exactFacingMode = isFrontCamera ? "environment" : "user";

    const enableVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: exactFacingMode },
            
          },
        });
        setMediaStream(stream);
      } catch (error) {
        console.error("Error accessing webcam", error);
      }
    };

    enableVideoStream();
  };

  return (
    <div className="flex flex-col md:flex-row justify-start items-center h-screen">
      <div className="flex-1 h-fit md:h-full flex flex-col gap-4 items-center justify-center border-2 border-red-500">
        <h1 className="text-2xl hidden md:block">Live</h1>
        <video ref={videoRef} autoPlay={true} />
      </div>
      <div className="hidden md:flex flex-1 h-min md:h-full flex-col gap-4 items-center justify-center border-2 border-green-500">
        <h1 className="text-2xl">Captured</h1>
        <canvas id="canvas" width="640" height="480"></canvas>
      </div>

      <div className="relative h-fit md:h-full w-full md:w-[200px] bg-gray-200 flex flex-row md:flex-col gap-8 p-4 justify-center items-center">
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
                setCapturedImage(dataUrl);

                drawCapturedImage(dataUrl);
              }
            }
          }}
          className="h-16 w-16 bg-red-500 rounded-full"
        ></button>
        <button
          className="h-16 w-16 bg-white rounded-full hidden md:flex justify-center items-center"
          onClick={() => {
            if (fileImage) {
              downloadImage(fileImage);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="black"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
            />
          </svg>
        </button>
        {capturedImage && (
          <button
            className="block md:hidden absolute top-[50% - 150px] left-6 h-16 w-16 bg-transparent"
            onClick={() => {
              if (fileImage) {
                downloadImage(fileImage);
              }
            }}
          >
            <NextImage
              src={capturedImage}
              alt="Captured"
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </button>
        )}
        {/* Switch-cam button */}
        <button
          className="h-16 w-16 bg-white rounded-full flex md:hidden justify-center items-center"
          onClick={() => {
            handleSwitchCamera(isFrontCamera);
            setIsFrontCamera(!isFrontCamera);
          }}
        >
          <svg
            className="w-6 h-6 text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CamScreen;
