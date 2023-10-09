/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

import { Event7FormTypeWithId } from "events/dashboard/create-edit-event/formSchema";
export type EventsPages = {
  [page: number]: Event7FormTypeWithId[];
};
export type EventsContextType = {
  events?: EventsPages;
  cursor: string;
  error: string;
  loading: boolean;
  lastPage: number;
  deleteEvent: (item: Event7FormTypeWithId, currentPage: number) => void;
  createEvent: (item: Event7FormTypeWithId) => void;
  updateEvent: (item: Event7FormTypeWithId, currentPage: number) => void;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  currentPageData: Event7FormTypeWithId[];
};

export const EventsContext = createContext<EventsContextType>({
  cursor: "0",
  error: "",
  loading: false,
  lastPage: 0,
  deleteEvent: (_item: Event7FormTypeWithId, _currentPage: number) => {},
  createEvent: (_item: Event7FormTypeWithId) => {},
  updateEvent: (_item: Event7FormTypeWithId, _currentPage: number) => {},
  currentPage: 0,
  goToNextPage: () => {},
  goToPreviousPage: () => {},
  currentPageData: [],
});
