'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ImageOff, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaItem {
  id?: string;
  url: string;
  type?: 'IMAGE' | 'VIDEO';
  caption?: string;
}

interface GalleryGridProps {
  items: any[];
  galleryTitle?: string;
}

function extractMedia(item: any): MediaItem | null {
  if (!item) return null;
  if (item.media && typeof item.media === 'object') {
    return { id: item.id, url: item.media.url, type: item.media.type, caption: item.caption || item.media.caption };
  }
  if (item.url) {
    return { id: item.id, url: item.url, type: item.type || 'IMAGE', caption: item.caption };
  }
  return null;
}

export function GalleryGrid({ items, galleryTitle }: GalleryGridProps) {
  const media = items.map(extractMedia).filter((m): m is MediaItem => !!m);
  const [index, setIndex] = useState<number | null>(null);

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i == null || i <= 0 ? media.length - 1 : i - 1));
  const next = () => setIndex((i) => (i == null ? 0 : (i + 1) % media.length));

  if (media.length === 0) {
    return <p className="text-muted-foreground">No photos or videos in this gallery yet.</p>;
  }

  const current = index != null ? media[index] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {media.map((m, i) => (
          <button
            key={m.id || i}
            onClick={() => setIndex(i)}
            className="relative aspect-square rounded-xl overflow-hidden group focus-visible:ring-2 ring-[var(--school-primary)]"
          >
            {m.type === 'VIDEO' ? (
              <>
                <video src={m.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" preload="metadata" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="size-10 text-white" />
                </div>
              </>
            ) : (
              <img src={m.url} alt={m.caption || ''} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            )}
            {m.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm truncate">{m.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={index != null} onOpenChange={close}>
        <DialogContent showCloseButton={false} className="max-w-4xl bg-black/95 border-none p-0 text-white">
          <DialogTitle className="sr-only">{galleryTitle || 'Gallery preview'}</DialogTitle>
          <DialogDescription className="sr-only">Image or video preview</DialogDescription>
          <div className="relative flex items-center justify-center min-h-[60vh]">
            <Button variant="ghost" size="icon-sm" onClick={close} className="absolute top-3 right-3 z-10 text-white hover:bg-white/20">
              <X className="size-5" />
            </Button>
            {current && (
              current.type === 'VIDEO' ? (
                <video src={current.url} controls autoPlay className="max-h-[80vh] max-w-full rounded-lg" />
              ) : (
                <img src={current.url} alt={current.caption || ''} className="max-h-[80vh] max-w-full rounded-lg" />
              )
            )}
            <Button variant="ghost" size="icon-sm" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20">
              <ChevronLeft className="size-6" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/20">
              <ChevronRight className="size-6" />
            </Button>
            {current?.caption && <p className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-center text-sm">{current.caption}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
