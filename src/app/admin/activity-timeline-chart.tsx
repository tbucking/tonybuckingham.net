'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis
} from 'recharts';
import { useMounted } from '@/lib/use-mounted';
import type { TimelinePoint } from '@/lib/activity-queries';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';

const chartConfig = {
  impulses: {
    label: 'Impulses',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

interface ActivityTimelineChartProps {
  timeline: TimelinePoint[];
}

export default function ActivityTimelineChart({ timeline }: ActivityTimelineChartProps) {
  const mounted = useMounted();

  if (!timeline.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity over time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No activity to chart yet.</p>
        </CardContent>
      </Card>
    );
  }

  // The chart renders SVG ticks and tooltip labels that are locale/timezone-
  // dependent, so render it only after hydration to avoid an SSR mismatch.
  if (!mounted) {
    return <div className="h-[360px] w-full" />;
  }

  const data = timeline.map((point) => ({
    ...point,
    time: new Date(point.bucketStart).getTime()
  }));

  const formatTick = (value: number) => {
    const date = new Date(value);
    const dateLabel = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
    const timeLabel = date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    });

    return `${dateLabel} ${timeLabel}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity over time</CardTitle>
        <CardDescription>Impulses reported per bucket.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatTick}
              tickLine={false}
              axisLine={false}
              minTickGap={32}
              fontSize={11}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={40}
              fontSize={11}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => new Date(Number(value)).toLocaleString()}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="impulses"
              stroke="var(--color-impulses)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
