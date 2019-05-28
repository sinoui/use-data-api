# @sinoui/use-data-api

使用[React Hooks](https://zh-hans.reactjs.org/docs/hooks-intro.html)实现数据加载的库。

## 安装

```shell
yarn add @sinoui/use-data-api
```

或者

```shell
npm i --save @sinoui/use-data-api
```

## 使用

```tsx
import React, { useState } from 'react';
import useDataApi from '@sinoui/useDataApi';

interface User {
  userId: string;
  userName: string;
}

function UserList() {
  const [searchText, setSearchText] = useState('');
  const { data, isLoading, isError, doFetch } = useDataApi<User[]>(
    '/users',
    [],
  );

  const handleSearch = () => {
    doFetch(`/users?text=${searchText}`);
    setSearchText('');
  };

  return (
    <div>
      <form>
        <label>姓名</label>
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button onClick={handleSearch}>查询</button>
      </form>
      {isLoading && <div>正在加载数据</div>}
      {isError && <div>加载数据失败</div>}
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.userName}</li>
        ))}
      </ul>
    </div>
  );
}
```

另外一个加载 Hacker News 的例子：

[例子源码](https://github.com/sinoui/use-data-api-example)，[例子效果](https://sinoui.github.io/use-data-api-example/)。

## 方法说明

```ts
import useDataApi from '@sinoui/use-data-api';

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
  doFetch: (url: string, forceFetch?: boolean) => void;
  /**
   * 更新数据
   */
  updateData: (data: T) => void;
}

/**
 * 数据加载hook
 *
 * @template T
 * @param {string} defaultUrl 默认加载数据的链接
 * @param {T} defaultValue 默认数据
 * @returns {DataSource<T>}
 */
function useDataApi<T>(defaultUrl: string, defaultValue: T): DataSource<T>;
```
