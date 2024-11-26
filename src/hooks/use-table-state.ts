import { useState } from "react";
import { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";

export default function useTableState<T>(initialQueryParams: T) {
  const [queryParams, setQueryParams] = useState<T>(initialQueryParams);
  const [sorting, setSorting] = useState<SortingState>([{ id: "updated_at", desc: true }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const onSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    setSorting((prev) => {
      const newSorting =
        typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

      if (newSorting.length > 0) {
        const sortColumn = newSorting[0];
        setQueryParams((prev) => ({
          ...prev,
          sort: sortColumn.id,
          order: sortColumn.desc ? "desc" : "asc",
        }));
      } else {
        setQueryParams((prev) => ({
          ...prev,
          sort: undefined,
          order: undefined,
        }));
      }

      return newSorting;
    });
  };

  const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPagination((prev) => {
      const newPagination =
        typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

      setQueryParams((prev) => ({
        ...prev,
        page: newPagination.pageIndex + 1,
        page_size: newPagination.pageSize,
      }));

      return newPagination;
    });
  };

  return {
    queryParams,
    setQueryParams,
    sorting,
    pagination,
    onSortingChange,
    onPaginationChange,
  };
}
