import { renderHook } from '@testing-library/react-hooks';
import { HttpRequestConfig } from '@sinoui/http';
import useDataApi from './useDataApi';
import reducer from './reducer';
import fetchApi from './fetchApi';

jest.mock('./reducer');
jest.mock('./fetchApi');

beforeEach(() => {
  (reducer as jest.Mock).mockImplementation((state) => state);
});

afterEach(() => {
  (reducer as jest.Mock).mockReset();
  (fetchApi as jest.Mock).mockReset();
});

it('useDataApi创建时发送API请求', () => {
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);
  const { result } = renderHook(() => useDataApi('/users', 1));

  const { data, isLoading, isError } = result.current;
  expect(data).toBe(1);
  expect(isLoading).toBe(true);
  expect(isError).toBe(false);
  expect(fetchApi).toHaveBeenCalled();
  expect((fetchApi as jest.Mock).mock.calls[0][1]).toBe('/users');
});

it('再次发送请求', async () => {
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);

  const { result } = renderHook(() => useDataApi('/users', 1));

  const { doFetch } = result.current;
  doFetch('/users?text=张');

  expect(fetchApi).toHaveBeenCalledTimes(2);
});

it('默认情况下，可以使用同样的url发送请求', () => {
  const url = '/users';

  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);

  const { result } = renderHook(() => useDataApi(url, 1));

  const { doFetch } = result.current;
  doFetch(url);

  expect(fetchApi).toHaveBeenCalledTimes(2);
});

it('forceFetch = false时，不能使用相同的url发送请求', () => {
  const url = '/users';

  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);

  const { result } = renderHook(() => useDataApi(url, 1));

  const { doFetch } = result.current;
  doFetch(url, false);

  expect(fetchApi).toHaveBeenCalledTimes(1);
});

it('组件卸载时，取消数据加载', () => {
  const cancelMock = jest.fn();
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), cancelMock]);

  const { unmount } = renderHook(() => useDataApi('/users', 1));

  unmount();

  expect(cancelMock).toHaveBeenCalled();
});

it('再次发送请求时，取消上次进行中的请求', () => {
  const cancelMock = jest.fn();
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), cancelMock]);

  const { result, unmount } = renderHook(() => useDataApi('/users', 1));

  result.current.doFetch('/users'); // 取消默认发送的请求 （1）
  expect(cancelMock).toHaveBeenCalled();

  result.current.doFetch('/users'); // 取消上一次发送的请求 （2）
  unmount(); // 取消上一次发送的请求 （3）
  result.current.doFetch('/users'); // 上一次请求已取消，所以，不再执行取消

  expect(cancelMock).toHaveBeenCalledTimes(3);
});

it('更新数据', () => {
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);

  const { result } = renderHook(() => useDataApi('/users', 1));

  result.current.setData(2);

  expect(reducer as jest.Mock).toHaveBeenCalledWith(expect.anything(), {
    type: 'SET_DATA',
    payload: 2,
  });
});

it('指定空的url，则不会加载数据', () => {
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);

  const { result } = renderHook(() => useDataApi(undefined, 1));

  expect(fetchApi).not.toBeCalled();
  expect(result.current.isLoading).toBe(false);
});

it('使用空的url调用doFetch，不发送API请求', () => {
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);

  const { result } = renderHook(() => useDataApi(undefined, 1));

  result.current.doFetch('');

  expect(fetchApi).not.toBeCalled();
});

it('可以指定请求数据的配置', () => {
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);

  const options: HttpRequestConfig = {
    method: 'POST',
    transformResponse: jest.fn(),
  };
  renderHook(() => useDataApi('/users', 1, options));

  expect(fetchApi).toBeCalledWith(expect.anything(), '/users', options);
});

it('重新加载数据', () => {
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);

  const { result } = renderHook(() => useDataApi('/users', 1));

  const { reload } = result.current;
  reload();

  expect(fetchApi).toHaveBeenCalledTimes(2);
});

it('指定不同的url，发送不同的http请求', () => {
  (fetchApi as jest.Mock).mockReturnValue([Promise.resolve(), null]);
  const { rerender } = renderHook(
    ({ id }: { id: string }) => useDataApi(`/users/${id}`, 1),
    {
      initialProps: { id: '1' },
    },
  );

  expect((fetchApi as jest.Mock).mock.calls[0][1]).toBe('/users/1');

  rerender({ id: '2' });
  expect((fetchApi as jest.Mock).mock.calls[1][1]).toBe('/users/2');
});
