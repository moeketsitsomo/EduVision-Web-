import type { Metadata } from 'next';
import { fetchSite } from '@/lib/api';
import { schoolMetadata } from '@/lib/metadata';
import { PublicShell } from '@/components/public/public-shell';
import { PageHeader } from '@/components/public/page-header';
import { GalleryGrid } from '@/components/public/gallery-grid';
import { Card, CardContent } from '@/components/ui/card';
import { Images, Calendar, FolderOpen } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return schoolMetadata('Gallery', 'Browse our school photo and video galleries, events and memories.');
}

function getYear(gallery: any) {
  if (gallery.year) return String(gallery.year);
  if (gallery.createdAt) return new Date(gallery.createdAt).getFullYear().toString();
  return 'Other';
}

export default async function GalleryPage() {
  const site = await fetchSite();
  const { galleries } = site;

  const years = Array.from(new Set(galleries.map(getYear))).sort((a, b) => b.localeCompare(a));
  const hasItems = galleries.some((g) => Array.isArray(g.items) && g.items.length > 0);

  return (
    <PublicShell site={site}>
      <PageHeader title="Media Centre" subtitle="Moments from school life, sports, cultural activities and promotional videos." />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {galleries.length > 0 ? (
          <div className="space-y-16">
            {years.map((year) => {
              const yearGalleries = galleries.filter((g) => getYear(g) === year);
              return (
                <div key={year}>
                  <div className="flex items-center gap-3 mb-8">
                    <Calendar className="size-6 text-[var(--school-primary)]" />
                    <h2 className="text-2xl md:text-3xl font-bold">{year}</h2>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {yearGalleries.map((gallery) => (
                      <Card key={gallery.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                        {gallery.coverImageUrl && (
                          <div className="h-52 bg-muted/50 relative overflow-hidden">
                            <img src={gallery.coverImageUrl} alt={gallery.title} loading="lazy" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                              <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-90 mb-1">
                                <FolderOpen className="size-3" /> Album
                              </div>
                              <h3 className="font-bold text-xl">{gallery.title}</h3>
                            </div>
                          </div>
                        )}
                        <CardContent className="p-6">
                          {!gallery.coverImageUrl && (
                            <div className="flex items-center gap-2 mb-3 text-[var(--school-primary)]">
                              <FolderOpen className="size-5" />
                              <h3 className="font-bold text-xl">{gallery.title}</h3>
                            </div>
                          )}
                          {gallery.description && <p className="text-muted-foreground text-sm mb-4">{gallery.description}</p>}
                          <GalleryGrid items={(Array.isArray(gallery.items) ? gallery.items : []) as any[]} galleryTitle={gallery.title} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Images className="size-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">No galleries have been published yet.</p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
