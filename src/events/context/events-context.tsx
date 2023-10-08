import { ReactNode, createContext, useState } from "react";

import { Event7FormTypeWithId } from "events/dashboard/create-edit-event/formSchema";

type EventsContextType = {
  events: Event7FormTypeWithId[];
  appendToEvents: (events: Event7FormTypeWithId[]) => void;
  deleteEvent: (id: string) => void;
  createEvent: (item: Event7FormTypeWithId) => void;
  updateEvent: (item: Event7FormTypeWithId) => void;
};
export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export default function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event7FormTypeWithId[]>([]);

  function appendToEvents(events: Event7FormTypeWithId[]) {
    setEvents((prev) => [...prev, ...events]);
  }
  function deleteEvent(id: string) {
    const updatedEvents = { ...events };
    const itemIndex = updatedEvents.findIndex((item) => item.id === id);
    if (itemIndex >= 0) {
      updatedEvents.splice(itemIndex, 1);
    }
    setEvents(updatedEvents);
  }

  function createEvent(event: Event7FormTypeWithId) {
    setEvents((prev) => [...prev, event]);
  }

  function updateEvent(event: Event7FormTypeWithId) {
    const updatedEvents = { ...events };
    const itemIndex = updatedEvents.findIndex((item) => item.id === item.id);
    if (itemIndex >= 0) {
      updatedEvents.splice(itemIndex, 1, event);
    }
    setEvents(updatedEvents);
  }

  return (
    <EventsContext.Provider
      value={{ events, appendToEvents, deleteEvent, createEvent, updateEvent }}
    >
      {children}
    </EventsContext.Provider>
  );
}
