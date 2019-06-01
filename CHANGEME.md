# CHANGELOG

## v0.4.0 2019-06-01

- feat: `DataSource.updateData`变更为`DataSource.setData`

  这是一个破坏性变更。之所以需要有这样的变更，是为了保持设置状态的方法命名习惯。

  使用`useState`时，我们经常这样取名：

  ```javascript
  const [state, setState] = useState();
  ```

  在大部分开发过程中，也基本上以`set`开头。所以，我们按照约定俗成，也采用这样的命名规则。

  ```javascript
  import useDataApi from '@sinoui/use-data-api';

  const { data, setData } = useDataApi('/users');
  ```

## v0.3.2 2019-05-31

- fix: 修复.d.ts 导出错误

## v0.3.1 2019-05-31

- fix: 升级@sinoui/http 依赖版本号，修复 axios 的安全漏洞

## v0.3.0 2019-05-29

- feat: 可指定 API 请求配置

  如下：

  ```ts
  const transformResponse = (data) => data.map((item) => item.userName); // 将人员信息列表转换成人名列表

  const dataSource = useDataApi('/users', [], {
    transformResponse,
    method: 'POST',
  });
  ```

## v0.2.0 - 2019-05-28

- feat: url 为空时，不发送 API 请求
