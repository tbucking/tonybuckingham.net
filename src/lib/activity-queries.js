// Shared queries for the internetbutton admin dashboard.
//
// These functions take a Supabase client instance (server or browser) plus
// optional filters and return plain serializable data so they can be used from
// both server components and client components.

const RECENT_LIMIT = 50;
const MAX_ROWS = 5000;

const COLUMNS = 'id, device_id, bucket_start, impulses, impulse_sum, max_delta, max_dz, batch, received_at';

function applyFilters(query, filters = {}) {
  let q = query;

  if (filters.deviceId) {
    q = q.eq('device_id', filters.deviceId);
  }
  if (filters.from) {
    q = q.gte('bucket_start', filters.from);
  }
  if (filters.to) {
    q = q.lte('bucket_start', filters.to);
  }

  return q;
}

// Fetches the raw rows within the current filter window. Aggregation is done in
// JavaScript because PostgREST's REST DSL does not support GROUP BY or DISTINCT.
// The cap keeps the dashboard bounded; raise it if the dataset grows.
export async function fetchRows(supabase, filters = {}) {
  const query = applyFilters(
    supabase.from('activity_buckets').select(COLUMNS),
    filters
  )
    .order('bucket_start', { ascending: true })
    .limit(MAX_ROWS);

  const { data, error } = await query;
  return { rows: data ?? [], error };
}

// Distinct device ids, for the filter dropdown.
export async function fetchDevices(supabase) {
  const { data, error } = await supabase
    .from('activity_buckets')
    .select('device_id')
    .order('device_id', { ascending: true });

  if (error) {
    return { devices: [], error };
  }

  const devices = [...new Set((data ?? []).map((row) => row.device_id))];
  return { devices, error: null };
}

// Overall min/max bucket_start, for the filter's default range.
export async function fetchTimeBounds(supabase) {
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

  return {
    bounds: {
      from: minResult.data?.[0]?.bucket_start ?? null,
      to: maxResult.data?.[0]?.bucket_start ?? null
    },
    error: minResult.error || maxResult.error
  };
}

export function buildSummary(rows) {
  let totalImpulses = 0;
  let totalImpulseSum = 0;
  const devices = new Set();

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

export function buildTimeline(rows) {
  const byBucket = new Map();

  for (const row of rows) {
    const key = row.bucket_start;
    if (!byBucket.has(key)) {
      byBucket.set(key, { bucketStart: key, impulses: 0, impulseSum: 0 });
    }

    const entry = byBucket.get(key);
    entry.impulses += row.impulses ?? 0;
    entry.impulseSum += Number(row.impulse_sum ?? 0);
  }

  return [...byBucket.values()].sort(
    (a, b) => new Date(a.bucketStart).getTime() - new Date(b.bucketStart).getTime()
  );
}

export function buildRecent(rows, limit = RECENT_LIMIT) {
  return [...rows]
    .sort((a, b) => {
      const aTime = new Date(a.received_at ?? a.bucket_start).getTime();
      const bTime = new Date(b.received_at ?? b.bucket_start).getTime();
      return bTime - aTime;
    })
    .slice(0, limit);
}

// One-stop data payload for a given filter window.
export async function fetchDashboard(supabase, filters = {}) {
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
