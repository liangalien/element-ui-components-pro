<template>
  <div id="app">
    <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
      <el-menu-item  index="/table">Table</el-menu-item>
      <el-menu-item  index="/select">Select</el-menu-item>
    </el-menu>
    <div style="margin: 20px">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                active: "/table"
            };
        },
        methods: {
            handleSelect(key) {
                console.log(key);
            }
        }
    }
</script>