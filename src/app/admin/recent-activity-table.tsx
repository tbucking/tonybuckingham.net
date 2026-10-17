'use client';

import { useMounted } from '@/lib/use-mounted';
import type { ActivityRow } from '@/lib/activity-queries';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const HEADERS = [
  'Device',
  'Bucket start',
  'Received',
  'Impulses',
  'Impulse sum',
  'Max Δ',
  'Max Δz',
  'Batch'
];

// Deterministic grouping so server and client render identical thousands
// separators regardless of runtime locale.
const numberFormat = new Intl.NumberFormat('en-US');

interface RecentActivityTableProps {
  recent: ActivityRow[];
}

export default function RecentActivityTable({ recent }: RecentActivityTableProps) {
  const mounted = useMounted();

  // Locale/timezone-dependent, so format only after hydration to keep the
  // server-rendered HTML identical to the client's first paint.
  const formatTimestamp = (value: string | null) => {
    if (!value || !mounted) return '—';
    return new Date(value).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>The latest buckets received from your devices.</CardDescription>
      </CardHeader>
      <CardContent>
        {!recent.length ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="-mx-6 overflow-x-auto px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  {HEADERS.map((header) => (
                    <TableHead
                      key={header}
                      className={
                        header === 'Device' || header.endsWith('start') || header === 'Received'
                          ? 'whitespace-nowrap'
                          : 'text-right whitespace-nowrap'
                      }
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {row.device_id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatTimestamp(row.bucket_start)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatTimestamp(row.received_at)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {numberFormat.format(row.impulses ?? 0)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {numberFormat.format(Number(row.impulse_sum ?? 0))}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.max_delta ?? '—'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.max_dz ?? '—'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.batch ?? '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
