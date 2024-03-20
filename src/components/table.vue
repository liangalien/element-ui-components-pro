<template>
    <div class="ep-table">
        <div class="table-top">
            <div class="table-top-left">
                <el-input
                        v-if="searchField != false"
                        placeholder="关键字查询"
                        v-model="search">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <slot name="topLeft"></slot>
            </div>

            <div class="table-top-right">
                <slot name="topRight"></slot>
                <el-button v-if="extra && extra.indexOf('refresh') != -1" type="text" icon="el-icon-refresh-left"
                           @click="getTableData()"></el-button>
                <el-popover
                        trigger="click"
                        v-if="extra && extra.indexOf('option') != -1"
                >
                    <el-checkbox
                            v-model="columnsCheckedAll"
                            :indeterminate="columnsCheckedIndeterminate"
                            @change="columnsCheckAllChange"
                    >全选
                    </el-checkbox>
                    <el-divider style="margin: 5px 0"></el-divider>
                    <el-checkbox-group
                            v-model="columnsChecked"
                            @change="columnsCheckChange"
                    >
                        <div v-for="column in columnsCur" v-if="column.prop">
                            <el-checkbox :label="column.prop" :key="column.prop">{{column.label}}</el-checkbox>
                        </div>

                    </el-checkbox-group>
                    <el-button v-if="extra && extra.indexOf('columns') != -1" slot="reference" type="text"
                               icon="el-icon-setting"></el-button>
                </el-popover>
            </div>
        </div>
        <el-table
                v-bind="$attrs"
                v-on="$listeners"
                :data="tableData"
                v-loading="loading"
                sort-method="false"
                @sort-change="sortChange"
                style="width: 100%"
        >
            <template v-for="item in columnsCur" v-if="item.show != false">
                <el-table-column
                        v-if="item.render"
                        v-bind="{sortable: (item.sortable ? 'custom' : false), key: item.prop, ...item}"
                        :class-name="item.ellipsis && 'cell-ellipsis'"
                >
                    <template slot-scope="scope">
                        <ep-render :scope="scope" :row="scope.row" :render="item.render"
                                   :value="scope.row[item.prop]"></ep-render>
                    </template>
                </el-table-column>
                <el-table-column
                        v-else
                        v-bind="{sortable: (item.sortable ? 'custom' : false), key: item.prop, ...item}"
                        :class-name="item.ellipsis && 'cell-ellipsis'"
                ></el-table-column>
            </template>
        </el-table>

        <div v-if="pagination" class="table-bottom-right">
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
        name: "EpTable",
        inheritAttrs: false,
        props: {
            data: Array,
            request: [Object, Function],
            responseFormat: Function,
            columns: Array,
            pagination: {
                type: [Object, Boolean],
                default() {
                    return {
                        total: 0,
                        pageSize: 10,
                        pageSizes: [10, 50, 100, 200],
                        pageNo: 1,
                        layout: "total, prev, pager, next, sizes"
                    }
                }
            },
            searchField: {
                type: [String, Boolean], default() {
                    return "search"
                }
            },
            extra: {
                type: [Array, Boolean], default() {
                    return ["refresh", "columns"]
                }
            },
            autoLoading: {
                type: Boolean,
                default() {
                    return true;
                }
            }
        },
        data() {
            return {
                tableData: this.data,
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
                if (this.request instanceof Function) {
                    this.loading = true;
                    this.request(this.getOption()).then(resp => {
                        if (!this.responseFormat) {
                            this.tableData = resp.rows;
                            this.pagination.total = resp.total == undefined && resp.rows.length || resp.total || 0;
                        } else {
                            var {rows, total} = this.responseFormat(resp);
                            this.tableData = rows;
                            this.pagination.total = total;
                        }
                        this.loading = false;
                    });
                }

                else if (this.request instanceof Object) {
                    var url = this.request.url;
                    var method = this.request.method;
                    var params = this.request.params;
                    var data = this.request.data;

                    //自带属性，如翻页、排序、搜索放在哪个字段（params/data）。
                    var optionField = this.request.optionField;

                    if (optionField == "data" || (!optionField && (method || "GET").toUpperCase() == "POST")) data = {...this.getOption(), ...data};
                    else params = {...this.getOption(), ...params};

                    this.loading = true;
                    Http.easyRequest(url, method, params, data,
                        final => {
                            if (!this.responseFormat) {
                                this.tableData = final.rows;
                                this.pagination.total = final.total == undefined && final.rows.length || final.total || 0;
                            } else {
                                var {rows, total} = this.responseFormat(final);
                                this.tableData = rows;
                                this.pagination.total = total;
                            }
                            this.loading = false;
                        });
                }
            },
            refresh: function () { //刷新，供父组件调用
                this.getTableData();
            },
            reset: function () { //重置，从第一页开始显示
                this.pagination.pageNo = 1;
                this.pagination.total = 0;
                this.refresh();
            },
            getOption: function () {
                var options = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    sortBy: this.sortBy
                }
                if (this.searchField != false) options[this.searchField] = this.search;
                else options = {...options, ...this.search}
                return options;
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
            if (this.autoLoading) this.getTableData();
        },
        watch: {
            search: function () {
                if (this.searchField != false) this.getTableData();
            },
        }
    }
</script>

<style>
    .ep-table .table-top {
        margin-bottom: 10px;
    }

    .ep-table .table-top-left {
        float: left;
        display: flex;
    }

    .ep-table .table-top-left .input-with-select {
        width: 300px;
    }

    .ep-table .table-top-left > * {
        margin-right: 15px;
    }

    .ep-table .table-top-right {
        float: right;
        display: flex;
        font-size: 20px;
    }

    .ep-table .table-top-right button {
        font-size: 20px;
    }

    .ep-table .table-top-right > * {
        margin-right: 5px;
    }

    .ep-table .table-bottom-right {
        text-align: right;
        margin-top: 20px;
    }

    .ep-table .table-bottom-right .el-pagination {
        padding: 0;
    }

    .ep-table .el-popover {
        margin: 0 !important;
    }

    .ep-table .el-table-column--selection .cell {
        padding: 0 2px !important;
    }

    .ep-table .cell-ellipsis .cell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .ep-table .cell-ellipsis .cell:hover {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
    }

</style>

<style scope>
    .el-divider--horizontal {
        margin: 5px 0 !important;
    }
</style>
