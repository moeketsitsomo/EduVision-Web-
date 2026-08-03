import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <SearchX className="size-10" />
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">Sorry, we could not find the page you were looking for.</p>
        <div className="flex justify-center gap-3">
          <Button asChild><Link href="/"><Home className="size-4 mr-2" /> Back to home</Link></Button>
        </div>
      </div>
    </div>
  );
}
