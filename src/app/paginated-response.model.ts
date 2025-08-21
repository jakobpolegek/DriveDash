export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
    next_page: number | null;
    prev_page: number | null;
  };
  filters: any;
}
