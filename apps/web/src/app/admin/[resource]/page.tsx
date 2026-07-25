import { notFound } from 'next/navigation';
import { ResourceManager } from '@/components/admin/resource-manager';
import { RESOURCES } from '@/components/admin/resource-config';

interface Props {
  params: Promise<{ resource: string }>;
}

export default async function AdminResourcePage({ params }: Props) {
  const { resource } = await params;
  const config = RESOURCES[resource];

  if (!config) notFound();

  return <ResourceManager config={config} />;
}
