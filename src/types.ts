export interface State<T> {
  data: T;
  isLoading: boolean;
  isError: boolean;
}

export type Action<T> =
  | {
      type: 'FETCH_INIT';
    }
  | {
      type: 'FETCH_SUCCESS';
      payload: T;
    }
  | {
      type: 'FETCH_FAILURE';
    }
  | {
      type: 'SET_DATA';
      payload: T;
    };

export type FetchApiReducer<T> = React.Reducer<State<T>, Action<T>>;
