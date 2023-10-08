/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, createContext, useEffect, useState } from "react";

import { Event7FormTypeWithId } from "events/dashboard/create-edit-event/formSchema";
import { EventsUrl, PAGE_SIZE } from "events/dashboard/consts";
import axios from "axios";
import { hasData, hasEvents, hasNextPage } from "events/types";

export type EventsPages = {
  [page: number]: Event7FormTypeWithId[];
};
export type EventsContextType = {
  events: EventsPages;
  cursor: string;
  error: string;
  loading: boolean;
  lastPage: number;
  deleteEvent: (item: Event7FormTypeWithId, currentPage: number) => void;
  createEvent: (item: Event7FormTypeWithId) => void;
  updateEvent: (item: Event7FormTypeWithId, currentPage: number) => void;
  fetchNewEvents: () => void;
};

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export default function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<{
    [page: number]: Event7FormTypeWithId[];
  }>({});

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [lastPage, setLastPage] = useState(0);

  const [cursor, setCursor] = useState("0");

  function createNewPage(newEvents: Event7FormTypeWithId[]) {
    const lastPage = getLastPage();
    setEvents((prev) => ({ ...prev, [lastPage + 1]: newEvents }));
  }

  function fetchNewEvents() {
    axios
      .get<{
        events: Event7FormTypeWithId[];
        nextPageAvailable: boolean;
      }>(EventsUrl + `cursored/${cursor}`)
      .then((res) => {
        if (hasData(res)) {
          if (hasEvents(res.data) && hasNextPage(res.data)) {
            const { events, nextPageAvailable } = res.data;
            setError("");
            createNewPage(events);
            if (!nextPageAvailable) {
              const lastPage = getLastPage();
              setLastPage(lastPage + 1);
            }
          }
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getAllEvents() {
    let allEvents: Event7FormTypeWithId[] = [];
    const eventsPages = Object.values(events);
    allEvents = allEvents.concat(...eventsPages);
    return allEvents;
  }

  useEffect(() => {
    const allEvents = getAllEvents();
    const lastIndex = allEvents.length - 1;
    const cursor = allEvents[lastIndex]?.id;
    if (cursor) {
      setCursor(cursor);
    }

    if (lastPage > 0) {
      const newLastPage = getLastPage();
      setLastPage(newLastPage);
    }
  }, [events]);

  function sortEvents() {
    const newEvents: EventsPages = {};
    const allEvents = getAllEvents();
    for (let i = 0; i < Math.ceil(allEvents.length / PAGE_SIZE); i++) {
      const pageEvents = allEvents.slice(
        i * PAGE_SIZE,
        i * PAGE_SIZE + PAGE_SIZE
      );
      newEvents[i + 1] = pageEvents;
    }
    setEvents(newEvents);
  }

  function deleteEvent(event: Event7FormTypeWithId, currentPage: number) {
    const updatedEvents = { ...events };
    const itemIndex = updatedEvents[currentPage].findIndex(
      (item) => item.id === event.id
    );
    if (itemIndex >= 0) {
      updatedEvents[currentPage].splice(itemIndex, 1);
    }
    setEvents(updatedEvents);
    sortEvents();
  }

  function getLastPage() {
    return Object.keys(events).length;
  }

  function createEvent(event: Event7FormTypeWithId) {
    const lastPage = getLastPage();
    if (events[lastPage].length < PAGE_SIZE) {
      setEvents((prev) => ({
        ...prev,
        [lastPage]: [...prev[lastPage], event],
      }));
    } else {
      setLastPage(lastPage + 1);
      createNewPage([event]);
    }
  }

  function updateEvent(event: Event7FormTypeWithId, currentPage: number) {
    const updatedEvents = { ...events };
    const itemIndex = updatedEvents[currentPage].findIndex(
      (item) => item.id === event.id
    );
    if (itemIndex >= 0) {
      updatedEvents[currentPage].splice(itemIndex, 1, event);
    }
    setEvents(updatedEvents);
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        error,
        loading,
        lastPage,
        cursor,
        deleteEvent,
        createEvent,
        updateEvent,
        fetchNewEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}
