import Vue from 'vue'
import VueRouter from 'vue-router'

import Location from '../../components/vehiclelocation/Location'
import VehicleView from '../../components/vehiclelocation/vehicle/VehicleView'
import History from '../../components/vehiclelocation/vehicle/History'
import Search from '../../components/vehiclelocation/vehicle/Search'

Vue.use(VueRouter)

export default new VueRouter({
	routes: [
		{
			path: '/',
			component: Location,
			children: [
				{
					path: 'vehicles',
					component: VehicleView
				},{
					path: 'history',
					component: History
				},{
					path: 'search',
					component: Search
				}
			],
			redirect: '/vehicles'
		},{
			path: '*',
			component: Location
		}
	]
})
