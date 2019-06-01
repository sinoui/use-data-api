import reducer from './reducer';

it('fetch init', () => {
  const result = reducer(
    {
      isLoading: false,
      isError: true,
      data: 1,
    },
    { type: 'FETCH_INIT' },
  );
  expect(result.isLoading).toBe(true);
  expect(result.isError).toBe(false);
});

it('fetch success', () => {
  const result = reducer(
    {
      isLoading: true,
      isError: true,
      data: 1,
    },
    { type: 'FETCH_SUCCESS', payload: 2 },
  );

  expect(result).toEqual({
    isLoading: false,
    isError: false,
    data: 2,
  });
});

it('fetch failure', () => {
  const result = reducer(
    {
      isLoading: true,
      isError: false,
      data: 1,
    },
    { type: 'FETCH_FAILURE' },
  );

  expect(result).toEqual({
    isLoading: false,
    isError: true,
    data: 1,
  });
});

it('non exists action', () => {
  const prevState = {
    isLoading: true,
    isError: false,
    data: 1,
  };
  const result = reducer(prevState, { type: 'any' } as any);

  expect(result).toEqual(prevState);
});

it('更新数据', () => {
  const result = reducer(
    {
      isLoading: true,
      isError: false,
      data: 1,
    },
    { type: 'SET_DATA', payload: 2 },
  );

  expect(result).toEqual({
    isLoading: true,
    isError: false,
    data: 2,
  });
});
