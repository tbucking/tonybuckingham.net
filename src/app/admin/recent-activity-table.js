'use client';

import { Box, Text } from 'theme-ui';

function formatTimestamp(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

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

export default function RecentActivityTable({ recent }) {
  if (!recent.length) {
    return <Text as="p">No activity yet.</Text>;
  }

  return (
    <Box
      as="table"
      sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 1 }}
    >
      <Box as="thead">
        <Box as="tr">
          {HEADERS.map((header) => (
            <Box
              as="th"
              key={header}
              sx={{
                textAlign: 'left',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'muted'
              }}
            >
              {header}
            </Box>
          ))}
        </Box>
      </Box>
      <Box as="tbody">
        {recent.map((row) => (
          <Box
            as="tr"
            key={row.id}
            sx={{
              '&:hover': { bg: 'muted' }
            }}
          >
            <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'muted' }}>
              {row.device_id}
            </Box>
            <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'muted' }}>
              {formatTimestamp(row.bucket_start)}
            </Box>
            <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'muted' }}>
              {formatTimestamp(row.received_at)}
            </Box>
            <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'muted' }}>
              {row.impulses}
            </Box>
            <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'muted' }}>
              {Number(row.impulse_sum ?? 0).toLocaleString()}
            </Box>
            <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'muted' }}>
              {row.max_delta ?? '—'}
            </Box>
            <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'muted' }}>
              {row.max_dz ?? '—'}
            </Box>
            <Box as="td" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'muted' }}>
              {row.batch ?? '—'}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
