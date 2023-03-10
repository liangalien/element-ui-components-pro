<template>
    <div>
        <div class="table-top">
            <div class="table-top-left">
                <slot name="topLeft"></slot>
                <el-input
                        v-if="searchField != false"
                        placeholder="关键字查询"
                        v-model="search">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>

            <div class="table-top-right">
                <slot name="topRight"></slot>
                <el-button v-if="extra && extra.indexOf('refresh') != -1" type="text" icon="el-icon-refresh-left" @click="getTableData()"></el-button>
                <el-popover
                    trigger="click"
                >
                    <el-checkbox
                            v-model="columnsCheckedAll"
                            :indeterminate="columnsCheckedIndeterminate"
                            @change="columnsCheckAllChange"
                    >全选</el-checkbox>
                    <el-divider style="margin: 5px 0"></el-divider>
                    <el-checkbox-group
                            v-model="columnsChecked"
                            @change="columnsCheckChange"
                    >
                        <div v-for="column in columnsCur">
                            <el-checkbox :label="column.prop" :key="column.prop">{{column.label}}</el-checkbox>
                        </div>

                    </el-checkbox-group>
                    <el-button  v-if="extra && extra.indexOf('columns') != -1" slot="reference" type="text" icon="el-icon-setting"></el-button>
                </el-popover>
            </div>
        </div>
        <el-table
                :data="tableData"
                v-loading="loading"
                sort-method="false"
                @sort-change="sortChange"
                style="width: 100%">
            <el-table-column
                    v-for="item in columnsCur"
                    v-if="item.show != false"
                    :key="item.prop"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :align="item.align"
                    :sortable="item.sortable ? 'custom' : false"
            >
                <template slot-scope="scope">
                    <ep-render v-if="item.render" :scope="scope" :row="scope.row" :render="item.render" :value="scope.row[item.prop]"></ep-render>

                    <div v-else>{{scope.row[item.prop]}}</div>
                </template>
            </el-table-column>

        </el-table>

        <div class="table-bottom-right">
            <el-pagination
                    background
                    :layout="pagination.layout"
                    :current-page="pagination.pageNo"
                    :page-size="pagination.pageSize"
                    :page-sizes="pagination.pageSizes"
                    :total="pagination.total"
                    @current-change="pageChange"
                    @size-change="sizeChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Http from '../utils/http';

    export default {
        name: "index",
        props: {
            request: Object,
            responseFormat: Function,
            columns: Array,
            pagination: {
                type: Object,
                default: {
                    total: 0,
                    pageSize: 10,
                    pageSizes: [10, 50, 100, 200],
                    pageNo: 1,
                    layout: "total, prev, pager, next, sizes"
                }
            },
            searchField: {type: [String, Boolean], default: "search"},
            extra: {type: Array, default: ["refresh", "columns"]}
        },
        data() {
            return {
                tableData: [],
                loading: false,
                search: null,
                sortBy: null,
                columnsCur: [],
                columnsAll: [],
                columnsChecked: [],
                columnsCheckedAll: true,
                columnsCheckedIndeterminate: false
            }
        },
        methods: {
            getTableData: function() {
                if (!this.request) return;

                var url = this.request.url;
                var method = this.request.method;
                var params = this.request.params;
                var data = this.request.data;

                //自带属性，如翻页、排序、搜索放在哪个字段（params/data）。
                var optionField = this.request.optionField;
                var option = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    [this.searchField]: this.search,
                    sortBy: this.sortBy
                };

                if (optionField == "data" || (!optionField && (method || "GET").toUpperCase() == "POST")) data = {...option, ...data};
                else params = {...option, ...params};

                var responseFormat = this.responseFormat;

                this.loading = true;
                Http.easyRequest(url, method, params, data,
                    final => {
                        if (!responseFormat) {
                            this.tableData = final.rows;
                            this.pagination.total = final.total == undefined && final.rows.length || final.total || 0;
                        } else {
                            var {rows, total} = responseFormat(final);
                            this.tableData = rows;
                            this.pagination.total = total;
                        }
                        this.loading = false;
                    });
            },
            pageChange: function(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getTableData();
            },
            sizeChange: function(pageSize) {
                this.pagination.pageSize = pageSize;
                this.getTableData();
            },
            sortChange: function(sortable) {
                var sortBy = {[sortable.prop]: sortable.order};
                this.sortBy = (this.request.method == "GET" || !this.request.method) && JSON.stringify(sortBy) || sortBy;
                this.getTableData();
            },
            columnsCheckAllChange(val) {
                this.columnsChecked = val ? this.columnsAll : [];
                this.columnsCheckedIndeterminate = false;

                this.setColumnShow(val);
            },
            columnsCheckChange(value) {
                var checkedCount = value.length;
                var allCount = this.columnsAll.length;

                this.columnsChecked = value;
                this.columnsCheckedAll = checkedCount === allCount;
                this.columnsCheckedIndeterminate = checkedCount > 0 && checkedCount < allCount;

                this.setColumnShow();
            },
            setColumnShow: function (value=null) {
                this.columnsCur = this.columnsCur.map(column => {
                    return {
                        ...column,
                        show: value == null ? this.columnsChecked.indexOf(column.prop) != -1 : value
                    };
                });
            }
        },
        mounted() {
            this.columnsCur = this.columns;
            this.columnsAll = this.columnsCur.map(column => column.prop);
            this.columnsChecked = this.columnsCur.filter(column => column.show != false).map(column => column.prop);

            this.columnsCheckedAll = this.columnsAll.length === this.columnsChecked.length;
            this.getTableData();
        },
        watch: {
            search: function () {
                this.getTableData();
            },
        }
    }
</script>

<style scoped>
    .table-top {
        margin-bottom: 10px;
    }

    .table-top-left {
        float: left;
        display: flex;
    }

    .table-top-left .input-with-select {
        width: 300px;
    }

    .table-top-left * {
        margin-right: 15px;
    }

    .table-top-right {
        float: right;
        display: flex;
        font-size:20px;
    }

    .table-top-right button{
        font-size:20px;
    }

    .table-top-right > * {
        margin-right: 5px;
    }

    .table-bottom-right {
        text-align: right;
        margin-top: 20px;
    }

    .table-bottom-right .el-pagination {
        padding: 0;
    }

    .el-popover {
        margin: 0 !important;
    }

    .el-select input {
        height: 32px !important;
        line-height: 32px !important;
    }

    .el-divider--horizontal {
        margin: 5px 0 !important;
    }
</style>