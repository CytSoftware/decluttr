interface EmptyScreenProps {
  onClose: () => void;
}

export function EmptyScreen({ onClose }: EmptyScreenProps) {
  return (
    <div className="text-center space-y-4">
      <div className="text-5xl">&#10024;</div>
      <h1 className="text-2xl font-bold text-text-primary">
        Already decluttered!
      </h1>
      <p className="text-text-secondary text-sm max-w-xs">
        No tabs to review. Your browser is looking clean.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark text-sm font-medium transition-colors"
      >
        Close
      </button>
    </div>
  );
}
