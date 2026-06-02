export default function LoginFormSkeleton()
{
  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 animate-pulse w-full">
      { /* Back Link Skeleton */ }
      <div className="h-4 w-24 bg-muted rounded mb-4"></div>

      { /* Title & Subtitle Skeleton */ }
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-4 w-64 bg-muted rounded"></div>
      </div>

      { /* Input Fields Skeletons */ }
      <div className="flex flex-col gap-4">
        <div className="h-10 w-full bg-muted rounded"></div>
        <div className="h-10 w-full bg-muted rounded"></div>
        <div className="h-10 w-full bg-muted rounded"></div>
      </div>

      { /* Checkbox Skeleton */ }
      <div className="h-4 w-32 bg-muted rounded mt-2"></div>

      { /* Button Skeleton */ }
      <div className="h-10 w-full bg-muted rounded mt-4"></div>
    </div>
  );
}
