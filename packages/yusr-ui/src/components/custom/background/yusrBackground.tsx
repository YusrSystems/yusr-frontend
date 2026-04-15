export function YusrBusBackground()
{
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-background transition-colors duration-500">
      <div className="absolute inset-0">
        <div className="absolute -top-[10%] left-[15%] h-150 w-150 rounded-full 
                   bg-primary/10 blur-[120px] 
                   dark:bg-primary/10 dark:blur-[120px]" />
        <div className="absolute top-[30%] -right-[5%] h-125 w-125 rounded-full 
                   bg-primary/10 blur-[100px] 
                   dark:primary/5 dark:blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-175 w-175 rounded-full 
                   bg-primary/5 blur-[150px] 
                   dark:bg-primary/5 dark:blur-[150px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.05]"
        style={ {
          backgroundImage:
            `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
          backgroundSize: "45px 45px"
        } }
      />

      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M0 200 L1000 200"
          stroke="url(#line-grad)"
          strokeWidth="1"
          fill="none"
          className="text-indigo-500 dark:text-primary"
        />
        <path
          d="M0 600 L1000 600"
          stroke="url(#line-grad)"
          strokeWidth="1"
          fill="none"
          className="text-indigo-500 dark:text-primary"
        />

        <circle cx="20%" cy="30%" r="1.5" className="fill-indigo-500/30 dark:fill-primary/20" />
        <circle cx="80%" cy="40%" r="2" className="fill-blue-500/30 dark:fill-primary/30" />
      </svg>

      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={ {
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        } }
      />
    </div>
  );
}
