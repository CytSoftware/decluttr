interface ExcludedNoticeProps {
  count: number;
}

export function ExcludedNotice({ count }: ExcludedNoticeProps) {
  return (
    <div className="text-xs text-text-muted bg-gray-50 px-3 py-1.5 rounded-full">
      {count} pinned/system tab{count !== 1 ? "s" : ""} excluded
    </div>
  );
}
