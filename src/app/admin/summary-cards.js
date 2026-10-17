'use client';

import { Box, Grid, Text } from 'theme-ui';

function StatCard({ label, value }) {
  return (
    <Box sx={{ bg: 'muted', p: 3, borderRadius: 8 }}>
      <Text as="p" sx={{ fontSize: 1, mb: 1 }}>
        {label}
      </Text>
      <Text as="p" sx={{ fontSize: 4, fontWeight: 'bold' }}>
        {value.toLocaleString()}
      </Text>
    </Box>
  );
}

export default function SummaryCards({ summary }) {
  const stats = [
    { label: 'Total impulses', value: summary.totalImpulses },
    { label: 'Impulse sum', value: summary.totalImpulseSum },
    { label: 'Buckets', value: summary.bucketCount },
    { label: 'Devices', value: summary.deviceCount }
  ];

  return (
    <Grid columns={[1, 2, 4]} gap={3}>
      {stats.map((stat) => (
        <StatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </Grid>
  );
}
