'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { ActivityFilters as Filters } from '@/lib/activity-queries';

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

          <Field className="w-full sm:w-[220px]">
            <FieldLabel htmlFor="from-filter">From</FieldLabel>
            <Input
              id="from-filter"
              type="datetime-local"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="cursor-pointer"
            />
          </Field>

          <Field className="w-full sm:w-[220px]">
            <FieldLabel htmlFor="to-filter">To</FieldLabel>
            <Input
              id="to-filter"
              type="datetime-local"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="cursor-pointer"
            />
          </Field>

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
