import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import type { ImagePreset } from "../presets";

type Props = {
  imageSrc: string;
  preset: ImagePreset;
  onCropComplete: (presetId: string, croppedArea: Area) => void;
};

export function CropPanel({ imageSrc, preset, onCropComplete }: Props) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const aspect = preset.width / preset.height;

  const handleCropComplete = useCallback(
    (_croppedAreaPercent: Area, croppedAreaPixels: Area) => {
      onCropComplete(preset.id, croppedAreaPixels);
    },
    [onCropComplete, preset.id],
  );

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
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
        >
          Reset
        </button>
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
