export interface ValidationError<T> {
  field: T;
  message: string;
}

export interface BackendError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
}
