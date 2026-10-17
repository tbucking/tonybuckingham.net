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

// Custom X-axis tick: month/day on one centered line, time on the next.
function TimelineTick({ x, y, payload }) {
  const date = new Date(payload.value);
  const dateLabel = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={11}>
        {dateLabel}
      </text>
      <text x={0} y={0} dy={30} textAnchor="middle" fill="#666" fontSize={11}>
        {timeLabel}
      </text>
    </g>
  );
}

export default function ActivityTimelineChart({ timeline }) {
  if (!timeline.length) {
    return <Text as="p">No activity to chart yet.</Text>;
  }

  const data = timeline.map((point) => ({
    ...point,
    time: new Date(point.bucketStart).getTime()
  }));

  return (
    <Box sx={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 40, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={<TimelineTick />} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="impulses" stroke="#0069ff" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
