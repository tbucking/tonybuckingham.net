'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useMounted } from '@/lib/use-mounted';
import {
  fetchDashboard,
  fetchDevices,
  fetchTimeBounds,
  type ActivityFilters as Filters,
  type ActivityRow,
  type DashboardData,
  type DashboardSummary,
  type TimelinePoint,
  type TimeBounds
} from '@/lib/activity-queries';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ActivityFilters from './activity-filters';
import ActivityTimelineChart from './activity-timeline-chart';
import ColorModeToggle from './color-mode-toggle';
import RecentActivityTable from './recent-activity-table';
import SignOutButton from './sign-out-button';
import SummaryCards from './summary-cards';

const EMPTY_FILTERS: Filters = { deviceId: '', from: '', to: '' };

// datetime-local inputs yield "YYYY-MM-DDTHH:mm"; convert to a full timestamp.
function toQueryFilters(filters: Filters): Filters {
  return {
    deviceId: filters.deviceId || undefined,
    from: filters.from ? new Date(filters.from).toISOString() : undefined,
    to: filters.to ? new Date(filters.to).toISOString() : undefined
  };
}

export interface AdminInitialData {
  summary: DashboardSummary;
  timeline: TimelinePoint[];
  recent: ActivityRow[];
  devices: string[];
  bounds: TimeBounds;
}

interface AdminDashboardProps {
  initialData: AdminInitialData;
}

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const supabase = useMemo(() => createClient(), []);
  const mounted = useMounted();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const filtersRef = useRef<Filters>(EMPTY_FILTERS);

  const [data, setData] = useState<DashboardData>({
    summary: initialData.summary,
    timeline: initialData.timeline,
    recent: initialData.recent
  });
  const [devices, setDevices] = useState<string[]>(initialData.devices ?? []);
  const [bounds, setBounds] = useState<TimeBounds>(
    initialData.bounds ?? { from: null, to: null }
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const refresh = useCallback(
    async (nextFilters: Filters = filtersRef.current) => {
      setIsRefreshing(true);
      setErrorMessage('');

      const queryFilters = toQueryFilters(nextFilters);
      const [dashboardResult, devicesResult, boundsResult] = await Promise.all([
        fetchDashboard(supabase, queryFilters),
        fetchDevices(supabase),
        fetchTimeBounds(supabase)
      ]);

      if (dashboardResult.error) {
        setErrorMessage(dashboardResult.error.message ?? 'Failed to load activity.');
        setIsRefreshing(false);
        return;
      }

      setData((previous) => ({
        summary: dashboardResult.summary ?? previous.summary,
        timeline: dashboardResult.timeline ?? [],
        recent: dashboardResult.recent ?? []
      }));

      if (!devicesResult.error) {
        setDevices(devicesResult.devices);
      }
      if (!boundsResult.error) {
        setBounds(boundsResult.bounds);
      }

      setLastUpdated(new Date());
      setIsRefreshing(false);
    },
    [supabase]
  );

  const handleFiltersChange = (nextFilters: Filters) => {
    filtersRef.current = nextFilters;
    setFilters(nextFilters);
    refresh(nextFilters);
  };

  useEffect(() => {
    let isMounted = true;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const channel = supabase
      .channel('activity-buckets-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activity_buckets' },
        () => {
          if (!isMounted) return;
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => refresh(), 300);
        }
      )
      .subscribe((status) => {
        if (!isMounted) return;
        if (status === 'SUBSCRIBED') {
          setIsLive(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsLive(false);
          setErrorMessage('Live updates unavailable.');
        }
      });

    return () => {
      isMounted = false;
      if (debounceTimer) clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, [supabase, refresh]);

  return (
    <main className="mx-auto flex w-full max-w-[1080px] flex-col gap-6 p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Internetbutton activity
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={isLive ? 'default' : 'secondary'} className="gap-1.5">
              <span
                aria-hidden
                className={
                  isLive
                    ? 'size-1.5 rounded-full bg-primary-foreground'
                    : 'size-1.5 rounded-full bg-muted-foreground'
                }
              />
              {isLive ? 'Live' : 'Offline'}
            </Badge>
            <span aria-live="polite">
              {isRefreshing
                ? 'Refreshing…'
                : lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : 'Initial data'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorModeToggle />
          <SignOutButton />
        </div>
      </header>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <SummaryCards summary={data.summary} />

      <ActivityFilters
        devices={devices}
        value={filters}
        onChange={handleFiltersChange}
      />

      {bounds.from && bounds.to && (
        <p className="text-sm text-muted-foreground">
          {mounted
            ? `Data from ${new Date(bounds.from).toLocaleString()} to ${new Date(bounds.to).toLocaleString()}`
            : 'Data range loading…'}
        </p>
      )}

      <ActivityTimelineChart timeline={data.timeline} />
      <RecentActivityTable recent={data.recent} />
    </main>
  );
}
