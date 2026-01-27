export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

export function getPaginationParams(options: PaginationOptions = {}) {
  const { page = 1, limit = 12, maxLimit = 100 } = options;
  
  const currentPage = Math.max(1, Number(page));
  const itemsPerPage = Math.min(Math.max(1, Number(limit)), maxLimit);
  const skip = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    skip,
  };
}

export function createPaginationResult<T>(
  data: T[],
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationResult<T> {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    data,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}
