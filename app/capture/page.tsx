"use client";

import CamScreen from "@/components/CamScreen";
import Image from "next/image";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";

export default function CapturePage() {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isCapturing) {
      setCapturedImage(localStorage.getItem("myPhoto"));
    }
  }, [isCapturing]);

  const handleUpload: ChangeEventHandler<HTMLInputElement> = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        localStorage.setItem("myPhoto", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
            fill
            className="object-contain"
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
        <label
          htmlFor="image-upload"
          className="flex-1 text-center p-1 border border-black cursor-pointer"
        >
          Upload
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
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
