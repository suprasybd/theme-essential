export interface SingleResposeType {
  Mesasge: string;
  Success: boolean;
  Error: string;
}

export interface ResponseType<T> {
  Message: string;
  Success: boolean;
  Data: T;
}

export interface ListResponseType<T> {
  Mesasge: string;
  Success: boolean;
  Data: T[];
}
