"use client";

import { ShipWheel } from "lucide-react";

function SeatSkeleton({ delay = 0 }: { delay?: number; }) {
  return (
    <div className="relative flex h-22 w-18 flex-col items-center" style={{ animationDelay: `${delay}ms` }}>
      <div className="z-10 h-1.5 w-8 rounded-t-md bg-muted-foreground/20 skeleton-shimmer" />
      <div className="flex w-full flex-1 flex-col overflow-hidden rounded-lg border border-muted-foreground/10 bg-muted/20 skeleton-shimmer">
        <div className="h-3 w-full bg-muted-foreground/15" />
        <div className="flex flex-1 flex-col gap-1 p-1 pt-1.5">
          <div className="h-1.5 w-full rounded bg-muted-foreground/10" />
          <div className="h-1.5 w-3/4 rounded bg-muted-foreground/10" />
          <div className="mt-1 h-px w-full bg-muted-foreground/10" />
          <div className="h-1.5 w-full rounded bg-muted-foreground/10" />
          <div className="h-1.5 w-2/3 rounded bg-muted-foreground/10" />
        </div>
      </div>
      <div className="absolute top-6 -left-0.5 h-5 w-1 rounded-full bg-muted-foreground/15" />
      <div className="absolute top-6 -right-0.5 h-5 w-1 rounded-full bg-muted-foreground/15" />
    </div>
  );
}

function ColumnSkeleton({ colIndex, totalCols }: { colIndex: number; totalCols: number; }) {
  const isLast = colIndex === totalCols - 1;
  const baseDelay = colIndex * 60;

  if (isLast) {
    return (
      <div className="flex flex-col justify-center gap-1 border-r border-border pr-1">
        {[0, 1, 2, 3].map((i) => <SeatSkeleton key={i} delay={baseDelay + i * 30} />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-col gap-1">
        <SeatSkeleton delay={baseDelay} />
        <SeatSkeleton delay={baseDelay + 30} />
      </div>
      <div className="flex h-8 items-center justify-center text-[9px] font-mono text-muted-foreground/30">
        {colIndex + 1}
      </div>
      <div className="flex flex-col gap-1">
        <SeatSkeleton delay={baseDelay + 60} />
        <SeatSkeleton delay={baseDelay + 90} />
      </div>
    </div>
  );
}

interface VehicleLoadingSkeletonProps {
  columns?: number;
  showLogo?: boolean;
  logoSrc?: string;
}

export default function VehicleLoadingSkeleton({ columns = 10, showLogo = true, logoSrc }: VehicleLoadingSkeletonProps) {
  return (
    <div dir="rtl" className="w-full overflow-x-auto p-10 bg-background flex flex-col items-center gap-12">
      <style>
        {`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bus-breathe {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.85; transform: scaleY(0.995); }
        }
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            hsl(var(--muted)) 25%,
            hsl(var(--muted-foreground) / 0.15) 50%,
            hsl(var(--muted)) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.6s ease-in-out infinite;
        }
        .bus-breathe {
          animation: bus-breathe 2.4s ease-in-out infinite;
        }
        .wheel-spin {
          animation: wheel-spin 2s linear infinite;
        }
        .float-in {
          animation: float-in 0.5s ease-out both;
        }
      ` }
      </style>

      <div className="relative flex w-max min-w-130 flex-row rounded-[2.2rem] border-2 border-border bg-muted/30 p-4 shadow-xl bus-breathe">
        { /* Lights shimmer */}
        <div className="absolute -right-1 top-10 h-8 w-2 rounded-l-full bg-yellow-400/40 skeleton-shimmer" />
        <div className="absolute -right-1 bottom-10 h-8 w-2 rounded-l-full bg-yellow-400/40 skeleton-shimmer" />
        <div className="absolute -top-5 right-12 flex flex-col items-center">
          <div className="h-2 w-1 bg-gray-400/40" />
          <div className="h-4 w-6 rounded-t-sm bg-muted border border-muted-foreground/20" />
        </div>
        <div className="absolute -left-1 top-10 h-8 w-2 rounded-r-full bg-red-600/40 skeleton-shimmer" />
        <div className="absolute -left-1 bottom-10 h-8 w-2 rounded-r-full bg-red-600/40 skeleton-shimmer" />
        <div className="absolute -bottom-5 right-12 flex flex-col items-center">
          <div className="h-4 w-6 rounded-b-sm bg-muted border border-muted-foreground/20" />
          <div className="h-2 w-1 bg-gray-400/40" />
        </div>

        { /* Driver area */}
        <div className="ml-4 flex flex-col items-center justify-end border-l border-dashed border-border pl-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground/40 shadow-inner">
            <ShipWheel className="h-6 w-6 wheel-spin" />
          </div>
          <span className="mt-1 text-[10px] font-semibold text-muted-foreground/40">السائق</span>
        </div>

        { /* Columns */}
        <div className="flex flex-row gap-3">
          {Array.from({ length: columns }).map((_, i) => (
            <ColumnSkeleton key={i} colIndex={i} totalCols={columns} />
          ))}
        </div>

        { /* Wheels */}
        <div className="absolute -bottom-3 left-20 h-4 w-14 rounded-b-xl bg-neutral-900 dark:bg-gray-400" />
        <div className="absolute -bottom-3 right-24 h-4 w-14 rounded-b-xl bg-neutral-900 dark:bg-gray-400" />
        <div className="absolute -top-3 left-20 h-4 w-14 rounded-t-xl bg-neutral-900 dark:bg-gray-400" />
        <div className="absolute -top-3 right-24 h-4 w-14 rounded-t-xl bg-neutral-900 dark:bg-gray-400" />

        { /* Optional Logo Overlay */}
        {showLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-[2.2rem] overflow-hidden">
            <div className="flex flex-col items-center gap-2 bg-background/60 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-border float-in">
              {logoSrc
                ? <img src={logoSrc} alt="logo" className="h-10 w-auto opacity-80" />
                : (
                  <div className="flex items-center gap-2">
                    <ShipWheel className="h-7 w-7 text-primary wheel-spin" />
                    <span className="text-sm font-bold text-foreground/70 tracking-wide">جارٍ التحميل...</span>
                  </div>
                )}
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-primary/60"
                    style={{ animation: `shimmer 1.2s ease-in-out infinite`, animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      { /* Baby tickets skeleton */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground/30">
          <div className="h-4 w-4 rounded-full bg-muted skeleton-shimmer" />
          <div className="h-3 w-20 rounded bg-muted skeleton-shimmer" />
        </div>
        <div className="flex flex-wrap justify-center gap-6 p-6 rounded-2xl border-2 border-dashed border-border bg-muted/5 min-w-75">
          {[0, 1, 2].map((i) => <SeatSkeleton key={i} delay={i * 80} />)}
        </div>
      </div>
    </div>
  );
}
