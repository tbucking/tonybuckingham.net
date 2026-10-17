'use client';

import { useState } from 'react';
import { Box, Button, Flex, Input, Label, Select } from 'theme-ui';

const EMPTY_FILTERS = { deviceId: '', from: '', to: '' };

export default function ActivityFilters({ devices, value, onChange }) {
  const [deviceId, setDeviceId] = useState(value.deviceId ?? '');
  const [from, setFrom] = useState(value.from ?? '');
  const [to, setTo] = useState(value.to ?? '');

  const handleDeviceChange = (event) => {
    const next = event.target.value;
    setDeviceId(next);
    onChange({ deviceId: next, from, to });
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
    <Flex sx={{ gap: 3, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <Box>
        <Label htmlFor="device-filter">Device</Label>
        <Select id="device-filter" value={deviceId} onChange={handleDeviceChange}>
          <option value="">All devices</option>
          {devices.map((device) => (
            <option key={device} value={device}>
              {device}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        <Label htmlFor="from-filter">From</Label>
        <Input
          id="from-filter"
          type="datetime-local"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      <Box>
        <Label htmlFor="to-filter">To</Label>
        <Input
          id="to-filter"
          type="datetime-local"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      <Button onClick={handleApply}>Apply</Button>
      <Button variant="secondary" onClick={handleClear}>
        Clear
      </Button>
    </Flex>
  );
}
