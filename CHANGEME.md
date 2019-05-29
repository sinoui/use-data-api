# CHANGELOG

## v0.3.0 2019-05-29

* feat: 可指定API请求配置

    如下：

    ```ts
    const transformResponse = (data) => data.map(item => item.userName); // 将人员信息列表转换成人名列表

    const dataSource = useDataApi('/users', [], {
    transformResponse,
    method: 'POST',
    });
    ```

## v0.2.0 - 2019-05-28

* feat: url为空时，不发送API请求
