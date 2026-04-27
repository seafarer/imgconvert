import type { Area } from "react-easy-crop";
import { WEBP_QUALITY } from "../presets";
import type { ImagePreset } from "../presets";
import { supportsWebp } from "./image";

export async function cropAndExport(
  imageSrc: string,
  cropArea: Area,
  preset: ImagePreset,
): Promise<Blob> {
  const img = await loadImg(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = preset.width;
  canvas.height = preset.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    preset.width,
    preset.height,
  );

  const useWebp = supportsWebp();
  const mimeType = useWebp ? "image/webp" : "image/png";
  const quality = useWebp ? WEBP_QUALITY : undefined;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image blob"));
      },
      mimeType,
      quality,
    );
  });
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function getFileExtension(): string {
  return supportsWebp() ? "webp" : "png";
}
