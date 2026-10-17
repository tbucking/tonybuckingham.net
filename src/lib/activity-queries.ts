// Shared queries for the internetbutton admin dashboard.
//
// These functions take a Supabase client instance (server or browser) plus
// optional filters and return plain serializable data so they can be used from
// both server components and client components.

import type { SupabaseClient } from '@supabase/supabase-js';

export interface ActivityRow {
  id: string;
  device_id: string;
  bucket_start: string;
  impulses: number | null;
  impulse_sum: number | string | null;
  max_delta: number | string | null;
  max_dz: number | string | null;
  batch: number | string | null;
  received_at: string | null;
}

export interface ActivityFilters {
  deviceId?: string;
  from?: string;
  to?: string;
}

export interface DashboardSummary {
  bucketCount: number;
  totalImpulses: number;
  totalImpulseSum: number;
  deviceCount: number;
}

export interface TimelinePoint {
  bucketStart: string;
  impulses: number;
  impulseSum: number;
}

export interface TimeBounds {
  from: string | null;
  to: string | null;
}

export interface DashboardData {
  summary: DashboardSummary;
  timeline: TimelinePoint[];
  recent: ActivityRow[];
}

export interface QueryError {
  message: string;
}

// Only `from` is needed here, which keeps the module usable from both the
// server and browser clients without pinning their concrete generic arguments.
type ActivityClient = Pick<SupabaseClient, 'from'>;

const RECENT_LIMIT = 50;
const MAX_ROWS = 5000;

const COLUMNS =
  'id, device_id, bucket_start, impulses, impulse_sum, max_delta, max_dz, batch, received_at';

// Fetches the raw rows within the current filter window. Aggregation is done in
// JavaScript because PostgREST's REST DSL does not support GROUP BY or DISTINCT.
// The cap keeps the dashboard bounded; raise it if the dataset grows.
export async function fetchRows(
  supabase: ActivityClient,
  filters: ActivityFilters = {}
): Promise<{ rows: ActivityRow[]; error: QueryError | null }> {
  let query = supabase.from('activity_buckets').select(COLUMNS);

  if (filters.deviceId) {
    query = query.eq('device_id', filters.deviceId);
  }
  if (filters.from) {
    query = query.gte('bucket_start', filters.from);
  }
  if (filters.to) {
    query = query.lte('bucket_start', filters.to);
  }

  query = query.order('bucket_start', { ascending: true }).limit(MAX_ROWS);

  const { data, error } = await query;
  return { rows: (data as ActivityRow[] | null) ?? [], error };
}

// Distinct device ids, for the filter dropdown.
export async function fetchDevices(
  supabase: ActivityClient
): Promise<{ devices: string[]; error: QueryError | null }> {
  const { data, error } = await supabase
    .from('activity_buckets')
    .select('device_id')
    .order('device_id', { ascending: true });

  if (error) {
    return { devices: [], error };
  }

  const devices = [
    ...new Set(((data as { device_id: string }[] | null) ?? []).map((row) => row.device_id))
  ];
  return { devices, error: null };
}

// Overall min/max bucket_start, for the filter's default range.
export async function fetchTimeBounds(
  supabase: ActivityClient
): Promise<{ bounds: TimeBounds; error: QueryError | null }> {
  const [minResult, maxResult] = await Promise.all([
    supabase
      .from('activity_buckets')
      .select('bucket_start')
      .order('bucket_start', { ascending: true })
      .limit(1),
    supabase
      .from('activity_buckets')
      .select('bucket_start')
      .order('bucket_start', { ascending: false })
      .limit(1)
  ]);

  const minRows = minResult.data as { bucket_start: string }[] | null;
  const maxRows = maxResult.data as { bucket_start: string }[] | null;

  return {
    bounds: {
      from: minRows?.[0]?.bucket_start ?? null,
      to: maxRows?.[0]?.bucket_start ?? null
    },
    error: minResult.error || maxResult.error
  };
}

export function buildSummary(rows: ActivityRow[]): DashboardSummary {
  let totalImpulses = 0;
  let totalImpulseSum = 0;
  const devices = new Set<string>();

  for (const row of rows) {
    totalImpulses += row.impulses ?? 0;
    totalImpulseSum += Number(row.impulse_sum ?? 0);
    devices.add(row.device_id);
  }

  return {
    bucketCount: rows.length,
    totalImpulses,
    totalImpulseSum,
    deviceCount: devices.size
  };
}

export function buildTimeline(rows: ActivityRow[]): TimelinePoint[] {
  const byBucket = new Map<string, TimelinePoint>();

  for (const row of rows) {
    const key = row.bucket_start;
    if (!byBucket.has(key)) {
      byBucket.set(key, { bucketStart: key, impulses: 0, impulseSum: 0 });
    }

    const entry = byBucket.get(key) as TimelinePoint;
    entry.impulses += row.impulses ?? 0;
    entry.impulseSum += Number(row.impulse_sum ?? 0);
  }

  return [...byBucket.values()].sort(
    (a, b) => new Date(a.bucketStart).getTime() - new Date(b.bucketStart).getTime()
  );
}

export function buildRecent(rows: ActivityRow[], limit = RECENT_LIMIT): ActivityRow[] {
  return [...rows]
    .sort((a, b) => {
      const aTime = new Date(a.received_at ?? a.bucket_start).getTime();
      const bTime = new Date(b.received_at ?? b.bucket_start).getTime();
      return bTime - aTime;
    })
    .slice(0, limit);
}

// One-stop data payload for a given filter window.
export async function fetchDashboard(
  supabase: ActivityClient,
  filters: ActivityFilters = {}
): Promise<{ summary?: DashboardSummary; timeline?: TimelinePoint[]; recent?: ActivityRow[]; error: QueryError | null }> {
  const { rows, error } = await fetchRows(supabase, filters);

  if (error) {
    return { error };
  }

  return {
    summary: buildSummary(rows),
    timeline: buildTimeline(rows),
    recent: buildRecent(rows),
    error: null
  };
}
