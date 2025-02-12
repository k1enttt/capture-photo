"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ReviewPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    setCapturedImage(localStorage.getItem("myPhoto"));
  }, []);

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1 className="text-2xl font-bold">Result</h1>
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
          className="flex-1 p-1 border border-black"
          onClick={() => (window.location.href = "/")}
        >
          Go home
        </button>
        <button className="flex-1 p-1 border border-black">
          Get the photo
        </button>
      </div>
    </div>
  );
}
