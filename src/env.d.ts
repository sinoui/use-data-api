interface State<T> {
  data: T;
  isLoading: boolean;
  isError: boolean;
}

type Action<T> =
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
      type: 'UPDATE_DATA';
      payload: T;
    };

declare type FetchApiReducer<T> = React.Reducer<State<T>, Action<T>>;
