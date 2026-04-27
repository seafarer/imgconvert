import { DOWNSCALE_TARGET, MAX_SOURCE_DIMENSION } from "../presets";

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function needsDownscale(img: HTMLImageElement): boolean {
  return img.naturalWidth > MAX_SOURCE_DIMENSION || img.naturalHeight > MAX_SOURCE_DIMENSION;
}

export function downscaleImage(img: HTMLImageElement): Promise<string> {
  const { naturalWidth: w, naturalHeight: h } = img;
  const scale = DOWNSCALE_TARGET / Math.max(w, h);
  const nw = Math.round(w * scale);
  const nh = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = nw;
  canvas.height = nh;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, nw, nh);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(URL.createObjectURL(blob!));
      },
      "image/png",
    );
  });
}

export function supportsWebp(): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

export function stemName(filename: string): string {
  return filename.replace(/\.[^.]+$/, "").replace(/\s+/g, "-");
}
