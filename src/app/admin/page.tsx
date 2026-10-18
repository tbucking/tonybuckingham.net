import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  fetchDashboard,
  fetchDevices,
  fetchTimeBounds,
  toQueryFilters,
  type ActivityFilters,
  type DashboardSummary
} from '@/lib/activity-queries';
import { defaultDateRange } from '@/lib/datetime';
import AdminDashboard, { type AdminInitialData } from './components/AdminDashboard';

// Always fetch fresh data for this authenticated admin page.
export const dynamic = 'force-dynamic';

const EMPTY_SUMMARY: DashboardSummary = {
  bucketCount: 0,
  totalImpulses: 0,
  totalImpulseSum: 0,
  deviceCount: 0
};

export default async function AdminPage() {
  const supabase = await createClient();

  // The SSR client uses lazy session init: load (and verify) the session first
  // so subsequent database queries carry the user's `authenticated` access token.
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Open on the last 24 hours, computed per request so the server render and
  // the client's first paint agree on the same filter values.
  const initialFilters: ActivityFilters = defaultDateRange();

  const [dashboardResult, devicesResult, boundsResult] = await Promise.all([
    fetchDashboard(supabase, toQueryFilters(initialFilters)),
    fetchDevices(supabase),
    fetchTimeBounds(supabase)
  ]);

  const initialData: AdminInitialData = {
    summary: dashboardResult.summary ?? EMPTY_SUMMARY,
    timeline: dashboardResult.timeline ?? [],
    recent: dashboardResult.recent ?? [],
    devices: devicesResult.devices ?? [],
    bounds: boundsResult.bounds ?? { from: null, to: null }
  };

  return <AdminDashboard initialData={initialData} initialFilters={initialFilters} />;
}
