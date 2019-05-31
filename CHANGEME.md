# CHANGELOG

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
