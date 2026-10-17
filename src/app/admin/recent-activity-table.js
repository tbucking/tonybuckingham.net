'use client';

import { Box, Text } from 'theme-ui';
import { useMounted } from '@/lib/use-mounted';

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

const cellStyle = {
  p: 2,
  borderBottom: '1px solid',
  borderColor: 'border',
  whiteSpace: 'nowrap'
};

// Deterministic grouping so server and client render identical thousands
// separators regardless of runtime locale.
const numberFormat = new Intl.NumberFormat('en-US');

export default function RecentActivityTable({ recent }) {
  const mounted = useMounted();

  // Locale/timezone-dependent, so format only after hydration to keep the
  // server-rendered HTML identical to the client's first paint.
  const formatTimestamp = (value) => {
    if (!value || !mounted) return '—';
    return new Date(value).toLocaleString();
  };

  if (!recent.length) {
    return <Text as="p">No activity yet.</Text>;
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 8,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ overflowX: 'auto' }}>
        <Box
          as="table"
          sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 1 }}
        >
          <Box as="thead">
            <Box as="tr" sx={{ bg: 'muted' }}>
              {HEADERS.map((header) => (
                <Box
                  as="th"
                  key={header}
                  sx={{
                    textAlign: 'left',
                    p: 2,
                    fontSize: 0,
                    color: 'gray',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                    borderBottom: '1px solid',
                    borderColor: 'border'
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
                <Box
                  as="td"
                  sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'border',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {row.device_id}
                </Box>
                <Box as="td" sx={cellStyle}>{formatTimestamp(row.bucket_start)}</Box>
                <Box as="td" sx={cellStyle}>{formatTimestamp(row.received_at)}</Box>
                <Box as="td" sx={cellStyle}>{row.impulses}</Box>
                <Box as="td" sx={cellStyle}>
                  {numberFormat.format(Number(row.impulse_sum ?? 0))}
                </Box>
                <Box as="td" sx={cellStyle}>{row.max_delta ?? '—'}</Box>
                <Box as="td" sx={cellStyle}>{row.max_dz ?? '—'}</Box>
                <Box as="td" sx={cellStyle}>{row.batch ?? '—'}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
