export type TabButtonProps = {
  active: boolean;
  hasError?: boolean;
  icon: any;
  label: string;
  onClick: () => void;
  content: React.ReactElement;
};

export function TabButton({
  active,
  hasError,
  icon: Icon,
  label,
  onClick
}: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
        hasError
          ? active
            ? "border-red-500 text-red-400 bg-red-500/10 font-extrabold text-base"
            : "border-red-500/60 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm"
          : active
            ? "border-primary text-primary bg-primary/10 font-extrabold text-base"
            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium text-sm"
      }`}
    >
      {/* VS Code–style error dot */}
      {hasError && (
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}

      <Icon className={`w-4 h-4 ${hasError ? "text-red-400" : ""}`} />
      {label}

    </button>
  );
}