# element-ui�����װ

����element-ui����װһЩ���õ�����������ҳ��񡢷�ҳ�������Ե��￪�伴�õ�Ŀ�ġ�

## ��װ

ǰ�����Ѱ�װ��element-ui����װ�̳̿ɼ���<https://element.eleme.io/#/zh-CN/component/installation>

```bash
npm install element-ui-components-pro
```

## ʹ��

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
                        label: "�ļ�����",
                        width: "400",
                        sortable: true,
                    },
					{
                        prop: "status",
                        label: "״̬",
                        width: "100",
                        sortable: true,
                        render: (h, {value}) => {
                            if (value == "����")
                                return <el-tag type="success" effect="plain">{value}</el-tag>;
                            else
                                return <el-tag  type="warning" effect="plain">{value}</el-tag>;
                        }
                    },
                    {
                        label: "����",
                        width: "100",
                        render: (h, {value, row, scope, index}) => {
                            return <el-popover
                                placement="top"
                                width="160"
                                ref={"deletePop" + index}
                            >
                                <p>ȷ��ɾ����</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" onClick={(e) =>
                                    {
                                        scope._self.$refs["deletePop" + index].showPopper = false;
                                    }}>ȡ��</el-button>
                                    <el-button type="primary" size="mini" onClick={() => this.deleteRow(row.id, scope._self.$refs["deletePop" + index])}>ȷ��</el-button>
                                </div>
                                <a href="javascript:void(0)" slot="reference">ɾ��</a>
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

tableԤ��

![image](https://github.com/liangalien/element-ui-components-pro/blob/master/images/table1.png)

## ����

```bash
npm i
npm run dev
```

