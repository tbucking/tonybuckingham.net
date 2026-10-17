'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Box, Text } from 'theme-ui';

export default function ActivityTimelineChart({ timeline }) {
  if (!timeline.length) {
    return <Text as="p">No activity to chart yet.</Text>;
  }

  const data = timeline.map((point) => ({
    ...point,
    time: new Date(point.bucketStart).toLocaleString()
  }));

  return (
    <Box sx={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="impulses" stroke="#0069ff" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
