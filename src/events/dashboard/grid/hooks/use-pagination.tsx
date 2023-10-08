/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import {
  EventsContext,
  EventsContextType,
} from "events/context/events-context";
import { Event7FormTypeWithId } from "events/dashboard/create-edit-event/formSchema";

export function usePagination() {
  const { events, fetchNewEvents, lastPage } = useContext(
    EventsContext
  ) as EventsContextType;
  const [currentPageData, setCurrentPageData] = useState<
    Event7FormTypeWithId[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    if (currentPage === 0) {
      goToNextPage();
    }
  }, [currentPage]);

  function goToNextPage() {
    setCurrentPage((prev) => prev + 1);
    if (events[currentPage + 1]) {
      const currentPageData = events[currentPage + 1];
      if (currentPageData) {
        setCurrentPageData(currentPageData);
      }
      return;
    }

    fetchNewEvents();
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      const currentPageData = events[currentPage - 1];
      if (currentPageData) {
        setCurrentPageData(currentPageData);
      }
      setCurrentPage((prev) => prev - 1);
    }
  }

  useEffect(() => {
    if (lastPage > 0 && currentPage > lastPage) {
      setCurrentPage(lastPage);
      setCurrentPageData(events[lastPage]);
      return;
    }
    if (events && currentPage) {
      setCurrentPageData(events[currentPage]);
    }
  }, [events, lastPage]);

  return {
    currentPage,
    currentPageData,
    lastPage,
    goToNextPage,
    goToPreviousPage,
  };
}
