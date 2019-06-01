/**
 * 加载数据状态的reducer
 *
 * @export
 * @template T
 * @param {State<T>} state 状态
 * @param {Action<T>} action 动作
 * @returns {State<T>}
 */
export default function reduer<T>(
  state: State<T>,
  action: Action<T>,
): State<T> {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isError: false,
        isLoading: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}
