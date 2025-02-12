/** Function to download the captured image as a file */
export const downloadImage = (fileImage: File) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(fileImage);
  link.download = fileImage.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/** convert from base64 format to image file */
export const urltoFile = async (
  url: string,
  filename: string,
  mimeType: string
) => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
};

/** Vẽ hình ảnh chụp đã chụp được lên canvas */
export const drawCapturedImage = (dataUrl: string) => {
  const capturedImage = document.getElementById("canvas") as HTMLCanvasElement;
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
