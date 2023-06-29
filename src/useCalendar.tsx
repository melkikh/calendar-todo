import { randomId, showToast, ToastStyle } from '@raycast/api';
import { useState } from 'react';
import { CalendarEvent } from './types';
import { getEndDate, getStartDate, saturday } from './dates';
import osascript from 'osascript-tag';

export const executeJxa = async (script: string) => {
  try {
    const result = await osascript.jxa({ parse: true })`${script}`;
    return result;
  } catch (err: unknown) {
    if (typeof err === 'string') {
      const message = err.replace('execution error: Error: ', '');
      console.log(err);
      showToast(ToastStyle.Failure, 'Something went wrong', message);
    }
  }
};

export function useCalendar() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CalendarEvent[]>([]);
  const [calendarText, setCalendarText] = useState('');

  async function parse(query: string) {
    try {
      setIsLoading(true);
      setCalendarText(query);

      if (query.length === 0) {
        setResults([]);
      } else {
        
        const todayStartDate = getStartDate();
        const startDate = saturday(todayStartDate);
        const endDate = getEndDate(startDate);

        const event: CalendarEvent = {
          eventTitle: query,
          isAllDay: false,
          startDate: startDate,
          endDate: endDate,
          id: randomId(),
          validated: true
        };

        setResults([event]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('error', error);
      showToast(ToastStyle.Failure, 'Could not parse event', String(error));
    }
  }

  return {
    isLoading,
    results,
    calendarText,
    parse,
  };
}
