<template>
    <ep-select multiple v-model="value" :request="request" :responseFormat="responseFormat" @change="change"/>
</template>

<script>
    export default {
        name: "",
        data() {
            return {
                value: null,
                request: {
                    url: "/table.json",
                    method: "GET"
                },
                responseFormat: resp => {
                    return {
                        rows: resp.body.rows.map(row => {
                            return {
                                value: row.id,
                                label: row.name,
                                render: <span>{row.name}<el-tag  size="small" style="margin-left: 10px" type={row.status == "正常" ? "success" : "warning"}>{row.status}</el-tag></span>
                            }
                        }),
                        total: resp.body.total
                    }
                }
            }
        },
        methods: {
            change: function (e) {
                console.log("e",e)
            }
        }
    }
</script>