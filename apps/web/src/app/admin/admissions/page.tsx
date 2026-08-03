'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ClipboardList, FileDown, Printer, Search } from 'lucide-react';

type Admission = {
  id: string;
  studentFirstName: string;
  studentLastName?: string | null;
  gradeApplying: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string | null;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WAITLISTED';
  notes?: string | null;
  submittedAt: string;
  previousSchool?: string | null;
  address?: string | null;
};

const statusOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'ACCEPTED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WAITLISTED', label: 'Waiting List' },
];

const statusBadge: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  REVIEWING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  WAITLISTED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export default function AdmissionsDashboardPage() {
  const [items, setItems] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [selected, setSelected] = useState<Admission | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch('/admissions');
      const data = (await res.json()) as Admission[];
      setItems(data);
    } catch (e) {
      toast.error('Failed to load admissions');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: Admission['status']) {
    try {
      await apiFetch(`/admissions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      if (selected?.id === id) setSelected({ ...selected, status: newStatus });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  }

  async function saveNotes(id: string) {
    try {
      await apiFetch(`/admissions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      });
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, notes } : a)));
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    }
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((a) => {
      const matchesStatus = status === 'ALL' || a.status === status;
      const text = `${a.studentFirstName} ${a.studentLastName || ''} ${a.gradeApplying} ${a.parentName} ${a.parentEmail}`.toLowerCase();
      return matchesStatus && text.includes(term);
    });
  }, [items, search, status]);

  const counts = useMemo(() => {
    return {
      PENDING: items.filter((a) => a.status === 'PENDING').length,
      ACCEPTED: items.filter((a) => a.status === 'ACCEPTED').length,
      REJECTED: items.filter((a) => a.status === 'REJECTED').length,
      WAITLISTED: items.filter((a) => a.status === 'WAITLISTED').length,
    };
  }, [items]);

  function exportCsv() {
    const rows = filtered.map((a) => ({
      'Student First Name': a.studentFirstName,
      'Student Last Name': a.studentLastName || '',
      'Grade Applying': a.gradeApplying,
      'Parent/Guardian': a.parentName,
      'Parent Email': a.parentEmail,
      'Parent Phone': a.parentPhone || '',
      Status: a.status,
      'Submitted At': new Date(a.submittedAt).toLocaleString(),
      Notes: a.notes || '',
    }));
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => `"${String(r[h as keyof typeof r]).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `admissions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }

  function exportPdf() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const rows = filtered
      .map(
        (a) => `
      <tr>
        <td>${a.studentFirstName} ${a.studentLastName || ''}</td>
        <td>${a.gradeApplying}</td>
        <td>${a.parentName}</td>
        <td>${a.parentEmail}</td>
        <td>${a.status}</td>
        <td>${new Date(a.submittedAt).toLocaleString()}</td>
      </tr>
    `,
      )
      .join('');
    printWindow.document.write(`
      <html>
        <head><title>Admissions Report</title>
        <style>
          body { font-family: sans-serif; margin: 20px; }
          h1 { font-size: 18px; }
          table { border-collapse: collapse; width: 100%; margin-top: 16px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f3f4f6; }
        </style></head>
        <body>
          <h1>Admissions Report</h1>
          <p>Generated ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr><th>Student</th><th>Grade</th><th>Parent</th><th>Email</th><th>Status</th><th>Submitted</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="6">No applications</td></tr>'}</tbody>
          </table>
          <script>window.onload = function() { setTimeout(() => { window.print(); }, 200); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ClipboardList className="size-6" />
        <h1 className="text-2xl font-bold">Admissions Management</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{counts.PENDING}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{counts.ACCEPTED}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{counts.REJECTED}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Waiting List</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{counts.WAITLISTED}</div></CardContent></Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by student, parent or grade..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}><FileDown className="size-4 mr-2" /> Export Excel</Button>
          <Button variant="outline" onClick={exportPdf} disabled={filtered.length === 0}><Printer className="size-4 mr-2" /> Export PDF</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">No admissions found.</TableCell></TableRow>
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.studentFirstName} {a.studentLastName || ''}</TableCell>
                    <TableCell>{a.gradeApplying}</TableCell>
                    <TableCell>{a.parentName}</TableCell>
                    <TableCell>{a.parentEmail}</TableCell>
                    <TableCell><Badge className={statusBadge[a.status]}>{a.status}</Badge></TableCell>
                    <TableCell>{new Date(a.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelected(a); setNotes(a.notes || ''); }}>View</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Admission Application</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Student:</span> {selected.studentFirstName} {selected.studentLastName || ''}</div>
                <div><span className="font-semibold">Grade:</span> {selected.gradeApplying}</div>
                <div><span className="font-semibold">Parent:</span> {selected.parentName}</div>
                <div><span className="font-semibold">Phone:</span> {selected.parentPhone || '—'}</div>
                <div><span className="font-semibold">Email:</span> {selected.parentEmail}</div>
                <div><span className="font-semibold">Submitted:</span> {new Date(selected.submittedAt).toLocaleString()}</div>
                {selected.previousSchool && <div className="col-span-2"><span className="font-semibold">Previous School:</span> {selected.previousSchool}</div>}
                {selected.address && <div className="col-span-2"><span className="font-semibold">Address:</span> {selected.address}</div>}
              </div>
              <div>
                <Label>Status</Label>
                <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v as Admission['status'])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.filter((s) => s.value !== 'ALL').map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => saveNotes(selected.id)}>Save Notes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
