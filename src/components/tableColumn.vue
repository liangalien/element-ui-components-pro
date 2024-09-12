<template>
    <el-table-column v-if="column && column.show != false"
                     v-bind="{sortable: (column.sortable ? 'custom' : false), ...column}"
                     :class-name="column.ellipsis && 'cell-ellipsis'"
    >
        <template v-slot="scope" v-if="column.render">
            <ep-render :row="scope.row" :scope="scope" :render="column.render"
                       :value="scope.row[column.prop]"
            />
        </template>

        <template slot="header" v-if="column.header">
            <ep-render :render="column.header"/>
        </template>

        <template v-if="column.children">
            <ep-table-column v-for="(child, idx) in column.children" :key="idx" :column="child" ref="child"/>
        </template>
    </el-table-column>
</template>

<script>
    export default {
        name: "EpTableColumn",
        props: {
            column: Object
        },
    }
</script>

<style scoped>

</style>
