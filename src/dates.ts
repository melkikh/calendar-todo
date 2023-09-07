import { addHours, addMinutes, differenceInCalendarDays, format, roundToNearestMinutes } from 'date-fns';
import { CalendarEvent } from './types';

const eventDurationMinutes = 15;

export const getHumanDateFormat = 'MMM dd, yyyy';
export const getHumanTimeFormat = 'h:mm aa';

export const formatRelativeDay = (date: Date, relativeDate: Date) => {
  switch (differenceInCalendarDays(date, relativeDate)) {
    case -1:
      return 'yesterday';
    case 0:
      return 'today';
    case 1:
      return 'tomorrow';
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return format(date, 'cccc');
    default:
      return format(date, getHumanDateFormat);
  }
};

export const getStartDate = () => {
  const startDate = addMinutes(new Date(), 15);

  const startDateNearest = roundToNearestMinutes(startDate, {
    nearestTo: 30,
  });

  return startDateNearest;
};

export const saturday = (date: Date) => {
  const daytoset = 6;
  const currentDay = date.getDay();
  const distance = daytoset - currentDay;
  date.setDate(date.getDate() + distance);
  return date;
}

export const getEndDate = (startDate: Date) => {
  const endDate = new Date(startDate);
  return addMinutes(endDate, eventDurationMinutes);
};
