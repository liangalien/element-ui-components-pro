import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Components from './components/components'
import App from './App.vue';

import Table from './example/table';

import Select from './example/select';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Components);

var myRouter = new VueRouter({
    mode: "history",
    routes: [
        {path: "", component: Table},
        {path: "/table", component: Table},
        {path: "/select", component: Select},
    ]
});

new Vue({
    el: '#app',
    render: h => h(App),
    router: myRouter,
});
