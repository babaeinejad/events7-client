import { useEffect, useState } from "react";
import { hasData } from "shared-components/types";
import { hasIdProperty } from "./../../events/types";

interface IProps<DataType> {
  fetchNextPageData: (cursor: string) => Promise<DataType>;
  pageSize: number;
}
export function usePagination<DataType>({
  pageSize,
  fetchNextPageData,
}: IProps<DataType>) {
  const [pages, setPages] = useState<{
    [num: number]: DataType[];
  }>({});
  const [currentPageData, setCurrentPageData] = useState<DataType[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [cursor, setCursor] = useState("0");
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    if (currentPage === 0) {
      goToNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  function checkLastPage(data: DataType[]) {
    if (data.length < pageSize) {
      setIsLastPage(true);
    }
  }
  function goToNextPage() {
    if (pages[currentPage + 1]) {
      checkLastPage(pages[currentPage + 1]);
      setCurrentPage((prev) => prev + 1);
      setCurrentPageData(pages[currentPage + 1]);
      return;
    }
    setLoading(true);
    fetchNextPageData(cursor)
      .then((res) => {
        if (hasData(res)) {
          if (hasIdProperty(res.data[res.data.length - 1])) {
            checkLastPage(res.data);
            setPages((prev) => ({
              ...prev,
              [currentPage + 1]: res.data,
            }));
            setCursor("" + res.data[res.data.length - 1].id);
          }
          setCurrentPageData(res.data);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
    setCurrentPage((prev) => prev + 1);
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      setIsLastPage(false);
      setCurrentPageData(pages[currentPage - 1]);
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
