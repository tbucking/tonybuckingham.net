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
import { Box, Text, useThemeUI } from 'theme-ui';
import { useMounted } from '@/lib/use-mounted';

// recharts sets SVG presentation attributes, which do not resolve CSS custom
// properties, so map the active color mode to concrete values that mirror the
// palette defined in src/app/theme.js.
const CHART_COLORS = {
  light: {
    line: '#e63c1a',
    grid: '#e7e2dd',
    axis: '#8a8580',
    tooltipBg: '#ffffff'
  },
  dark: {
    line: '#ff7a45',
    grid: '#2c2e33',
    axis: '#8a8580',
    tooltipBg: '#1d1f24'
  }
};

export default function ActivityTimelineChart({ timeline }) {
  const mounted = useMounted();
  const { colorMode } = useThemeUI();
  const colors = CHART_COLORS[colorMode] ?? CHART_COLORS.light;

  if (!timeline.length) {
    return <Text as="p">No activity to chart yet.</Text>;
  }

  // The chart renders SVG ticks and tooltip labels that are locale/timezone-
  // dependent, so render it only after hydration to avoid an SSR mismatch.
  if (!mounted) {
    return <Box sx={{ width: '100%', height: 320 }} />;
  }

  const data = timeline.map((point) => ({
    ...point,
    time: new Date(point.bucketStart).getTime()
  }));

  // Custom X-axis tick: month/day on one centered line, time on the next.
  const renderTick = ({ x, y, payload }) => {
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
        <text x={0} y={0} dy={16} textAnchor="middle" fill={colors.axis} fontSize={11}>
          {dateLabel}
        </text>
        <text x={0} y={0} dy={30} textAnchor="middle" fill={colors.axis} fontSize={11}>
          {timeLabel}
        </text>
      </g>
    );
  };

  return (
    <Box sx={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 40, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="time" tick={renderTick} />
          <YAxis
            allowDecimals={false}
            tick={{ fill: colors.axis, fontSize: 11 }}
          />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            contentStyle={{
              background: colors.tooltipBg,
              border: `1px solid ${colors.grid}`,
              borderRadius: 6,
              fontSize: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="impulses"
            stroke={colors.line}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
