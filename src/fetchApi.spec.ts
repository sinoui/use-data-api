import http from '@sinoui/http';
import fetchApi from './fetchApi';

jest.mock('@sinoui/http');

it('fetch api', async () => {
  const dispatch = jest.fn();
  (http.get as jest.Mock).mockResolvedValue(1);

  const [promise] = fetchApi(dispatch, '/users');

  await promise;

  expect(dispatch).toHaveBeenCalledWith({ type: 'FETCH_INIT' });
  expect(dispatch).toHaveBeenCalledWith({ type: 'FETCH_SUCCESS', payload: 1 });
});

it('fetch error', async () => {
  const dispatch = jest.fn();
  (http.get as jest.Mock).mockRejectedValue('错误');

  const [promise] = fetchApi(dispatch, '/users');

  await promise;

  expect(dispatch).toHaveBeenCalledWith({ type: 'FETCH_INIT' });
  expect(dispatch).toHaveBeenCalledWith({ type: 'FETCH_FAILURE' });
});

it('先请求，再取消，之后响应成功', async () => {
  const dispatch = jest.fn();
  (http.get as jest.Mock).mockResolvedValue(1);

  const [promise, cancel] = fetchApi(dispatch, '/users');
  cancel();

  await promise;

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith({ type: 'FETCH_INIT' });
  expect(dispatch).not.toHaveBeenCalledWith({
    type: 'FETCH_SUCCESS',
    payload: 1,
  });
});

it('先请求，再取消，之后响应失败', async () => {
  const dispatch = jest.fn();
  (http.get as jest.Mock).mockRejectedValue('错误');

  const [promise, cancel] = fetchApi(dispatch, '/users');
  cancel();

  try {
    await promise;
  } catch (e) {
    // 忽略错误
  }

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith({ type: 'FETCH_INIT' });
  expect(dispatch).not.toHaveBeenCalledWith({
    type: 'FETCH_FAILURE',
  });
});
