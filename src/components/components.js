import EPRender from './render';
import EPTable from './table';

export default {
    install(Vue) {
        Vue.component("EpRender", EPRender);
        Vue.component("EpTable", EPTable);
    }
};