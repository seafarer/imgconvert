import { DOWNSCALE_TARGET, MAX_SOURCE_DIMENSION } from "../presets";

type Props = {
  width: number;
  height: number;
  onAccept: () => void;
  onCancel: () => void;
};

export function DownscaleDialog({ width, height, onAccept, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Image Too Large
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          This image is{" "}
          <span className="font-medium">{width} × {height}</span> pixels, which
          exceeds the {MAX_SOURCE_DIMENSION}px limit. Would you like to downscale
          it to a max dimension of {DOWNSCALE_TARGET}px?
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Downscale & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
