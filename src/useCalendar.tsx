import { showToast, ToastStyle } from '@raycast/api';
import { useState } from 'react';
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
  const [calendarText, setCalendarText] = useState('');

  async function parse(query: string) {
    try {
      setIsLoading(true);
      setCalendarText(query);
      setIsLoading(false);
    } catch (error) {
      console.error('error', error);
      showToast(ToastStyle.Failure, 'Could not parse event', String(error));
    }
  }

  return {
    isLoading,
    calendarText,
    parse,
  };
}
