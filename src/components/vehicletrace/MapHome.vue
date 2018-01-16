<!--
	作者：masonchen
	时间：2017-07-07
	描述：查轨迹 > 地图页面主组件
-->
<template>
	<div>
		<x-header>
			<div class="header_title">
				行车轨迹  车号：{{traceList.vehicleNum}}
			</div>
			<x-icon @click="goBack" slot="overwrite-left" type="ios-arrow-left" size="30" style="fill:#0084FF;position:relative;top:-8px;left:-3px;"></x-icon>
		</x-header>
		<div v-bind:style="mapStyle">
			<trace-map
				:gpsInfoList = "traceInfo.gpsInfoList"
				:routeLeave="routeLeave"
				@location-change="handleLocation"
				>
			</trace-map>
			<!--行车速度图示开始-->
	  		<div class="map_graphic"></div>
		</div>
		<trace-footer
			:gpsInfo="currLocation"
			:traceInfo="traceInfo">
		</trace-footer>
	</div>
</template>
<script>
	import { XHeader, Actionsheet, TransferDom } from 'vux'
	import TraceMap from 'components/vehicletrace/map/TraceMap'
	import TraceFooter from 'components/vehicletrace/map/TraceFooter'

	import traceData from './trace.json'
	export default {
		components: {
			XHeader,
			Actionsheet,
			TraceMap,
			TraceFooter
		},
		data(){
			return {
				mapStyle: {
					width: '100%',
					height: '0px'
				},
				traceInfo:{},
				currLocation:{},				// 当前位置信息
				routeLeave:false,
				traceRecordId:""
			}
		},
		computed: {
			storeInfo(){
				return this.$store.state.traceMap;
			},
			traceList(){
				return this.$store.state.traceList;
			}
		},
		watch: {
			storeInfo(val){
				this.params =  val.traceParams;
				this.getTraceInfo(this.params.traceRecordId);
			},
			traceList(val){
				if(val.fromFooter){
					this.traceRecordId =  val.list[val.currIndex].id
					this.getTraceInfo(this.traceRecordId);
				}
			}
		},
		beforeMount(){
			this.getTraceInfo(this.$store.state.traceMap.traceParams.traceRecordId);
		},
		mounted(){
			this.mapStyle.height = parseInt(document.documentElement.clientHeight) - (46 + 111) + 'px'
		},
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.$data.routeLeave = false;
			})
		},
		methods: {
			// 获取轨迹信息
			getTraceInfo(traceRecordId){
				this.traceInfo = traceData.data;
			},
			goBack() {
				this.routeLeave = true;
				this.$router.go(-1);
			},
			handleLocation(val){
				this.currLocation = val;
			}
		}
	}
</script>
<style>
.header_title {font-weight: bold;font-size: 16px;}
.vux-header .vux-header-title, .vux-header h1{margin:0 0px !important;}
.map_graphic{background:url(images/map_graphic02.png) ; width:55px; height:110px; background-size:100%; position:absolute; bottom:130px; left:10px;}
</style>