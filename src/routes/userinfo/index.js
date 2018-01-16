import Vue from 'vue'
import VueRouter from 'vue-router'

import User from '../../components/userinfo/User'

Vue.use(VueRouter)

export default new VueRouter({
	routes: [
		{
			path: '/',
			redirect: '/user'
		},
		{
			path: '/user',
			component: User
		}
	]
})
