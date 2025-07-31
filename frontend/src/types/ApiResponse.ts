export type ApiError<E> = { message: E };

export type ApiResponse<T, E extends string> =
  | { data: T; error: null }
  | { data: null; error: ApiError<E> };
