# js-intellisense README


## 配置说明
    basePath : 基础智能提示解析文件目录
    includeFiles : 需要解析的具体文件，当有此配置项的时候，其他文件不会被解析。属性path和files，需要配置。
    excludeFiles: 不需要解析的文件，有此配置的时候，该文件不会被解析。可以配置jquery，等等基础的文件。
    globalObject : 全局的对象索引，优先级比较高，如果你输入了改对象，并且输入'.'进行智能提示的时候，会先按照此配置项，进行提示。


## vsce 命令简介
    插件打包需要使用微软的工具，vsce，安装方法：npm install -g vsce
### 帮助命令
```
vsce --help
```
### 创建发布账户
```
vsce create-publisher shannonliang
```

### 发布语句，当前例子版本号（1.0.0）

+ 执行发布，需要手动修改版本号
    ```
    vsce publish
    ```
+ 执行发布，自动修改版本号 (2.0.0)
    ```
    vsce publish major
    ```
+   执行发布，自动修改版本号 (1.1.0)
    ```
    vsce publish minor
    ```
+ 执行发布，自动修改版本号(1.0.1)
    ```
    vsce publish patch
    ```
