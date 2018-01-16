import Vue from 'vue'
import VueResource from 'vue-resource'
import User from 'components/userinfo/User'

//开启debug模式
Vue.config.debug = true;
Vue.use(VueResource);

import router from 'router/userinfo'

import  { LoadingPlugin,ToastPlugin } from 'vux'
// 以插件的形式使用vux组件
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)

Vue.http.interceptors.push(function(request, next) {
	console.log("fetching "+ request.url + "\n" + JSON.stringify(request.params));
   	this.$vux.loading.show({
   		text:'加载中'
   	})
   	const that = this;
	next((response) => {
		Vue.$vux.loading.hide();
		// TODO 处理请求错误
	 	// if(!response.data.success){
	 	// 	this.$vux.toast.show({
	 	// 		type:'warn',
	 	// 		text:response.data.message || '未知错误'
	 	// 	})
	 	// }
	    return response;
	})
})
new Vue({
	el: '#app',
	router,
	components: {
		User
	}
})
