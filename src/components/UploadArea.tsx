import { useCallback, useRef, useState } from "react";
import { ACCEPTED_TYPES } from "../presets";

type Props = {
  onFile: (file: File) => void;
};

export function UploadArea({ onFile }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(
          `Unsupported file type. Please use JPEG, PNG, or WebP.`,
        );
        return;
      }
      onFile(file);
    },
    [onFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        mx-auto w-full max-w-xl cursor-pointer rounded-2xl border-2 border-dashed
        px-8 py-16 text-center transition-colors
        ${dragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-gray-500"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div className="mb-3 text-4xl opacity-40">📁</div>
      <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
        Drop an image here or click to browse
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        JPEG, PNG, or WebP
      </p>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
