<template>
    <div class="ep-select">
        <base-select
                v-bind="{loading: loading, 'remote-method': searchChange, filterable: true, remote: true, ...$attrs}"
                v-on="{'visible-change': visibleChange, ...$listeners}"
                :style="{width: $attrs.width}"
                ref="ep-select"
                :value="value"
                @change="onChange"
        >
            <div>
                <el-tabs v-if="tabs" :value="tabActiveName" type="card" @tab-click="onTabClick">
                    <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label">
                        <div v-if="options.length > 0">
                            <el-option
                                    v-for="(item, index) in options"
                                    :key="index"
                                    :value="item.value"
                                    :label="item.label"
                            >
                                <ep-render v-if="item.render" :render="item.render"></ep-render>
                            </el-option>
                        </div>
                        <el-option :value="null" v-else :disabled="true">
                            <slot name="empty">
                                <div class="ep-select-empty">无数据</div>
                            </slot>
                        </el-option>
                    </el-tab-pane>
                </el-tabs>
                <div v-else-if="options.length > 0">
                    <el-option
                            v-for="(item, index) in options"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                    >
                        <ep-render v-if="item.render" :render="item.render"></ep-render>
                    </el-option>
                </div>
                <el-option :value="null" v-else :disabled="true">
                    <slot name="empty">
                        <div class="ep-select-empty">无数据</div>
                    </slot>
                </el-option>
            </div>

        </base-select>
    </div>
</template>

<script>
    import Http from '../utils/http';
    import BaseSelect from './select.js';

    export default {
        components: {BaseSelect},
        inheritAttrs: false,
        props: {
            request: [Object, Function],
            responseFormat: Function,
            pagination: {
                type: Object,
                default() {
                    return {
                        total: 0,
                        pageSize: 10,
                        pageNo: 1
                    }
                }
            },
            searchField: {type: [String, Boolean], default: "search"},
            tabs: Array,
            tabActiveName: [String],
            value: true
        },
        data() {
            return {
                loading: false,
                options: [],
                search: null,
                getSelectData: function () {
                    if (this.request instanceof Function) {
                        this.loading = this.pagination.pageNo == 1;
                        this.request(this.getOption()).then(resp => {
                            if (!this.responseFormat) {
                                var rows = resp.rows;
                                var total  = resp.total == undefined && resp.rows.length || resp.total || 0;
                            } else {
                                var {rows, total} = this.responseFormat(resp);
                            }
                            this.options = this.options.concat(rows);
                            this.pagination.total = total;
                            this.loading = false;
                        });
                    }

                    else if (this.request instanceof Object) {
                        var url = this.request.url;
                        var method = this.request.method;
                        var params = this.request.params;
                        var data = this.request.data;

                        //自带属性，如搜索放在哪个请求字段（params/data）。
                        var optionField = this.request.optionField;
                        var option = this.getOption()

                        if (optionField == "data" || (!optionField && (method || "GET").toUpperCase() == "POST"))
                            data = {...option, ...data};
                        else
                            params = {...option, ...params};

                        var responseFormat = this.responseFormat;
                        this.loading = this.pagination.pageNo == 1; //第一页加载的时候，才会显示loading
                        Http.easyRequest(url, method, params, data, final => {
                            if (!responseFormat) {
                                var rows = final.rows || [];
                                var total = final.total == undefined && final.rows.length || final.total || 0;

                            } else {
                                var {rows, total} = responseFormat(final);
                            }

                            this.options = this.options.concat(rows);
                            this.pagination.total = total;
                            this.loading = false;
                        });
                    }
                },
            }
        },
        methods: {
            onChange(val) {
                this.$emit("input", val);
            },
            visibleChange: function(visible) {
                if (visible) {
                    this.pagination.pageNo = 1;
                    this.options = [];
                    this.search = null;

                    this.getSelectData();
                }
            },
            searchChange: function(value) {
                this.search = value;

                this.options = [];
                this.pagination.pageNo = 1;
                this.getSelectData();
            },
            scrollBottom: function () {
                var scroll= this.$refs["ep-select"].$el.querySelector(".el-scrollbar__wrap");
                var that = this;
                scroll.addEventListener('scroll', function () {
                    const bottom = this.scrollHeight - this.scrollTop.toFixed(0) <= this.clientHeight; //是否滑动到底部

                    if (bottom && that.options.length < that.pagination.total) {
                        that.pagination.pageNo += 1;
                        that.getSelectData();
                    }
                });
            },
            onTabClick(tab) {
                this.$emit("update:tabActiveName", tab.name);
            },
            refresh() {
                this.getSelectData();
            },
            reset() {
                this.options = [];
                this.pagination.pageNo = 1;

                let scroll = document.querySelector(".el-select-dropdown:has(.el-tabs) .el-scrollbar__wrap");
                scroll.scrollTop = 0; //滚动到顶部
            },
            getOption: function () {
                var options = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                }
                if (this.searchField != false) options[this.searchField] = this.search;
                else options = {...options, ...this.search}
                return options;
            },
        },
        mounted() {
            this.scrollBottom();
        }
    }
</script>

<style>
    .el-select-dropdown:has(.el-tabs) .el-select-dropdown__list {
        padding: 0;
    }

    .el-select-dropdown:has(.el-tabs) .el-tabs__item {
        padding: 8px 20px;
    }

    .el-select-dropdown:has(.el-tabs) .el-tab-pane {
        height: auto;
    }

    .el-select-dropdown:has(.el-tabs) .el-tabs__header {
        position: absolute;
        background-color: white;
        width: 100%;
        z-index: 2;
    }

    .el-select-dropdown:has(.el-tabs) .el-select-dropdown__item:first-child {
        margin-top: 37px;
    }

    .ep-select-empty {
        text-align: center;
    }

    .el-select-dropdown:has(.ep-select-empty) .el-select-dropdown__list {
        overflow: auto;
    }

    .el-select-dropdown:has(.el-tabs) .el-tabs__nav {
        border-top: none !important;
        border-left: none !important;
    }

    .ep-select .el-select--medium .el-select__tags .el-tag {
        height: 28px;
        color: #666666;
        font-size: 14px;
    }

    .ep-select .el-select__tags .el-icon-close {
        transform: none;
        background-color: transparent;
    }
</style>
