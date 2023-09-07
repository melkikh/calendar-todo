import { ActionPanel, closeMainWindow, Icon, List, preferences, randomId } from '@raycast/api';
import { CalendarEvent } from './types';
import { getEndDate, getStartDate, saturday } from './dates';
import { executeJxa, useCalendar } from './useCalendar';

export default function Command() {
  const { isLoading, calendarText, parse } = useCalendar();
  const calendars = String(preferences.calendars.value).split(',');

  const createEvent = async (text: string, calendarName: string) => {
    const todayStartDate = getStartDate();
    const startDate = saturday(todayStartDate);
    const endDate = getEndDate(startDate);

    const event: CalendarEvent = {
      eventTitle: text,
      isAllDay: false,
      startDate: startDate,
      endDate: endDate,
      validated: true
    };

    executeJxa(`
      var app = Application.currentApplication()
      app.includeStandardAdditions = true
      var Calendar = Application("Calendar")
      
      var eventStart = new Date(${event.startDate.getTime()})
      var eventEnd = new Date(${event.endDate.getTime()})
      
      var projectCalendars = Calendar.calendars.whose({name: "${calendarName}"})
      var projectCalendar = projectCalendars[0]
      var event = Calendar.Event({
        summary: "${event.eventTitle}", 
        startDate: eventStart, 
        endDate: eventEnd, 
        alldayEvent: ${event.isAllDay},
      })
      projectCalendar.events.push(event)
    `);

    executeJxa(`
      var app = Application.currentApplication()
      app.includeStandardAdditions = true
      var Calendar = Application("Calendar")
      var date = new Date(${event.startDate.getTime()})
      Calendar.viewCalendar({at: date})
    `);
  };

  return (
    <List isLoading={isLoading} onSearchTextChange={parse} searchBarPlaceholder="write a meeting summary" throttle>
      <List.Section title="Your quick event">
          <List.Item
            key={randomId()}
            title={calendarText}
            icon={Icon.Calendar}
            actions={
              <ActionPanel>
                {calendars.map((calendar, calendarIndex) => (
                  <ActionPanel.Item
                    key={calendarIndex}
                    title={`Add to '${calendar}' Calendar`}
                    onAction={async () => {
                      await createEvent(calendarText, calendar);
                      await closeMainWindow({ clearRootSearch: true });
                    }}
                    icon={{ source: Icon.Calendar }}
                  />
                ))}
              </ActionPanel>
            }
          />
      </List.Section>
    </List>
  );
}
