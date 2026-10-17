'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Flex, Text } from 'theme-ui';
import { createClient } from '@/lib/supabase/client';
import {
  fetchDashboard,
  fetchDevices,
  fetchTimeBounds
} from '@/lib/activity-queries';
import ActivityFilters from './activity-filters';
import ActivityTimelineChart from './activity-timeline-chart';
import ColorModeToggle from './color-mode-toggle';
import RecentActivityTable from './recent-activity-table';
import SignOutButton from './sign-out-button';
import SummaryCards from './summary-cards';

const EMPTY_FILTERS = { deviceId: '', from: '', to: '' };

// datetime-local inputs yield "YYYY-MM-DDTHH:mm"; convert to a full timestamp.
function toQueryFilters(filters) {
  return {
    deviceId: filters.deviceId || undefined,
    from: filters.from ? new Date(filters.from).toISOString() : undefined,
    to: filters.to ? new Date(filters.to).toISOString() : undefined
  };
}

export default function AdminDashboard({ initialData }) {
  const supabase = useMemo(() => createClient(), []);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const filtersRef = useRef(EMPTY_FILTERS);

  const [data, setData] = useState({
    summary: initialData.summary,
    timeline: initialData.timeline,
    recent: initialData.recent
  });
  const [devices, setDevices] = useState(initialData.devices ?? []);
  const [bounds, setBounds] = useState(initialData.bounds ?? { from: null, to: null });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const refresh = useCallback(
    async (nextFilters = filtersRef.current) => {
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

      setData({
        summary: dashboardResult.summary,
        timeline: dashboardResult.timeline,
        recent: dashboardResult.recent
      });

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

  const handleFiltersChange = (nextFilters) => {
    filtersRef.current = nextFilters;
    setFilters(nextFilters);
    refresh(nextFilters);
  };

  useEffect(() => {
    let mounted = true;
    let debounceTimer = null;

    const channel = supabase
      .channel('activity-buckets-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activity_buckets' },
        () => {
          if (!mounted) return;
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => refresh(), 300);
        }
      )
      .subscribe((status) => {
        if (!mounted) return;
        if (status === 'SUBSCRIBED') {
          setIsLive(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsLive(false);
          setErrorMessage('Live updates unavailable.');
        }
      });

    return () => {
      mounted = false;
      if (debounceTimer) clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, [supabase, refresh]);

  return (
    <Box
      as="main"
      sx={{
        width: '100%',
        maxWidth: 1080,
        mx: 'auto',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}
    >
      <Flex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3
        }}
      >
        <Box>
          <Text as="h1" sx={{ fontSize: 4, mb: 1 }}>
            Internetbutton activity
          </Text>
          <Text as="p" sx={{ fontSize: 1, color: 'text' }}>
            {isLive ? 'Live' : 'Updating'} ·{' '}
            {isRefreshing
              ? 'Refreshing…'
              : lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : 'Initial data'}
          </Text>
        </Box>
        <Flex sx={{ gap: 3, alignItems: 'center' }}>
          <ColorModeToggle />
          <SignOutButton />
        </Flex>
      </Flex>

      <ActivityFilters devices={devices} value={filters} onChange={handleFiltersChange} />

      {bounds.from && bounds.to && (
        <Text as="p" sx={{ fontSize: 1, color: 'text' }}>
          Data from {new Date(bounds.from).toLocaleString()} to{' '}
          {new Date(bounds.to).toLocaleString()}
        </Text>
      )}

      {errorMessage && (
        <Text as="p" sx={{ color: 'error' }}>
          {errorMessage}
        </Text>
      )}

      <SummaryCards summary={data.summary} />
      <ActivityTimelineChart timeline={data.timeline} />
      <RecentActivityTable recent={data.recent} />
    </Box>
  );
}
