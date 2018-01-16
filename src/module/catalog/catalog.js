import Vue from 'vue'

// 注册
Vue.component('my-component', {
  template: '<h1>多页面入口</h1>'
})
// 创建根实例
new Vue({
  el: '#example',
  components:{
  }
})