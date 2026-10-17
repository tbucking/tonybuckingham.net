'use client';

import { Box, Grid, Text } from 'theme-ui';

// Deterministic grouping so server and client render identical thousands
// separators regardless of runtime locale.
const numberFormat = new Intl.NumberFormat('en-US');

function StatCard({ label, value }) {
  return (
    <Box
      sx={{
        bg: 'muted',
        p: 3,
        borderRadius: 8,
        border: '1px solid',
        borderColor: 'border',
        boxShadow: 'card'
      }}
    >
      <Text
        as="p"
        sx={{
          fontSize: 0,
          color: 'gray',
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}
      >
        {label}
      </Text>
      <Text as="p" sx={{ fontSize: 4, fontWeight: 'bold', color: 'text' }}>
        {numberFormat.format(value)}
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
