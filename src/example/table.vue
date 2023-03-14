<template>
    <ep-table
        :columns="columns"
        :request="request"
        :responseFormat="responseFormat"
        :pagination="pagination"
    >
        <template #topLeft>
            <el-button type="primary">上传</el-button>
        </template>
    </ep-table>
</template>

<script>
    export default {
        data() {
            return {
                request: {
                    url: "/table.json",
                },
                columns: [
                    {
                        type: "selection",
                        width: "30",
                    },
                    {
                        prop: "id",
                        label: "ID",
                        width: "80",
                        sortable: true,
                    },
                    {
                        prop: "name",
                        label: "文件名称",
                        sortable: true,
                    },
                    {
                        prop: "status",
                        label: "状态",
                        width: "大小",
                        width: "150",
                        sortable: true,
                        render: (h, {value}) => {
                            if (value == "正常")
                                return <el-tag type="success" size="medium" effect="plain">{value}</el-tag>;
                            else
                                return <el-tag  type="warning" size="medium" effect="plain">{value}</el-tag>;
                        }
                    },
                    {
                        prop: "size",
                        label: "大小",
                        width: "150",
                        sortable: true,
                    },
                    {
                        prop: "create_time",
                        label: "创建时间",
                        width: "250",
                        sortable: true,
                        show: false
                    },
                    {
                        prop: "update_time",
                        label: "更新时间",
                        width: "250",
                        sortable: true,
                    },
                    {
                        label: "操作",
                        width: "100",
                        render: (h, {value, row, scope}) => {
                            return <el-popover
                                placement="top"
                                width="160"
                                ref={"deletePop" + scope.$index}
                            >
                                <p>确定删除？</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" onClick={(e) =>
                                    {
                                        scope._self.$refs["deletePop" + scope.$index].showPopper = false;
                                    }}>取消</el-button>
                                    <el-button type="primary" size="mini" onClick={() => this.deleteRow(row.id, scope._self.$refs["deletePop" + scope.$index])}>确定</el-button>
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