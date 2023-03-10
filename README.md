# element-ui组件封装

基于element-ui，封装一些常用的组件，比如分页表格、分页下拉框，以到达开箱即用的目的。

## 安装

前提是已安装了element-ui，安装教程可见：<https://element.eleme.io/#/zh-CN/component/installation>

```bash
npm install element-ui-components-pro
```

## 使用

main.js

```javascript
import Vue from 'vue';
import ElementUI from 'element-ui';
import ElementUIPro from 'element-ui-components-pro';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(ElementUIPro);
```

table.vue

```javascript
<template>
    <ep-table
        :columns="columns"
        :request="request"
        :responseFormat="responseFormat"
        :pagination="pagination"
    >
    </ep-table>
</template>

<script>
    export default {
        data() {
            return {
                request: {
                    url: "/files/get",
                    method: "GET",
					params: null,
					data: null
                },
                columns: [
                    {
                        prop: "id",
                        label: "ID",
                        width: "80",
                        sortable: true,
                    },
                    {
                        prop: "name",
                        label: "文件名称",
                        width: "400",
                        sortable: true,
                    },
					{
                        prop: "status",
                        label: "状态",
                        width: "100",
                        sortable: true,
                        render: (h, {value}) => {
                            if (value == "正常")
                                return <el-tag type="success" effect="plain">{value}</el-tag>;
                            else
                                return <el-tag  type="warning" effect="plain">{value}</el-tag>;
                        }
                    },
                    {
                        label: "操作",
                        width: "100",
                        render: (h, {value, row, scope, index}) => {
                            return <el-popover
                                placement="top"
                                width="160"
                                ref={"deletePop" + index}
                            >
                                <p>确定删除？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" onClick={(e) =>
                                    {
                                        scope._self.$refs["deletePop" + index].showPopper = false;
                                    }}>取消</el-button>
                                    <el-button type="primary" size="mini" onClick={() => this.deleteRow(row.id, scope._self.$refs["deletePop" + index])}>确定</el-button>
                                </div>
                                <a href="javascript:void(0)" slot="reference">删除</a>
                            </el-popover>
                        }
                    }
                ],
            }
        },
        methods: {
            responseFormat: function (resp) {
                if (resp.success) {
                    return {
                        rows: resp.body.rows,
                        total: resp.body.total
                    }
                }
            },
            deleteRow: function (id, popper) {
                popper.showPopper = false;
            },
        }
    }
</script>
```

table预览

![image](https://github.com/liangalien/element-ui-components-pro/blob/master/images/table1.png)

## 开发

```bash
npm i
npm run dev
```

