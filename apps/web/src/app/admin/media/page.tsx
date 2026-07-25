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
import { toast } from 'sonner';
import { FileImage, FileText, FileVideo, Trash2, Copy, Upload } from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type: string;
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

function getPreviewUrl(url: string, mimeType: string) {
  if (mimeType.startsWith('image/')) return url;
  return null;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/media');
      setItems((await res.json()) as MediaItem[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiFetch('/media/upload', { method: 'POST', body: formData });
      toast.success('File uploaded');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
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
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && items.length === 0 && (
            <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
          )}
          {items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const Icon = ICONS[item.type] || FileText;
                  const preview = getPreviewUrl(item.url, item.mimeType);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        {preview ? (
                          <img src={preview} alt={item.originalName} loading="lazy" className="h-12 w-12 rounded object-cover" />
                        ) : (
                          <Icon className="size-8 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{item.originalName}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{formatBytes(item.size)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-primary underline truncate">
                          {item.url}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon-sm" variant="ghost" onClick={() => copyUrl(item.url)}>
                          <Copy className="size-4" />
                        </Button>
                        <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
