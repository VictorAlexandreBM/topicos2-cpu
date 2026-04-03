export interface BackendValidationError<T> {
  field: T;
  message: string;
}
