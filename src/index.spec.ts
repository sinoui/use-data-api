import http from '@sinoui/http';
import { renderHook } from 'react-hooks-testing-library';
import useDataApi from './index';

jest.mock('@sinoui/http');

it('useDataApi is defined', () => {
  expect(useDataApi).toBeDefined();
});

// 以下部分是验收测试

it('获取远程数据', async () => {
  const user = {
    userId: '1',
    userName: '张三',
  };
  (http.get as jest.Mock).mockResolvedValue(user);

  const { result, waitForNextUpdate } = renderHook(() =>
    useDataApi('/users', null),
  );

  expect(result.current.data).toBeNull();

  await waitForNextUpdate();

  expect(result.current.data).toBe(user);
});

it('再次获取远程数据', async () => {
  (http.get as jest.Mock).mockResolvedValueOnce(1).mockResolvedValueOnce(2);

  const { result, waitForNextUpdate } = renderHook(() =>
    useDataApi('/users', 0),
  );

  await waitForNextUpdate();

  result.current.doFetch('/users');

  await waitForNextUpdate();

  expect(result.current.data).toBe(2);
});

it('doFetch(url, false)如果url相同，则不发送请求', async () => {
  (http.get as jest.Mock).mockResolvedValueOnce(1);

  const { result, waitForNextUpdate } = renderHook(() =>
    useDataApi('/users', 0),
  );

  await waitForNextUpdate();

  result.current.doFetch('/users', false);

  expect(result.current.data).toBe(1);
});

it('加载中状态', async () => {
  (http.get as jest.Mock).mockResolvedValue(1);

  const { result, waitForNextUpdate } = renderHook(() =>
    useDataApi('/users', 0),
  );

  expect(result.current.isLoading).toBe(true);

  await waitForNextUpdate();

  expect(result.current.isLoading).toBe(false);
});

it('加载错误', async () => {
  (http.get as jest.Mock).mockRejectedValue('加载错误');

  const { result, waitForNextUpdate } = renderHook(() =>
    useDataApi('/users', 0),
  );

  await waitForNextUpdate();

  expect(result.current.isError).toBe(true);
  expect(result.current.isLoading).toBe(false);
});

it('加载失败再次加载成功', async () => {
  (http.get as jest.Mock)
    .mockRejectedValueOnce('加载错误')
    .mockResolvedValueOnce(1);

  const { result, waitForNextUpdate } = renderHook(() =>
    useDataApi('/users', 0),
  );
  await waitForNextUpdate();

  result.current.doFetch('/users');

  await waitForNextUpdate();

  expect(result.current.isError).toBe(false);
});

it('取消加载', async () => {
  (http.get as jest.Mock).mockResolvedValue(1);

  const { result, unmount } = renderHook(() => useDataApi('/users', 0));

  unmount();

  expect(result.current.data).toBe(0);
});
