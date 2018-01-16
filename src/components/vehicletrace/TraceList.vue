<!--
	作者：masonchen
	时间：2017-07-06
	描述：查轨迹 > 轨迹列表
-->
<template>
	<div>
		<x-header style="position: fixed;width: 100%;top: 0;z-index: 2;"
			:left-options="{showBack: false}">
			<div class="header_title">
				轨迹列表
			</div>
			<x-icon @click.native="showMenu" slot="right" type="navicon" size="30" style="fill:#0084FF;position:relative;top:-8px;left:-3px;"></x-icon>
		</x-header>
		<!--内容开始-->
		<div class="main mt86">
			<!-- 顶部日期和车辆调整开始 -->
			<div class="date_car">
				<ul>
					<li>
						<a class="arrows_l02" @click="lastDay(1)"></a><span><a class="aadate">
		 						<datetime v-model="selectedDate" @on-change="dateChange" title="标题" clear-text="今天" @on-clear="setToday">
							        <span>{{selectedDate}}</span>
		 						</datetime>
							</a></span>
						<a class="arrows_r02" @click="lastDay(2)"></a>
					</li>
					<li>
						<span><a class="aacar">
							<select v-model="selecting" v-on:change="vehicleChange">
								<option v-for="vehicle in vehicleList" v-bind:value="vehicle">
									{{ vehicle.vehicleNum }}
								</option>
							</select>
						</a></span>
					</li>
				</ul>
			</div>
			<!-- 顶部日期和车辆调整结束 -->
			<!-- 轨迹列表开始 -->
			<div class="track_list">
				<div v-for='(trace,index) in traceList'>
					<dl v-if="index != 0">
						<dt><span>全程：<b>{{trace.mileage}}km</b></span><em>平均速度：<b>{{trace.avgSpeed}}km/h</b></em></dt>
						<dd>
							<div class="trcak_l">
								<p><span>起</span><em><b><i> {{trace.startTimeFat.split(' ')[1].substring(0,5)}}分，出发于</i></b><b>{{trace.startLocate}}</b></em> </p>
								<p><span>终</span><em><b><i> {{trace.endTimeFat.split(' ')[1].substring(0,5)}}分，行驶至</i></b><b>{{trace.endLocate}}</b></em> </p>
							</div>
							<div class="trcak_r" @click="traceClick(index,trace)">
								<a><span></span><em>查看</em></a>
							</div>
						</dd>
					</dl>
				</div>
			</div>
			<!-- 轨迹列表结束 -->
		</div>
		<!--  菜单  -->
		<div v-transfer-dom>
	    	<actionsheet @on-click-menu="clickMenu" :menus="menus" v-model="showMenus" show-cancel></actionsheet>
	    </div>
	</div>
</template>

<script>
	import { XHeader, Datetime, XButton, Actionsheet, TransferDom } from 'vux'

	import traces from './traceList.json'
	import traceVehicle from './traceVehicle.json'

	export default {
		directives: {
		    TransferDom
		},
		components: {
			XHeader,
			XButton,
			Datetime,
			Actionsheet
		},
		data() {
			return {
				value: new Date(),
				traceList: [],
				vehicleList: [],
				selecting: null,
				isLoading: false,
				selectedDate:'',
				showMenus: false,
				vehicleId: "no-vehicle",
				menus: {
			        menu1: '预览全部时段',
			        menu2: '移出轨迹队列'
			    },
			}
		},
		beforeMount() {
			this.setToday();
			this.getVehicleList();
			this.getTraceList();
		},
		methods: {
			// 点击轨迹查看
			traceClick(index,item){
				index = index || 0;
				item = item || this.traceList[index];
				let traceParams = {
					queryDate: this.selectedDate.replace(/-/g,""),
					traceRecordId: item.id,
					vehicleId: this.selecting.vehicleId
				}
				this.$store.commit({
					type: 'setTraceParams',
					obj: {
						traceParams: traceParams
					}
				}),
				
				this.$store.commit({
					type: 'setTraceList',
					obj: {
						list: this.traceList,
						currIndex: index,
						vehicleNum: this.selecting.vehicleNum,
						fromFooter:false
					}
				})
				this.$router.push('/map');
			},
			// 获取轨迹队列
			getVehicleList(){
				this.vehicleList = traceVehicle.data;
				this.selecting = this.vehicleList[0];
			},
			// 获取轨迹列表
			getTraceList(){
				this.traceList = traces.data;
			},
			// 显示菜单
			showMenu(){
				this.showMenus = true;
			},
			// 点击菜单项
			clickMenu(key){
				if(key === 'menu1'){
					this.traceClick();
				} else if(key === 'menu2'){
				}
			},
			//时间选择器钩子
			handleChange(value) {
				this.value = value;
			},
			// 选择车辆
			vehicleChange() {
				this.getTraceList();
			},
			//前一天 后一天
			lastDay(type) {
			},
			dateChange (value) {
				this.getTraceList();
		    },
			setToday () {
				let now = new Date()
				let cmonth = now.getMonth() + 1
				let day = now.getDate()
				if (cmonth < 10) cmonth = '0' + cmonth
				if (day < 10) day = '0' + day
				this.selectedDate = now.getFullYear() + '-' + cmonth + '-' + day
			}
		}
	}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

li {list-style: none;}
i, cite, em, var, address, dfn {
    font-style: normal;
}
select { background-color:transparent; border-color:transparent; -webkit-appearance: none;font-size: 16px;}
.main { margin-top: 48px; z-index: 0;}
.mt86 { margin-top: 80px !important; }

.head {background-color: #fafafa;position: fixed;width: 100%;top: 0;z-index: 2;}
.header_title {font-weight: bold;font-size: 16px;}

/* 顶部日期和车辆调整开始 */
.date_car { height: 35px; background: #fff; position: fixed; top: 43px; width: 100%; z-index: 2; }
.date_car li { float: left; width: 50%; line-height: 35px; box-sizing: border-box; border-top: 1px solid #E6E6E6; border-bottom: 1px solid #E6E6E6; border-right: 1px solid #E6E6E6; padding: 0 3px; text-align: center; height: 35px; }
.date_car li:last-of-type { border-right: 0px; }
.date_car span { }
.date_car span a { display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 34px; text-align: left; line-height: 34px; background: left center no-repeat; }
/*.date_car span a input { display: inline-block; color: #999; max-width: calc( 100% - 70px ); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 34px; text-align: left; line-height: 34px; background: left center no-repeat; }*/
.date_car span .aacar { background-image: url(images/ico_17.png); padding-left: 26px; background-size: 22px; }
.date_car span .aadate { background-image: url(images/ico_16.png); padding-left: 24px; background-size: 20px; }
/* 顶部日期和车辆调整结束 */
.aadate a { padding: 0;max-width: 100% !important; }
.arrows_r01 { float: right; background: url(images/ico_04.png) center center no-repeat; background-size: 20px; height: 42px; width: 20px; }
.arrows_l01 { float: right; background: url(images/ico_03.png) center center no-repeat; background-size: 20px; height: 42px; width: 20px; }
.arrows_r02 { float: right; background: url(images/ico_04.png) center center no-repeat; background-size: 20px; height: 34px; width: 20px; }
.arrows_l02 { float: left; background: url(images/ico_03.png) center center no-repeat; background-size: 20px; height: 34px; width: 20px; }
.arrows_r03 { float: right; background: url(images/ico_02.png) center center no-repeat; background-size: 20px; height: 34px; width: 20px; margin-top:17px; z-index:1;  position:relative;}
.arrows_l03 { float: left; background: url(images/ico_01.png) center center no-repeat; background-size: 20px; height: 34px; width: 20px; margin-top:17px; z-index:1; position:relative;}

/* 轨迹列表开始 */
.track_list { padding: 10px 15px 0; clear: both; }
.track_list dl { border: 1px solid #e6e6e6; background: #fff; padding: 0px; color: #666; margin-bottom: 10px; }
.track_list dt { line-height: 36px; height: 36px; padding: 0 10px; background: #fafafa; border-bottom: 1px solid #e6e6e6; color: #999; }
.track_list dt span { display: inline-block; vertical-align: middle; }
.track_list dt em { float: right; }
.track_list dt b { color: #666; }
.track_list dd { padding: 0 10px; overflow: hidden; }
.track_list dd .trcak_l { float: left; width: 100%; margin-left: -60px; padding-left: 60px; box-sizing: border-box; border-right: 1px solid #E6E6E6; padding-right: 10px; }
.track_list dd .trcak_l p { line-height: 20px; clear: both; padding: 11px 0 9px; overflow: hidden; box-sizing: border-box; border-bottom: 1px dotted #ccc; }
.track_list dd .trcak_l p:last-of-type { border-bottom: 0; }
.track_list dd .trcak_l span { float: left; width: 26px; height: 26px; line-height: 26px; color: #fff; background: #ccc; border-radius: 20px; text-align: center; margin-top: 5px; }
.track_list dd .trcak_l em { float: left; padding-left: 35px; margin-left: -28px; box-sizing: border-box; width: 100%; }
.track_list dd .trcak_l em b { display: block; font-size: 12px; line-height: 18px; }
.track_list dd .trcak_l em b i { color: #999; }
.track_list dd .trcak_r { float: right; width: 60px; height: 100%; text-align: center; padding-left: 10px; box-sizing: border-box; }
.track_list dd .trcak_r a { }
.track_list dd .trcak_r a span { width: 30px; height: 30px; margin-top: 30px; display: inline-block; background: url(./images/ico_43.png) no-repeat; background-size: 30px; ; }
.track_list dd .trcak_r a em { display: inline-block; color: #F29F17; width: 45px; text-align: center; }
/*  轨迹列表结束  */

.validation_fails { padding: 15px 15px 20px; line-height: 18px; }
.validation_fails em { height: 70px; display: block; background: url(images/ico_41.png) no-repeat center center; background-size: 56px; }
.validation_fails span { padding-top: 5px; font-size: 16px; color: #666; display: block; text-align: center; }
.validation_fails i { padding-top: 10px; display: block; color: #aaa; text-align: center; }

</style>
