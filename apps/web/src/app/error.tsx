'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="size-10" />
        </div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message || 'We could not load this page. Please try again or contact support.'}</p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset}><RefreshCcw className="size-4 mr-2" /> Try again</Button>
        </div>
      </div>
    </div>
  );
}
