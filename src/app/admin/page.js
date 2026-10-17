import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  fetchDashboard,
  fetchDevices,
  fetchTimeBounds
} from '@/lib/activity-queries';
import AdminDashboard from './admin-dashboard';

// Always fetch fresh data for this authenticated admin page.
export const dynamic = 'force-dynamic';

const EMPTY_SUMMARY = {
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

  const [dashboardResult, devicesResult, boundsResult] = await Promise.all([
    fetchDashboard(supabase),
    fetchDevices(supabase),
    fetchTimeBounds(supabase)
  ]);

  const initialData = {
    summary: dashboardResult.summary ?? EMPTY_SUMMARY,
    timeline: dashboardResult.timeline ?? [],
    recent: dashboardResult.recent ?? [],
    devices: devicesResult.devices ?? [],
    bounds: boundsResult.bounds ?? { from: null, to: null }
  };

  return <AdminDashboard initialData={initialData} />;
}
