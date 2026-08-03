'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { Printer } from 'lucide-react';

function ReportCardContent() {
  const search = useSearchParams();
  const termValue = search.get('term') || '';
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/portal/me').then((r) => r.json()).then(setUser).catch(() => {});
    apiFetch(`/portal/results?${termValue ? new URLSearchParams({ term: termValue.split(' - ')[1] || termValue }).toString() : ''}`)
      .then((r) => r.json())
      .then((data) => {
        if (termValue) {
          const [year, term] = termValue.split(' - ');
          setResults(data.filter((r: any) => r.academicYear === year && r.term === term));
        } else {
          setResults(data);
        }
      })
      .catch(() => toast.error('Failed to load results'));
  }, [termValue]);

  const average = results.length
    ? (results.reduce((sum, r) => sum + ((r.score / r.maxScore) * 100), 0) / results.length).toFixed(1)
    : '0';

  return (
    <main className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between print:hidden">
          <Button variant="outline" asChild><Link href="/portal">Back to Portal</Link></Button>
          <Button onClick={() => window.print()}><Printer className="size-4 mr-2" /> Print / Save PDF</Button>
        </div>

        <Card id="report-card" className="print:shadow-none print:border-0">
          <CardHeader className="border-b pb-6">
            <CardTitle className="text-2xl">Report Card</CardTitle>
            <p className="text-muted-foreground">{termValue || 'Latest term'}</p>
            {user?.student && (
              <div className="mt-4 text-sm">
                <p><strong>Learner:</strong> {user.student.firstName} {user.student.lastName}</p>
                <p><strong>Student Number:</strong> {user.student.studentNumber}</p>
                <p><strong>Grade:</strong> {user.student.grade}</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {results.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Subject</th>
                    <th className="text-left py-2">Score</th>
                    <th className="text-left py-2">Grade</th>
                    <th className="text-left py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-2">{r.subject}</td>
                      <td className="py-2">{r.score} / {r.maxScore}</td>
                      <td className="py-2">{r.grade}</td>
                      <td className="py-2">{r.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted-foreground">No results available for this term.</p>
            )}
            <div className="mt-6 flex justify-end">
              <p className="font-semibold">Average: {average}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function ReportCardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-8">Loading report card...</main>}>
      <ReportCardContent />
    </Suspense>
  );
}
