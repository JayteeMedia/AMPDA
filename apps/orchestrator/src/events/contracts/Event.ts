export interface Event<T = unknown> {
  id: string;
  type: string;
  timestamp: string;
  payload: T;
}
