"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { downloadImage, urltoFile } from "@/lib/utils";

export default function ReviewPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [fileImage, setFileImage] = useState<File | null>(null);

  // get the captured image from the local storage
  // and convert it to a file
  useEffect(() => {
    setCapturedImage(localStorage.getItem("myPhoto"));
    if (capturedImage) {
      urltoFile(capturedImage, "image.png", "image/png").then((file) => {
        setFileImage(file);
      });
    }
  }, [capturedImage]);

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1 className="text-2xl font-bold">Result</h1>
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
          className="flex-1 p-1 border border-black"
          onClick={() => (window.location.href = "/")}
        >
          Go home
        </button>
        <button
          className="flex-1 p-1 border border-black"
          onClick={() => fileImage && downloadImage(fileImage)}
        >
          Save the photo
        </button>
      </div>
    </div>
  );
}
