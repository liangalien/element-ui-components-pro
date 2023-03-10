import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Components from './components/components'
import App from './App.vue';
import Table from './example/table';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Components);

var myRouter = new VueRouter({
    mode: "history",
    routes: [
        {path: "", component: Table},
    ]
});

new Vue({
    el: '#app',
    render: h => h(App),
    router: myRouter,
});
