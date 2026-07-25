'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HealthCheck {
  status: 'ok' | 'error' | 'warning' | 'skipped';
  [key: string]: any;
}

interface HealthData {
  status: string;
  timestamp: string;
  checks: Record<string, HealthCheck>;
}

interface StorageData {
  totalMb: number;
  schoolUsage: Array<{
    schoolId: string;
    schoolName: string;
    schoolSlug?: string;
    fileCount: number;
    totalMb: number;
    maxStorageMb: number;
    usedPercent: number;
  }>;
  typeUsage: Array<{ type: string; fileCount: number; totalMb: number }>;
}

interface BackupData {
  status: string;
  totalBackups: number;
  totalSizeMb: number;
  lastBackup: string | null;
  lastBackupAgeHours: number | null;
  backups: Array<{ name: string; sizeMb: number; createdAt: string }>;
  message?: string;
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [storage, setStorage] = useState<StorageData | null>(null);
  const [backups, setBackups] = useState<BackupData | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [healthRes, storageRes, backupsRes] = await Promise.all([
        apiFetch('/health/detailed'),
        apiFetch('/super-admin/storage'),
        apiFetch('/super-admin/backups'),
      ]);
      setHealth(await healthRes.json());
      setStorage(await storageRes.json());
      setBackups(await backupsRes.json());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statusClass = (status: string) => {
    if (status === 'ok') return 'text-green-600';
    if (status === 'warning') return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Health</h1>
        <Button onClick={load} disabled={loading} variant="outline">
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {health && (
        <Card>
          <CardHeader>
            <CardTitle className={statusClass(health.status)}>
              Status: {health.status.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Checked at: {new Date(health.timestamp).toLocaleString()}</p>
            {Object.entries(health.checks).map(([name, check]) => (
              <div key={name} className="border rounded p-2">
                <p className="font-semibold capitalize">
                  {name}: <span className={statusClass(check.status)}>{check.status}</span>
                </p>
                {check.usedPercent !== undefined && (
                  <p>Used: {check.usedPercent}%</p>
                )}
                {check.availableBytes !== undefined && (
                  <p>
                    Available: {(check.availableBytes / 1024 / 1024 / 1024).toFixed(2)} GB /{' '}
                    {(check.totalBytes / 1024 / 1024 / 1024).toFixed(2)} GB
                  </p>
                )}
                {check.message && <p className="text-muted-foreground">{check.message}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {storage && (
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <p className="font-semibold">Total: {storage.totalMb.toFixed(2)} MB</p>
            <div>
              <p className="font-semibold mb-2">By School</p>
              <div className="space-y-2">
                {storage.schoolUsage.map((s) => (
                  <div key={s.schoolId || s.schoolName} className="border rounded p-2">
                    <p className="font-medium">{s.schoolName}</p>
                    <p>
                      {s.fileCount} files · {s.totalMb.toFixed(2)} MB / {s.maxStorageMb} MB (
                      {s.usedPercent}%)
                    </p>
                    <div className="w-full bg-muted rounded h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded"
                        style={{ width: `${Math.min(s.usedPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">By Type</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {storage.typeUsage.map((t) => (
                  <div key={t.type} className="border rounded p-2 text-center">
                    <p className="font-medium">{t.type}</p>
                    <p>
                      {t.fileCount} · {t.totalMb.toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {backups && (
        <Card>
          <CardHeader>
            <CardTitle className={statusClass(backups.status)}>
              Backups: {backups.status.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>Total backups: {backups.totalBackups}</p>
            <p>Total backup size: {backups.totalSizeMb.toFixed(2)} MB</p>
            <p>
              Last backup:{' '}
              {backups.lastBackup
                ? `${new Date(backups.lastBackup).toLocaleString()} (${
                    backups.lastBackupAgeHours !== null
                      ? `${backups.lastBackupAgeHours.toFixed(1)} hours ago`
                      : 'unknown'
                  })`
                : 'Never'}
            </p>
            {backups.backups.length > 0 && (
              <div className="border rounded overflow-hidden mt-2">
                <table className="min-w-full text-left">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Size (MB)</th>
                      <th className="p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.backups.slice(0, 10).map((b) => (
                      <tr key={b.name} className="border-t">
                        <td className="p-2">{b.name}</td>
                        <td className="p-2">{b.sizeMb.toFixed(2)}</td>
                        <td className="p-2">{new Date(b.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
