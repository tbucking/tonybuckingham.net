'use client';

import type { DashboardSummary } from '@/lib/activity-queries';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card';

// Deterministic grouping so server and client render identical thousands
// separators regardless of runtime locale.
const numberFormat = new Intl.NumberFormat('en-US');

interface StatCardProps {
  label: string;
  value: number;
  hint?: string;
}

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs font-medium tracking-wide uppercase">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">
          {numberFormat.format(value)}
        </p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const stats = [
    {
      label: 'Total impulses',
      value: summary.totalImpulses,
      hint: 'Across the selected window'
    },
    {
      label: 'Impulse sum',
      value: summary.totalImpulseSum,
      hint: 'Cumulative sum of impulses'
    },
    { label: 'Buckets', value: summary.bucketCount, hint: 'Reported batches' },
    { label: 'Devices', value: summary.deviceCount, hint: 'Active senders' }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          hint={stat.hint}
        />
      ))}
    </div>
  );
}
