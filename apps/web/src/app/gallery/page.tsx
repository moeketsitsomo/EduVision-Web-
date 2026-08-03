import { fetchSite } from '@/lib/api';
import { PublicShell } from '@/components/public/public-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageOff } from 'lucide-react';

export default async function GalleryPage() {
  const site = await fetchSite();
  const { galleries } = site;

  return (
    <PublicShell site={site}>
      <section className="bg-[var(--school-primary)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Photo Gallery</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">Moments from school life, sports and cultural activities.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        {galleries.length > 0 ? (
          galleries.map((gallery) => (
            <div key={gallery.id}>
              <h2 className="text-2xl font-bold mb-2">{gallery.title}</h2>
              {gallery.description && <p className="text-muted-foreground mb-4">{gallery.description}</p>}
              {Array.isArray(gallery.items) && gallery.items.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(gallery.items as any[]).map((item: any, i: number) => (
                    <Card key={item.id || i} className="overflow-hidden group">
                      {item.media?.url ? (
                        <div className="relative aspect-square">
                          <img src={item.media.url} alt={item.caption || ''} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          {item.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <p className="text-white text-sm truncate">{item.caption}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <CardContent className="flex items-center justify-center aspect-square text-muted-foreground"><ImageOff className="size-8" /></CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No photos in this gallery yet.</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No galleries have been published yet.</p>
        )}
      </section>
    </PublicShell>
  );
}
