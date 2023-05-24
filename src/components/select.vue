<template>
    <div class="ep-select">
        <el-select
                v-bind="{loading: loading, 'remote-method': searchChange, filterable: true, remote: true, ...$attrs}"
                v-on="{'visible-change': visibleChange, ...$listeners}"
                :style="{width: $attrs.width}"
                ref="ep-select"
                v-model="value"
        >
            <div>
                <el-tabs v-if="tabs" :value="tabActiveName" type="card" @tab-click="onTabClick">
                    <el-tab-pane v-for="tab in tabs" :name="tab.name" :label="tab.label">
                        <div v-if="options.length > 0">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                            >
                                <ep-render v-if="item.render" :render="item.render"></ep-render>
                            </el-option>
                        </div>
                        <el-option v-else :disabled="true">
                            <div class="ep-select-empty">无数据</div>
                        </el-option>
                    </el-tab-pane>
                </el-tabs>
                <div v-else-if="options.length > 0">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                    >
                        <ep-render v-if="item.render" :render="item.render"></ep-render>
                    </el-option>
                </div>
                <el-option v-else :disabled="true">
                    <div class="ep-select-empty">无数据</div>
                </el-option>
            </div>

        </el-select>
    </div>
</template>

<script>
    import Http from '../utils/http';

    export default {
        inheritAttrs: false,
        props: {
            request: Object,
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
            tabActiveName: [String]
        },
        data() {
            return {
                value: null,
                loading: false,
                options: [],
                search: null,
                getSelectData: function () {
                    if (!this.request) return;

                    var url = this.request.url;
                    var method = this.request.method;
                    var params = this.request.params;
                    var data = this.request.data;

                    //自带属性，如搜索放在哪个请求字段（params/data）。
                    var optionField = this.request.optionField;
                    var option = {
                        pageNo: this.pagination.pageNo,
                        pageSize: this.pagination.pageSize,
                        [this.searchField]: this.search
                    };

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
                },
            }
        },
        methods: {
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

                let scroll = this.$refs["ep-select"].$el.querySelector(".el-scrollbar__wrap");
                scroll.scrollTop = 0; //滚动到顶部
            },
            getCurSelected() {
                let selected = this.$refs["ep-select"].selected;
                if (selected) {
                    if (selected instanceof Array) {
                        return selected.map(s => {
                            return {
                                value: s.value,
                                label: s.label
                            }
                        })
                    } else {
                        return {
                            value: selected.value,
                            label: selected.label
                        }
                    }
                } else {
                    return null;
                }
            }
        },
        mounted() {
            this.scrollBottom();
        }
    }
</script>

<style>
    .ep-select .el-select-dropdown__list:has(.el-tabs) {
        padding: 0;
    }

    .ep-select .el-tabs__item {
        padding: 8px 20px;
    }

    .ep-select .el-tab-pane {
        height: auto;
    }

    .ep-select .el-tabs__header {
        position: absolute;
        background-color: white;
        width: 100%;
        z-index: 2;
    }

    .ep-select:has(.el-tabs) .el-select-dropdown__item:first-child {
        margin-top: 37px;
    }

    .ep-select-empty {
        text-align: center;
    }

    .ep-select:has(.ep-select-empty) .el-select-dropdown__list {
        overflow: auto;
    }

    .ep-select .el-tabs__nav {
        border-top: none !important;
        border-left: none !important;
    }

</style>