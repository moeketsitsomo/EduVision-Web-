'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { FileImage, FileText, FileVideo, Trash2, Copy, Upload, Search } from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type: string;
  category?: string | null;
  createdAt: string;
}

const ICONS: Record<string, typeof FileImage> = {
  IMAGE: FileImage,
  VIDEO: FileVideo,
  DOCUMENT: FileText,
  AUDIO: FileText,
  OTHER: FileText,
};

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      const res = await apiFetch(`/media?${params.toString()}`);
      setItems((await res.json()) as MediaItem[]);
      const catRes = await apiFetch('/media/categories');
      setCategories((await catRes.json()) as string[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, categoryFilter]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (category.trim()) formData.append('category', category.trim());

    try {
      await apiFetch('/media/upload', { method: 'POST', body: formData });
      toast.success('File uploaded');
      setCategory('');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file permanently?')) return;
    try {
      await apiFetch(`/media/${id}`, { method: 'DELETE' });
      toast.success('File deleted');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  const filtered = items.filter((item) =>
    item.originalName.toLowerCase().includes(search.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(search.toLowerCase()))
  );

  const renderPreview = (item: MediaItem) => {
    if (item.mimeType.startsWith('image/')) {
      return <img src={item.url} alt={item.originalName} loading="lazy" className="h-14 w-14 rounded object-cover" />;
    }
    if (item.mimeType.startsWith('video/')) {
      return (
        <video className="h-14 w-14 rounded object-cover" preload="metadata">
          <source src={item.url} type={item.mimeType} />
        </video>
      );
    }
    const Icon = ICONS[item.type] || FileText;
    return <Icon className="size-8 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <Input
            placeholder="Category (e.g. Sports, 2026 Events)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-64"
          />
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="size-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search by file name or category..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="IMAGE">Images</SelectItem>
                <SelectItem value="VIDEO">Videos</SelectItem>
                <SelectItem value="DOCUMENT">Documents</SelectItem>
                <SelectItem value="AUDIO">Audio</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">No files found.</p>
          )}
          {filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{renderPreview(item)}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.originalName}</TableCell>
                    <TableCell>{item.category || '—'}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{formatBytes(item.size)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon-sm" variant="ghost" onClick={() => copyUrl(item.url)}>
                        <Copy className="size-4" />
                      </Button>
                      <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
