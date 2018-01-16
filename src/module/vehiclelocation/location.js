import Vue from 'vue'
import VueResource from 'vue-resource'

import Location from 'components/vehiclelocation/Location'
import { LoadingPlugin, ToastPlugin } from 'vux'
import router from 'router/vehiclelocation'

import "babel-polyfill";


//开启debug模式
//Vue.config.debug = true;
Vue.use(VueResource)
// 以插件的形式使用vux组件
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)

Vue.http.interceptors.push(function(request, next) {
    console.log("fetching " + request.url + "\n" + JSON.stringify(request.params));
    console.log(request)
    this.$vux.loading.show({
        text: '加载中'
    })
    next((response) => {
        Vue.$vux.loading.hide();
        return response;
    })
})
Vue.http.options.emulateJSON = true;
new Vue({
    el: '#app',
    router,
    components: {
        Location
    }
})