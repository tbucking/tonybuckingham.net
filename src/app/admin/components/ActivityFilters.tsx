'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { ActivityFilters as Filters } from '@/lib/activity-queries';
import DateTimeField from './DateTimeField';

const EMPTY_FILTERS: Filters = { deviceId: '', from: '', to: '' };

// Radix Select cannot use an empty string as an item value.
const ALL_DEVICES = 'all';

interface ActivityFiltersProps {
  devices: string[];
  value: Filters;
  onChange: (next: Filters) => void;
}

export default function ActivityFilters({ devices, value, onChange }: ActivityFiltersProps) {
  const [deviceId, setDeviceId] = useState(value.deviceId ?? '');
  const [from, setFrom] = useState(value.from ?? '');
  const [to, setTo] = useState(value.to ?? '');

  // The dashboard rolls the default window forward, so mirror prop changes
  // instead of only seeding local state on mount. These setters are no-ops
  // when the values already match, so the round trip through onChange settles.
  useEffect(() => {
    setDeviceId(value.deviceId ?? '');
  }, [value.deviceId]);

  useEffect(() => {
    setFrom(value.from ?? '');
  }, [value.from]);

  useEffect(() => {
    setTo(value.to ?? '');
  }, [value.to]);

  const handleDeviceChange = (next: string) => {
    const nextDevice = next === ALL_DEVICES ? '' : next;
    setDeviceId(nextDevice);
    onChange({ deviceId: nextDevice, from, to });
  };

  const handleApply = () => {
    onChange({ deviceId, from, to });
  };

  const handleClear = () => {
    setDeviceId('');
    setFrom('');
    setTo('');
    onChange(EMPTY_FILTERS);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>
          Narrow the activity window by device or time range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <Field className="w-full sm:w-[220px]">
            <FieldLabel htmlFor="device-filter">Device</FieldLabel>
            <Select
              name="device"
              value={deviceId || ALL_DEVICES}
              onValueChange={handleDeviceChange}
            >
              <SelectTrigger id="device-filter" className="w-full">
                {/* Explicit label so the trigger still shows the selection if
                    the refreshed device list no longer contains it. */}
                <SelectValue placeholder="All devices">
                  {deviceId || 'All devices'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_DEVICES}>All devices</SelectItem>
                {devices.map((device) => (
                  <SelectItem key={device} value={device}>
                    {device}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <DateTimeField
            id="from-filter"
            label="From"
            value={from}
            onChange={setFrom}
            defaultTime="00:00"
          />

          <DateTimeField
            id="to-filter"
            label="To"
            value={to}
            onChange={setTo}
            defaultTime="23:59"
          />

          <div className="flex gap-2">
            <Button onClick={handleApply}>Apply</Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
