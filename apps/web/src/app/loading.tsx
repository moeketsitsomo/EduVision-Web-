import { Loader2, GraduationCap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center animate-pulse">
          <GraduationCap className="size-8" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm font-medium">Loading EduVision...</span>
        </div>
      </div>
    </div>
  );
}
