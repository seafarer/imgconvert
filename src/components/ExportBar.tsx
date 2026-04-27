type Props = {
  exporting: boolean;
  onExport: () => void;
  sourceName: string;
};

export function ExportBar({ exporting, onExport, sourceName }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
        Source: <span className="font-medium text-gray-700 dark:text-gray-200">{sourceName}</span>
      </p>
      <button
        type="button"
        onClick={onExport}
        disabled={exporting}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {exporting ? (
          <>
            <Spinner />
            Exporting…
          </>
        ) : (
          "Export All as ZIP"
        )}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
