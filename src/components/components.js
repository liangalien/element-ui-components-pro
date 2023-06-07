import EPRender from './render';
import EPTable from './table';
import EPSelect from './select.vue';

export default {
    install(Vue) {
        Vue.component("EpRender", EPRender);
        Vue.component("EpTable", EPTable);
        Vue.component("EpSelect", EPSelect);
    }
};