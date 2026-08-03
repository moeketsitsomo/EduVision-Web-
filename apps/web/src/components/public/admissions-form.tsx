'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Send } from 'lucide-react';
import { toast } from 'sonner';

export function AdmissionsForm({ schoolId, schoolName }: { schoolId: string; schoolName: string }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body: Record<string, any> = { schoolId };
    form.forEach((value, key) => {
      if (value) body[key] = value;
    });
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiUrl}/public/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to submit application');
      setSubmitted(true);
      toast.success('Application submitted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle2 className="size-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Application Submitted</h2>
          <p className="text-muted-foreground">Thank you for applying to {schoolName}. We will contact you shortly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Apply to {schoolName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentFirstName">Student First Name *</Label>
              <Input id="studentFirstName" name="studentFirstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentLastName">Student Last Name</Label>
              <Input id="studentLastName" name="studentLastName" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" name="gender" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gradeApplying">Grade Applying For *</Label>
            <Input id="gradeApplying" name="gradeApplying" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="previousSchool">Previous School</Label>
            <Input id="previousSchool" name="previousSchool" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentName">Parent/Guardian Name *</Label>
            <Input id="parentName" name="parentName" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentEmail">Parent Email *</Label>
              <Input id="parentEmail" name="parentEmail" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone</Label>
              <Input id="parentPhone" name="parentPhone" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            <Send className="size-4 mr-2" /> {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
