interface LoadingScreenProps {
  captureProgress?: { completed: number; total: number };
}

export function LoadingScreen({ captureProgress }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner */}
      <div className="w-10 h-10 border-3 border-gray-200 border-t-primary rounded-full animate-spin" />

      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold text-text-primary">
          Preparing your tabs...
        </h2>
        {captureProgress && captureProgress.total > 0 && (
          <p className="text-sm text-text-secondary">
            Capturing previews: {captureProgress.completed} /{" "}
            {captureProgress.total}
          </p>
        )}
      </div>
    </div>
  );
}
