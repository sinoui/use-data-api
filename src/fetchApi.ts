import http, { HttpRequestConfig } from '@sinoui/http';
import { Action } from './types';

/**
 * 请求API
 *
 * @export
 * @template T
 * @param {(action: Action<T>) => void} dispatch action发送器
 * @param {string} url API的链接
 * @param {HttpRequestConfig} options 请求配置
 * @returns {[Promise<T>, () => void]} 返回包含API结果的承诺和取消函数
 */
export default function fetchApi<T>(
  dispatch: (action: Action<T>) => void,
  url: string,
  options?: HttpRequestConfig,
): [Promise<void>, () => void] {
  let didCancel = false;
  const doFetch = async () => {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const method = ((options && options.method) || 'get').toLowerCase() as
        | 'get'
        | 'post'
        | 'put';

      const result =
        method === 'get'
          ? await http.get<T>(url, options)
          : await http[method]<T>(url, undefined, options);
      if (!didCancel) {
        dispatch({ type: 'FETCH_SUCCESS', payload: result });
      }
    } catch (e) {
      if (!didCancel) {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    }
  };

  const cancel = () => {
    didCancel = true;
  };
  return [doFetch(), cancel];
}
