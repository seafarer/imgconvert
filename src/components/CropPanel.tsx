import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { saveAs } from "file-saver";
import type { ImagePreset } from "../presets";
import { cropAndExport, getFileExtension } from "../utils/crop";

type Props = {
  imageSrc: string;
  preset: ImagePreset;
  fileStem: string;
  sourceWidth: number;
  sourceHeight: number;
  onCropComplete: (presetId: string, croppedArea: Area) => void;
};

export function CropPanel({ imageSrc, preset, fileStem, sourceWidth, sourceHeight, onCropComplete }: Props) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const latestCropArea = useRef<Area | null>(null);

  const aspect = preset.width / preset.height;
  const willUpscale = sourceWidth < preset.width || sourceHeight < preset.height;

  const handleCropComplete = useCallback(
    (_croppedAreaPercent: Area, croppedAreaPixels: Area) => {
      latestCropArea.current = croppedAreaPixels;
      onCropComplete(preset.id, croppedAreaPixels);
    },
    [onCropComplete, preset.id],
  );

  const handleDownload = useCallback(async () => {
    if (!latestCropArea.current) return;
    setDownloading(true);
    try {
      const blob = await cropAndExport(imageSrc, latestCropArea.current, preset);
      const ext = getFileExtension();
      saveAs(blob, `${fileStem}-${preset.suffix}.${ext}`);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [imageSrc, preset, fileStem]);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {preset.label}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {preset.width} × {preset.height}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            title="Download this crop"
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
              <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative" style={{ aspectRatio: `${aspect}`, minHeight: 200 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          showGrid={false}
        />
      </div>

      {willUpscale && (
        <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Source is {sourceWidth} × {sourceHeight} — output will be upscaled
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
          Zoom
        </span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600 dark:bg-gray-600"
        />
      </div>
    </div>
  );
}
