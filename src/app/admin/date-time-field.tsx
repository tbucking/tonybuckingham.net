'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// A fixed locale and option set keeps the server and client markup identical,
// unlike the visitor's default locale.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

const VALUE_PATTERN = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/;

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseValue(value: string): { date?: Date; time: string } {
  const match = VALUE_PATTERN.exec(value ?? '');
  if (!match) {
    return { time: '' };
  }

  return {
    date: new Date(`${match[1]}T00:00:00`),
    time: match[2]
  };
}

interface DateTimeFieldProps {
  id: string;
  label: string;
  /** Local `YYYY-MM-DDTHH:mm` value, matching what the filters already produce. */
  value: string;
  onChange: (next: string) => void;
  /** Time applied when only a date is chosen; keeps range endpoints inclusive. */
  defaultTime: string;
}

export default function DateTimeField({
  id,
  label,
  value,
  onChange,
  defaultTime
}: DateTimeFieldProps) {
  const [open, setOpen] = useState(false);
  const { date, time } = parseValue(value);
  const displayTime = time || defaultTime;

  const emit = (nextDate: Date | undefined, nextTime: string) => {
    if (!nextDate) {
      return;
    }

    onChange(`${formatDateKey(nextDate)}T${nextTime || defaultTime}`);
  };

  const handleSelect = (nextDate: Date | undefined) => {
    // Clicking the selected day would otherwise deselect and blank the filter.
    if (!nextDate) {
      return;
    }

    emit(nextDate, displayTime);
    setOpen(false);
  };

  const handleTimeChange = (nextTime: string) => {
    if (!date) {
      return;
    }

    emit(date, nextTime);
  };

  return (
    <Field className="w-full sm:w-[220px]">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-expanded={open}
            className={cn(
              'w-full justify-start font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {date ? dateFormatter.format(date) : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={handleSelect}
            autoFocus
          />
          <div className="border-t p-3">
            <label
              htmlFor={`${id}-time`}
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              Time
            </label>
            <Input
              id={`${id}-time`}
              type="time"
              value={displayTime}
              onChange={(event) => handleTimeChange(event.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
