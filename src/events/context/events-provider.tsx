/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { Event7FormTypeWithId } from "events/dashboard/create-edit-event/formSchema";
import { EventsContext, EventsPages } from "events/context/events-context";
import { EventsUrl, PAGE_SIZE } from "events/dashboard/consts";
import { ReactNode, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { hasData, hasEvents, hasNextPage } from "events/types";

export default function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<{
    [page: number]: Event7FormTypeWithId[];
  }>({});

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [lastPage, setLastPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [cursor, setCursor] = useState("0");

  useEffect(() => {
    if (currentPage === 0) {
      goToNextPage();
    }
  }, [currentPage]);

  function goToNextPage() {
    setCurrentPage(currentPage + 1);
  }

  const lastLoadedPage = useMemo(
    () => (events ? Object.keys(events).length : 0),
    [events]
  );

  useEffect(() => {
    if (lastPage === 0 && currentPage === lastLoadedPage) {
      fetchNewEvents();
    }
  }, [cursor, currentPage]);

  function goToPreviousPage() {
    setCurrentPage(currentPage - 1);
  }

  function createNewPage(newEvents: Event7FormTypeWithId[]) {
    setEvents((prev) => ({ ...prev, [lastLoadedPage + 1]: newEvents }));
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
              setLastPage(lastLoadedPage);
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
      const newLastPage = lastLoadedPage;
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

  function createEvent(event: Event7FormTypeWithId) {
    const lastPage = lastLoadedPage;
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

  useEffect(() => {
    if (lastPage > 0 && currentPage > lastPage) {
      goToPreviousPage();
      return;
    }
  }, [events, lastPage]);

  return (
    <EventsContext.Provider
      value={{
        error,
        loading,
        lastPage,
        cursor,
        currentPage,
        currentPageData: events[currentPage],
        deleteEvent,
        createEvent,
        updateEvent,
        goToNextPage,
        goToPreviousPage,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}
