// API related types
export type ApiResponse<T = any> = {
  data: T;
  success: boolean;
  message?: string;
};

export type ApiError = {
  success: false;
  message: string;
  code?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>;

export type SortOrder = 'asc' | 'desc';

export type FilterParams = {
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
};
