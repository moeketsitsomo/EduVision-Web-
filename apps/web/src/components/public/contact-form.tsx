'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ContactForm({ schoolName }: { schoolName: string }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      subject: form.get('subject'),
      message: form.get('message'),
    };
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${apiUrl}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSubmitted(true);
      toast.success('Message sent successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="text-xl font-semibold">Thank you</h3>
        <p className="text-muted-foreground mt-2">Your message has been sent to {schoolName}. We will respond as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name *</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" name="subject" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
