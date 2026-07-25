'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { FieldConfig, ResourceConfig, FieldType } from './resource-config';

type RecordData = Record<string, unknown>;

function emptyRecord(config: ResourceConfig): RecordData {
  const record: RecordData = {};
  for (const f of config.fields) {
    if (f.type === 'switch') record[f.name] = false;
    else if (f.type === 'number') record[f.name] = 0;
    else record[f.name] = '';
  }
  return record;
}

function formatFromItem(config: ResourceConfig, item: RecordData): RecordData {
  const record: RecordData = { ...item };
  for (const f of config.fields) {
    let v = item[f.name];
    if (f.type === 'switch') v = Boolean(v);
    else if (f.type === 'number') v = v === '' || v == null ? 0 : Number(v);
    else if (f.type === 'datetime-local' && v) v = (v as string).slice(0, 16);
    else if (typeof v !== 'string' && v != null) v = String(v);
    else if (v == null) v = '';
    record[f.name] = v;
  }
  return record;
}

function formatForSave(config: ResourceConfig, record: RecordData): RecordData {
  const body: RecordData = {};
  for (const f of config.fields) {
    let v = record[f.name];
    if (f.type === 'switch') {
      v = Boolean(v);
    } else if (f.type === 'number') {
      v = v === '' ? 0 : Number(v);
    } else if (f.type === 'datetime-local') {
      if (!v) continue;
      v = new Date(v as string).toISOString();
    } else if (typeof v === 'string') {
      v = (v as string).trim();
      if (!f.required && v === '') continue;
      if (f.name === 'slug') v = (v as string).toLowerCase();
    }
    body[f.name] = v;
  }
  return body;
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const [items, setItems] = useState<RecordData[]>([]);
  const [record, setRecord] = useState<RecordData>(() => emptyRecord(config));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const statusField = useMemo(() => config.fields.find((f) => f.type === 'switch'), [config]);
  const displayFields = useMemo(() => config.fields.slice(0, 2), [config]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/${config.resource}`);
      const data = (await res.json()) as RecordData[];
      setItems(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);

  const handleNew = () => {
    setRecord(emptyRecord(config));
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: RecordData) => {
    setRecord(formatFromItem(config, item));
    setEditingId(String(item[config.idKey]));
    setDialogOpen(true);
  };

  const handleDelete = async (item: RecordData) => {
    if (!confirm(`Delete this ${config.singular.toLowerCase()}?`)) return;
    try {
      const id = item[config.idKey];
      await apiFetch(`/${config.resource}/${id}`, { method: 'DELETE' });
      toast.success(`${config.singular} deleted`);
      fetchItems();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = formatForSave(config, record);
    try {
      if (editingId) {
        await apiFetch(`/${config.resource}/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
        toast.success(`${config.singular} updated`);
      } else {
        await apiFetch(`/${config.resource}`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        toast.success(`${config.singular} created`);
      }
      setDialogOpen(false);
      setRecord(emptyRecord(config));
      setEditingId(null);
      fetchItems();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const renderInput = (field: FieldConfig) => {
    const value = record[field.name];
    const id = `${config.resource}-${field.name}`;

    if (field.type === 'textarea') {
      return (
        <Textarea
          id={id}
          required={field.required}
          value={String(value ?? '')}
          onChange={(e) => setRecord({ ...record, [field.name]: e.target.value })}
          className="md:col-span-2 min-h-32"
        />
      );
    }

    if (field.type === 'switch') {
      return (
        <Switch
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(v) => setRecord({ ...record, [field.name]: v })}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          id={id}
          required={field.required}
          value={String(value ?? '')}
          onChange={(e) => setRecord({ ...record, [field.name]: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    const inputType: React.HTMLInputTypeAttribute =
      field.type === 'number' ? 'number' : field.type === 'datetime-local' ? 'datetime-local' : field.type;

    return (
      <Input
        id={id}
        type={inputType}
        required={field.required}
        value={String(value ?? '')}
        onChange={(e) => setRecord({ ...record, [field.name]: e.target.value })}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{config.title}</h1>
        <Button onClick={handleNew}>New {config.singular}</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingId ? `Edit ${config.singular}` : `New ${config.singular}`}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.fields.map((field) => (
                <div
                  key={field.name}
                  className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
                >
                  <Label htmlFor={`${config.resource}-${field.name}`}>
                    {field.label}
                    {field.required ? ' *' : ''}
                  </Label>
                  {renderInput(field)}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All {config.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No {config.title.toLowerCase()} yet.
            </p>
          )}
          {items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  {displayFields.map((f) => (
                    <TableHead key={f.name}>{f.label}</TableHead>
                  ))}
                  {statusField && <TableHead>Status</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={String(item[config.idKey])}>
                    {displayFields.map((f) => (
                      <TableCell key={f.name}>{String(item[f.name] ?? '-')}</TableCell>
                    ))}
                    {statusField && (
                      <TableCell>
                        <Badge variant={item[statusField.name] ? 'default' : 'secondary'}>
                          {item[statusField.name] ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="text-right space-x-2">
                      <Button size="xs" variant="outline" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                      <Button size="xs" variant="destructive" onClick={() => handleDelete(item)}>
                        Delete
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
