<!--
	作者：masonchen
	时间：2017-07-07
	描述：查轨迹 > 轨迹信息组件
-->
<template>
	<div>
		<div class="travel_info">
			<ul>
				<li>
					<p class="pp01"><span>行车时长</span><em>{{traceInfo.carPassedTime}}分钟</em></p>
				</li>
				<li>
					<p class="pp02"><span>行驶里程</span><em>{{traceInfo.mileage}}km</em></p>
				</li>
				<li>
					<p class="pp03"><span>平均速度</span><em>{{traceInfo.avgSpeed}}km/h</em></p>
				</li>
			</ul>
		</div>
		<div class="location_info" style="height: 52px;">
			<a v-if="hasPervious" class="arrows_l03" @click='lastPoint()'></a>
			<p id="location_info">
				<i>位置：{{gpsInfo.address}}</i>
			</p>
			<a v-if="hasNext" class="arrows_r03" @click='nextPoint()'></a>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				carPassedTime: "",
				mileage: "",
				avgSpeed: "",
				location: '',
				hasPervious:false,
				hasNext:false,
				swipe:{						// 左滑动，右滑动的参数
					startPoint:"",
					endPoint: ""
				}
			}
		},
		props:['gpsInfo','traceInfo'],
		computed: {
			traceList(){
				return this.$store.state.traceList;
			}
		},
		watch: {
			traceList(val){
				this.hasPervious = true;
				this.hasNext = true;
//				let val = this.$store.state.traceList;
				if(val.currIndex == 0){	// 预览所有轨迹，不显示前后按钮
					this.hasPervious = false;
					this.hasNext = false;
					return;
				}
				if(val.currIndex == 1){	// 只显示后一个的按钮
					this.hasPervious = false;
				}
				if(val.currIndex == val.list.length - 1){	// 只显示前一个的按钮
					this.hasNext = false;
				}
			}
		},
		mounted(){
			this.hasPervious = true;
			this.hasNext = true;
			let val = this.$store.state.traceList;
			if(val.currIndex == 0){	// 预览所有轨迹，不显示前后按钮
				this.hasPervious = false;
				this.hasNext = false;
				return;
			}
			if(val.currIndex == 1){	// 只显示后一个的按钮
				this.hasPervious = false;
			}
			if(val.currIndex == val.list.length - 1){	// 只显示前一个的按钮
				this.hasNext = false;
			}
			this.handleSwipe();
		},
		methods: {
			getLocationInfo: function(info) {
				this.location = info;
			},
			lastPoint: function() { //上一个
				if(!this.hasPervious)
					return;
				this.$store.commit({
					type: 'setTraceList',
					obj: {
						list: this.traceList.list,
						currIndex: this.traceList.currIndex - 1,
						vehicleNum:this.traceList.vehicleNum,
						fromFooter:true
					}
				})
			},
			nextPoint: function() { // 下一个
				if(!this.hasNext)
					return;
				this.$store.commit({
					type: 'setTraceList',
					obj: {
						list: this.traceList.list,
						currIndex: this.traceList.currIndex + 1,
						vehicleNum:this.traceList.vehicleNum,
						fromFooter:true
					}
				})
			},
			// 处理滑动
			handleSwipe(val){
				// 监听左滑动和右滑动的事件
				let { swipe } = this;
				const that = this;
				let el = document.getElementsByClassName("location_info")[0];
				el.addEventListener("touchstart",function(event){
					swipe.startPoint = event.touches[0];
				})
				el.addEventListener("touchend",function(event){
					swipe.endPoint = event.changedTouches[0];
					if(swipe.startPoint.pageX - swipe.endPoint.pageX > 5) {
						that.nextPoint();
					} else if(swipe.startPoint.pageX - swipe.endPoint.pageX < -5){
						that.lastPoint();
					}
				})
			}
		}
	}
</script>
<style scoped>
.travel_info {width: 100%; background: #fff; border-top: 1px solid #e3e3e3; padding: 10px 0; box-sizing: border-box; overflow:hidden;  }
.travel_info ul {display:flex;}
.travel_info li { flex:1;float:left; text-align:center; border-right:1px  dotted #ccc; box-sizing:border-box;} 
.travel_info li:last-of-type { border:0;}
.travel_info p { padding-left:27px; display:inline-block; text-align:left; font-size:12px; background: left center no-repeat; background-size:24px;}
.travel_info .pp01 { background-image:url(../images/ico_32.png);}
.travel_info .pp02 { background-image:url(../images/ico_33.png);}
.travel_info .pp03 { background-image:url(../images/ico_34.png);}
.travel_info p span { display:block; color:#999;}
.travel_info p em { display:block; color:#333;}
.location_info {width: 100%; background: #fff; border-top: 1px solid #e3e3e3; padding: 5px 5px; box-sizing: border-box; overflow: hidden; }
.location_info p { text-align:center; width:100%; margin-right:-50px; float:left; padding-right:45px; padding-left:5px; box-sizing:border-box; line-height:22px; z-index:0; overflow: hidden; position:relative;}
.location_info p span { display:block;white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color:#666;}
.location_info p em {display:block; color:#999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.location_info p i {display:block; color:#666; margin-top: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}

.arrows_l03 { float: left; background: url(../images/ico_01.png) center center no-repeat; background-size: 20px; height: 34px; width: 20px; margin-top:0px; z-index:1; position:relative;}
.arrows_r03 { float: right; background: url(../images/ico_02.png) center center no-repeat; background-size: 20px; height: 34px; width: 20px; margin-top:0px; z-index:1;  position:relative;}
</style>
