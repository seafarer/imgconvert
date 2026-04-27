import { useState, useCallback, useRef } from "react";
import type { Area } from "react-easy-crop";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { presets } from "./presets";
import { loadImage, needsDownscale, downscaleImage, stemName } from "./utils/image";
import { cropAndExport, getFileExtension } from "./utils/crop";
import { UploadArea } from "./components/UploadArea";
import { CropPanel } from "./components/CropPanel";
import { ExportBar } from "./components/ExportBar";
import { DownscaleDialog } from "./components/DownscaleDialog";

type DownscalePrompt = {
  img: HTMLImageElement;
  file: File;
};

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [downscalePrompt, setDownscalePrompt] = useState<DownscalePrompt | null>(null);

  const cropAreas = useRef<Record<string, Area>>({});

  const handleCropComplete = useCallback((presetId: string, area: Area) => {
    cropAreas.current[presetId] = area;
  }, []);

  const finishLoad = useCallback((src: string, file: File, w: number, h: number) => {
    setImageSrc(src);
    setFileName(file.name);
    setImageDims({ w, h });
    cropAreas.current = {};
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const img = await loadImage(file);
      if (needsDownscale(img)) {
        setDownscalePrompt({ img, file });
        return;
      }
      finishLoad(img.src, file, img.naturalWidth, img.naturalHeight);
    },
    [finishLoad],
  );

  const handleDownscaleAccept = useCallback(async () => {
    if (!downscalePrompt) return;
    const { img, file } = downscalePrompt;
    const downscaledSrc = await downscaleImage(img);
    const downscaledImg = await loadImage(
      await fetch(downscaledSrc).then((r) => r.blob()).then((b) => new File([b], file.name, { type: "image/png" })),
    );
    finishLoad(downscaledSrc, file, downscaledImg.naturalWidth, downscaledImg.naturalHeight);
    setDownscalePrompt(null);
  }, [downscalePrompt, finishLoad]);

  const handleExport = useCallback(async () => {
    if (!imageSrc) return;
    setExporting(true);

    try {
      const zip = new JSZip();
      const ext = getFileExtension();
      const stem = stemName(fileName);

      await Promise.all(
        presets.map(async (preset) => {
          const area = cropAreas.current[preset.id];
          if (!area) return;
          const blob = await cropAndExport(imageSrc, area, preset);
          zip.file(`${stem}-${preset.suffix}.${ext}`, blob);
        }),
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${stem}.zip`);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Check the console for details.");
    } finally {
      setExporting(false);
    }
  }, [imageSrc, fileName]);

  const handleReset = useCallback(() => {
    setImageSrc(null);
    setFileName("");
    setImageDims(null);
    cropAreas.current = {};
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Image Crop & Export
          </h1>
          {imageSrc && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              New Image
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!imageSrc ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
            <p className="max-w-md text-center text-gray-500 dark:text-gray-400">
              Upload an image to crop it for Hero, Card, and Portrait sizes,
              then export all three to WebP format.
            </p>
            <UploadArea onFile={handleFile} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {fileName}
                </span>{" "}
                — {imageDims?.w} × {imageDims?.h}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {presets.map((preset) => (
                <CropPanel
                  key={preset.id}
                  imageSrc={imageSrc}
                  preset={preset}
                  sourceWidth={imageDims?.w ?? 0}
                  sourceHeight={imageDims?.h ?? 0}
                  onCropComplete={handleCropComplete}
                />
              ))}
            </div>

            <ExportBar
              exporting={exporting}
              onExport={handleExport}
              sourceName={fileName}
            />
          </div>
        )}
      </main>

      {downscalePrompt && (
        <DownscaleDialog
          width={downscalePrompt.img.naturalWidth}
          height={downscalePrompt.img.naturalHeight}
          onAccept={handleDownscaleAccept}
          onCancel={() => setDownscalePrompt(null)}
        />
      )}
    </div>
  );
}

export default App;
