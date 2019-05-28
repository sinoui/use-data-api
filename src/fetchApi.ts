import http from '@sinoui/http';

/**
 * 请求API
 *
 * @export
 * @template T
 * @param {(action: Action<T>) => void} dispatch action发送器
 * @param {string} url API的链接
 * @returns {[Promise<T>, () => void]} 返回包含API结果的承诺和取消函数
 */
export default function fetchApi<T>(
  dispatch: (action: Action<T>) => void,
  url: string,
): [Promise<void>, () => void] {
  let didCancel = false;
  const doFetch = async () => {
    dispatch({ type: 'FETCH_INIT' });
    try {
      const result = await http.get<T>(url);
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
