import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		traceMap:{
			traceParams: {
				queryDate: "",
				traceRecordId: "",
				vehicleId:""
			}
		},
		traceList:{
			list: [],
			currIndex:0,
			vehicleNum:"",
			fromFooter:false
		}
	},
	mutations: {
		setTraceParams (state, param) {
			state.traceMap = param.obj;
		},
		setTraceList (state, param) {
			state.traceList = param.obj;
		}
	}
	
})