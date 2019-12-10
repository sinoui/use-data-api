import { useEffect, useCallback, useRef, useReducer } from 'react';
import { HttpRequestConfig } from '@sinoui/http';
import reduer from './reducer';
import fetchApi from './fetchApi';
import { State, FetchApiReducer } from './types';

interface DataSource<T> {
  /**
   * 从API中获取到的数据
   */
  data: T;
  /**
   * 数据加载中状态。`true`表示数据加载中。
   */
  isLoading: boolean;
  /**
   * 数据加载失败状态。`true`表示数据加载失败。
   */
  isError: boolean;
  /**
   * 加载数据
   *
   * @param {string} url 获取数据的url
   * @param {boolean} forceFetch 当指定的`url`与上一次请求的`url`一致时，是否发送API请求。
   *                              默认为`true`，表示发送请求。
   */
  doFetch: (url?: string, forceFetch?: boolean) => void;
  /**
   * 更新数据状态
   *
   * @param {T} data 新的数据。
   */
  setData: (data: T) => void;

  /**
   * 重新加载数据
   */
  reload: () => void;
}

/**
 * 加载数据hook
 *
 * @export
 * @template T
 * @param {string} defaultUrl 默认的加载数据url
 * @param {T} defaultData 默认数据
 * @returns
 */
export default function useDataApi<T>(
  defaultUrl: string | undefined,
  defaultData: T,
  options?: HttpRequestConfig,
): DataSource<T> {
  const initialState: State<T> = {
    data: defaultData,
    isLoading: true,
    isError: false,
  };
  const [state, dispatch] = useReducer<FetchApiReducer<T>>(
    reduer,
    initialState,
  );
  const urlRef = useRef<string | undefined>(defaultUrl);
  const cancelRef = useRef<() => void>();
  const optionsRef = useRef(options);

  const doCancel = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = undefined;
    }
  }, []);

  const doFetch = useCallback(
    (url?: string, forceUpdate = true) => {
      if (!url) {
        return;
      }

      if (!forceUpdate && urlRef.current === url) {
        return;
      }
      urlRef.current = url;

      doCancel();

      const [, cancel] = fetchApi(dispatch, url, optionsRef.current);
      cancelRef.current = cancel;
    },
    [doCancel],
  );

  const reload = useCallback(() => {
    doFetch(urlRef.current);
  }, [doFetch]);

  useEffect(() => {
    if (urlRef.current) {
      doFetch(urlRef.current);
    }
    return doCancel;
  }, [doFetch, doCancel]);

  const setData = (data: T) => {
    dispatch({ type: 'SET_DATA', payload: data });
  };

  return { ...state, doFetch, setData, reload };
}
