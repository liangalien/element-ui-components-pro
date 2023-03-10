<template>
    <div class="ep-select">
        <el-select
            v-bind="{loading: loading, 'remote-method': searchChange, filterable: true, remote: true, ...$attrs}"
            v-on="{'visible-change': visibleChange, ...$listeners}"
            ref="ep-select"
            v-model="value"
        >
            <el-option
                v-for="item in options"
                :key="item.value"
                :value="item.label"
            >
                <ep-render v-if="item.render" :render="item.render"></ep-render>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import Http from '../utils/http';

    export default {
        name: "EpSelect",
        inheritAttrs: false,
        props: {
            request: Object,
            responseFormat: Function,
            pagination: {
                type: Object,
                default: {
                    total: 0,
                    pageSize: 10,
                    pageNo: 1
                }
            },
            searchField: {type: [String, Boolean], default: "search"}
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
                this.pagination.pageNo = 1;
                this.options = [];
                this.search = null;

                if (visible) {
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
            }
        },
        mounted() {
            this.scrollBottom();
        }
    }
</script>