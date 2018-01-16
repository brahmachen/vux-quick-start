<template>
	<div>
		<x-header>定位查车</x-header>
		<div style="position: relative; width: 100%;">
			<tab bar-active-color="#0084FF" active-color="#0084FF">
				<tab-item :selected="currView === 'VIEW1'" @on-item-click="onItemClick('VIEW1')">企业车辆视图</tab-item>
				<tab-item :selected="currView === 'VIEW2'" @on-item-click="onItemClick('VIEW2')">车辆查询历史</tab-item>
				<tab-item :selected="currView === 'VIEW3'" @on-item-click="onItemClick('VIEW3')">车辆检索</tab-item>
			</tab>
			
		</div>
		<div class="container">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>
	</div>
</template>

<script>
	import { Tab, TabItem, XHeader } from 'vux'
	import Search from 'components/vehiclelocation/vehicle/Search'
	import VehicleView from 'components/vehiclelocation/vehicle/VehicleView'
	import History from 'components/vehiclelocation/vehicle/History'
	
	export default {
		name:"location",
		components: {
			Tab,
			TabItem,
			Search,
			VehicleView,
			History,
			XHeader
		},
		data() {
			return {
				currView: "VIEW1",
			}
		},
		methods: {
			onItemClick(flag){
				flag = flag || 'VIEW1';
				this.currView = flag;
				if(flag === 'VIEW1'){
					this.$router.replace('/vehicles');
				} else if(flag === 'VIEW2'){
					this.$router.replace('/history');
				} else {
					this.$router.replace('/search');
				}
			}
		},
		beforeMount(){
			if(this.$route.path === '/history'){
				this.currView = "VIEW2";
			} else if (this.$route.path === '/search'){
				this.currView = "VIEW3";
			}
		},
		
	}
</script>

<style lang="less" scoped="true">
	@import '~vux/src/styles/reset.less';
	.container {
		width: 100%;
		position: absolute;
		top: 90px;
		bottom: 0px;
		left: 0px;
		overflow: scroll;
		background-color: gainsboro;
	}
</style>