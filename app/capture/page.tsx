"use client";

import CamScreen from "@/components/CamScreen";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CapturePage() {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isCapturing) {
      setCapturedImage(localStorage.getItem("myPhoto"));
    }
  }, [isCapturing, capturedImage]);

  return isCapturing ? (
    <CamScreen setIsCapturing={setIsCapturing} />
  ) : (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1 className="text-2xl font-bold">Cheers!</h1>
      <div className="relative w-[340px] aspect-[3/4] border-2 border-black">
        {capturedImage && (
          <Image
            src={capturedImage.replace("data:image/jpeg;base64,:", "")}
            alt="my photo"
            layout="fill"
            objectFit="contain"
          />
        )}
      </div>
      <div className="w-[340px] flex justify-between items-center mt-4 gap-4">
        <button
          className="flex-1 p-1 bg-red-500 text-white"
          onClick={() => setIsCapturing(true)}
        >
          Capture
        </button>
        <button className="flex-1 p-1 border border-black">Upload</button>
      </div>
      <button
        className="w-[340px] p-1 border border-black mt-2"
        onClick={() => (window.location.href = "/review")}
      >
        Next
      </button>
    </div>
  );
}
