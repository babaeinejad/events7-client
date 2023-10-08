import { useEffect, useState } from "react";
import { hasEvents, hasIdProperty, hasNextPage, hasData } from "events/types";
import { AxiosResponse } from "axios";

interface IProps<T> {
  fetchNextPageData: (cursor: string) => Promise<AxiosResponse<T>>;
}
export function usePagination<T, DataType>({ fetchNextPageData }: IProps<T>) {
  const [pages, setPages] = useState<{
    [num: number]: T;
  }>({});
  const [currentPageData, setCurrentPageData] = useState<DataType[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    if (currentPage === 0) {
      goToNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  function getCursor() {
    const lastItem = currentPageData[currentPageData?.length - 1];
    return hasIdProperty(lastItem) ? lastItem.id : "0";
  }
  function goToNextPage() {
    const cursor = getCursor();
    if (pages[currentPage + 1]) {
      setError("");
      setCurrentPage((prev) => prev + 1);
      setIsLastPage(currentPage < Object.keys(pages).length);
      const currentPageData = pages[currentPage + 1];
      if (hasEvents(currentPageData)) {
        setCurrentPageData(currentPageData.events);
      }
      return;
    }

    setLoading(true);
    fetchNextPageData(cursor)
      .then((res) => {
        if (hasData(res)) {
          if (hasEvents(res.data) && hasNextPage(res.data)) {
            const { events, nextPageAvailable } = res.data;
            setError("");
            setIsLastPage(!nextPageAvailable);
            setPages((prev) => ({
              ...prev,
              [currentPage + 1]: res.data,
            }));
            setCurrentPageData(events);
            setCurrentPage((prev) => prev + 1);
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

  function goToPreviousPage() {
    if (currentPage > 1) {
      setIsLastPage(false);
      const currentPageData = pages[currentPage - 1];
      if (hasEvents(currentPageData)) {
        setCurrentPageData(currentPageData.events);
      }
      setCurrentPage((prev) => prev - 1);
    }
  }

  return {
    currentPage,
    currentPageData,
    isLastPage,
    error,
    loading,
    goToNextPage,
    goToPreviousPage,
  };
}
